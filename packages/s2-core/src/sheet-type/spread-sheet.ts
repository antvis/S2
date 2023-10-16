import EE from '@antv/event-emitter';
import {
  Canvas,
  DisplayObject,
  FederatedPointerEvent as CanvasEvent,
  runtime,
  type CanvasConfig,
} from '@antv/g';
import { Renderer } from '@antv/g-canvas';
import {
  delay,
  forEach,
  forIn,
  get,
  includes,
  isEmpty,
  isFunction,
  isString,
  memoize,
  some,
  values,
} from 'lodash';
import { injectThemeVars } from '../utils/theme';
import { BaseCell } from '../cell';
import { MIN_DEVICE_PIXEL_RATIO, S2Event } from '../common/constant';
import { DebuggerUtil } from '../common/debug';
import { i18n } from '../common/i18n';
import { registerIcon } from '../common/icons/factory';
import type {
  CellEventTarget,
  CustomSVGIcon,
  EmitterType,
  Fields,
  InteractionOptions,
  InternalFullyTheme,
  LayoutWidthType,
  OffsetConfig,
  Pagination,
  S2CellType,
  S2DataConfig,
  S2MountContainer,
  S2Options,
  S2RenderOptions,
  S2Theme,
  SortMethod,
  ThemeCfg,
  TooltipContentType,
  TooltipData,
  TooltipOptions,
  TooltipShowOptions,
  Total,
  Totals,
} from '../common/interface';
import { Store } from '../common/store';
import type { BaseDataSet } from '../data-set';
import type { BaseFacet } from '../facet';
import type { Node } from '../facet/layout/node';
import { RootInteraction } from '../interaction/root';
import { getTheme } from '../theme';
import { HdAdapter } from '../ui/hd-adapter';
import { BaseTooltip } from '../ui/tooltip';
import { removeOffscreenCanvas } from '../utils/canvas';
import { clearValueRangeState } from '../utils/condition/state-controller';
import { hideColumnsByThunkGroup } from '../utils/hide-columns';
import { isMobile } from '../utils/is-mobile';
import {
  customMerge,
  getSafetyDataConfig,
  getSafetyOptions,
} from '../utils/merge';
import { getTooltipData, getTooltipOptions } from '../utils/tooltip';

/**
 * 关闭 CSS 解析的开关，可以提升首屏性能,
 * 关闭属性就不支持带单位了，比如 circle.style.r = '20px';
 * 而是要用 circle.style.r = 20;
 */
runtime.enableCSSParsing = false;

export abstract class SpreadSheet extends EE {
  // theme config
  public theme: InternalFullyTheme;

  // store some temporary data
  public store = new Store();

  // the original data config
  public dataCfg: S2DataConfig;

  // Spreadsheet's configurations
  public options: S2Options;

  public dataSet: BaseDataSet;

  /**
   * Facet: determine how to render headers/cell
   */
  public facet: BaseFacet;

  public tooltip: BaseTooltip;

  // the base container, contains all groups
  public container: Canvas;

  public interaction: RootInteraction;

  public hdAdapter: HdAdapter;

  private untypedOn = this.on;

  private untypedEmit = this.emit;

  /**
   * 表格是否已销毁
   */
  private destroyed = false;

  public on = <K extends keyof EmitterType>(
    event: K,
    listener: EmitterType[K],
  ): this => this.untypedOn(event, listener);

  public emit = <K extends keyof EmitterType>(
    event: K,
    ...args: Parameters<EmitterType[K]>
  ): boolean => this.untypedEmit(event, ...args);

  public constructor(
    dom: S2MountContainer,
    dataCfg: S2DataConfig,
    options: S2Options | null,
  ) {
    super();
    this.dataCfg = getSafetyDataConfig(dataCfg);
    this.options = getSafetyOptions(options);
    this.dataSet = this.getDataSet();
    this.setDebug();
    this.initTooltip();
    this.initContainer(dom);
    this.bindEvents();
    this.initInteraction();
    this.initTheme();
    this.initHdAdapter();
    this.registerIcons();
    this.setOverscrollBehavior();
  }

  public isCustomHeaderFields(
    fieldType?: keyof Pick<Fields, 'columns' | 'rows'>,
  ): boolean {
    const { fields } = this.dataCfg;

    if (!fieldType) {
      return some(
        [...fields?.rows!, ...fields?.columns!],
        (field) => !isString(field),
      );
    }

    return some(fields?.[fieldType], (field) => !isString(field));
  }

  public isCustomColumnFields(): boolean {
    return this.isCustomHeaderFields('columns');
  }

  private setOverscrollBehavior() {
    const { overscrollBehavior } = this.options.interaction!;
    // 行内样式 + css 样式
    const initOverscrollBehavior = window
      .getComputedStyle(document.body)
      .getPropertyValue(
        'overscroll-behavior',
      ) as InteractionOptions['overscrollBehavior'];

    // 用户没有在 body 上主动设置过 overscrollBehavior，才进行更新
    const hasInitOverscrollBehavior =
      initOverscrollBehavior && initOverscrollBehavior !== 'auto';

    if (hasInitOverscrollBehavior) {
      this.store.set('initOverscrollBehavior', initOverscrollBehavior);
    } else if (overscrollBehavior) {
      document.body.style.overscrollBehavior = overscrollBehavior;
    }
  }

  private restoreOverscrollBehavior() {
    document.body.style.overscrollBehavior =
      this.store.get('initOverscrollBehavior') || '';
  }

  private setDebug() {
    DebuggerUtil.getInstance().setDebug(this.options.debug!);
  }

  private initTheme() {
    // When calling spreadsheet directly, there is no theme and initialization is required
    this.setThemeCfg({
      name: 'default',
    });
  }

  private getMountContainer(dom: S2MountContainer) {
    const mountContainer = isString(dom) ? document.querySelector(dom) : dom;

    if (!mountContainer) {
      throw new Error('Target mount container is not a DOM element');
    }

    return mountContainer;
  }

  private initHdAdapter() {
    if (this.options.hdAdapter) {
      this.hdAdapter = new HdAdapter(this);
      this.hdAdapter.init();
    }
  }

  private initInteraction() {
    this.interaction = new RootInteraction(this);
  }

  private initTooltip() {
    this.tooltip = this.renderTooltip();
    if (!(this.tooltip instanceof BaseTooltip)) {
      // eslint-disable-next-line no-console
      console.warn(
        `[Custom Tooltip]: ${(
          this.tooltip as unknown
        )?.constructor?.toString()} should be extends from BaseTooltip`,
      );
    }
  }

  private renderTooltip(): BaseTooltip {
    return this.options.tooltip?.render?.(this) || new BaseTooltip(this);
  }

  protected abstract bindEvents(): void;

  public abstract getDataSet(): BaseDataSet;

  /**
   * 是否开启冻结行列头效果
   */
  public abstract enableFrozenHeaders(): boolean;

  /**
   * Check if is pivot mode
   */
  public abstract isPivotMode(): boolean;

  public abstract isCustomRowFields(): boolean;

  /**
   * tree type must be in strategy mode
   */
  public abstract isHierarchyTreeType(): boolean;

  /**
   * Scroll Freeze Row Header
   */
  public abstract isFrozenRowHeader(): boolean;

  /**
   * Check if is pivot mode
   */
  public abstract isTableMode(): boolean;

  /**
   * Check if the value is in the columns
   */
  public abstract isValueInCols(): boolean;

  protected abstract buildFacet(): void;

  public abstract clearDrillDownData(
    rowNodeId?: string,
    preventRender?: boolean,
  ): void;

  public abstract handleGroupSort(event: CanvasEvent, meta: Node): void;

  public showTooltip<T = TooltipContentType>(
    showOptions: TooltipShowOptions<T>,
  ): Promise<void> {
    const { content, event } = showOptions;
    const cell = this.getCell(event?.target);
    const displayContent = isFunction(content)
      ? content(cell!, showOptions)
      : content;

    return new Promise((resolve) => {
      const options: TooltipShowOptions<T> = {
        ...showOptions,
        content: displayContent,
        onMounted: resolve,
      };

      if (isMobile()) {
        // S2 的在点击会触发两次，一次在 Canvas 上，一次会在 Drawer mask 上。
        delay(() => {
          this.tooltip.show?.(options);
        }, 50);
      } else {
        this.tooltip.show?.(options);
      }
    });
  }

  public showTooltipWithInfo(
    event: CanvasEvent | MouseEvent,
    cellInfos: TooltipData[],
    options?: TooltipOptions,
  ) {
    const { enable: showTooltip, content } = getTooltipOptions(this, event)!;

    if (!showTooltip) {
      return;
    }

    const targetCell = this.getCell(event?.target);
    const tooltipData =
      options?.data ??
      getTooltipData({
        spreadsheet: this,
        cellInfos,
        targetCell,
        options: {
          enableFormat: true,
          ...options,
        },
      });

    this.showTooltip({
      data: tooltipData,
      position: {
        x: event.clientX,
        y: event.clientY,
      },
      options,
      event,
      content,
    });
  }

  public hideTooltip() {
    this.tooltip.hide?.();
  }

  public destroyTooltip() {
    this.tooltip.destroy?.();
  }

  public registerIcons() {
    const customSVGIcons = this.options.customSVGIcons;

    if (isEmpty(customSVGIcons)) {
      return;
    }

    forEach(customSVGIcons, (customSVGIcon: CustomSVGIcon) => {
      registerIcon(customSVGIcon.name, customSVGIcon.svg);
    });
  }

  /**
   * Update data config and keep pre-sort operations
   * Group sort params kept in {@see store} and
   * Priority: group sort > advanced sort
   * @param dataCfg
   * @param reset reset: true, 直接使用用户传入的 DataCfg ，不再与上次数据进行合并
   */
  public setDataCfg(dataCfg: S2DataConfig, reset?: boolean) {
    this.store.set('originalDataCfg', dataCfg);
    if (reset) {
      this.dataCfg = getSafetyDataConfig(dataCfg);
    } else {
      this.dataCfg = getSafetyDataConfig(this.dataCfg, dataCfg);
    }

    // clear value ranger after each updated data cfg
    clearValueRangeState(this);
  }

  public setOptions(options: Partial<S2Options>, reset?: boolean) {
    this.hideTooltip();
    if (reset) {
      this.options = getSafetyOptions(options);
    } else {
      this.options = customMerge(this.options, options);
    }

    this.registerIcons();
  }

  private doRender(reloadData = true, options: S2RenderOptions = {}) {
    // 防止表格卸载后, 再次调用 render 函数的报错
    if (
      !this.getCanvasElement() ||
      !window.document.body.contains(this.getCanvasElement())
    ) {
      return;
    }

    const { reBuildDataSet = false, reBuildHiddenColumnsDetail = true } =
      options;

    this.emit(S2Event.LAYOUT_BEFORE_RENDER);

    if (reBuildDataSet) {
      this.dataSet = this.getDataSet();
    }

    if (reloadData) {
      this.clearDrillDownData('', true);
      this.dataSet.setDataCfg(this.dataCfg);
    }

    this.buildFacet();
    if (reBuildHiddenColumnsDetail) {
      this.initHiddenColumnsDetail();
    }

    this.emit(S2Event.LAYOUT_AFTER_RENDER);
  }

  /**
   * 同步渲染
   * @deprecated 适配 g5.0 异步渲染过程中暂时保留
   */
  // eslint-disable-next-line camelcase
  public UNSAFE_render(reloadData?: boolean, options?: S2RenderOptions) {
    this.doRender(reloadData, options);
  }

  public async render(reloadData?: boolean, options?: S2RenderOptions) {
    if (this.destroyed) {
      return;
    }

    await this.container.ready;
    this.doRender(reloadData, options);
  }

  public destroy() {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
    this.restoreOverscrollBehavior();
    this.emit(S2Event.LAYOUT_DESTROY);
    this.facet?.destroy();
    this.hdAdapter?.destroy();
    this.interaction?.destroy();
    this.store?.clear();
    this.destroyTooltip();
    this.clearCanvasEvent();
    this.container?.destroy();

    removeOffscreenCanvas();
  }

  public setThemeCfg(themeCfg: ThemeCfg = {}) {
    const theme = themeCfg?.theme || {};
    const newTheme = getTheme({ ...themeCfg, spreadsheet: this });

    this.theme = customMerge(newTheme, theme);
    injectThemeVars(themeCfg?.name);
  }

  public setTheme(theme: S2Theme) {
    this.theme = customMerge(this.theme, theme);
  }

  /**
   * Update pagination config which store in {@see options}
   * @param pagination
   */
  public updatePagination(pagination: Pagination) {
    this.options = customMerge(this.options, {
      pagination,
    });

    // 清空滚动进度
    this.facet.resetScrollOffset();
  }

  /**
   * 获取当前表格实际内容高度
   */
  public getContentHeight(): number {
    return this.facet.getContentHeight();
  }

  /**
   * 修改表格画布大小，不用重新加载数据
   * @param width
   * @param height
   */
  public changeSheetSize(
    width: number = this.options.width!,
    height: number = this.options.height!,
  ) {
    const canvas = this.getCanvasElement();
    const { width: containerWidth, height: containerHeight } =
      this.container.getConfig();

    const isSizeChanged =
      width !== containerWidth || height !== containerHeight;

    if (!isSizeChanged || !canvas) {
      return;
    }

    this.options = customMerge(this.options, { width, height });
    // resize the canvas
    this.container.resize(width, height);
  }

  /**
   * 获取 <canvas/> HTML元素
   */
  public getCanvasElement(): HTMLCanvasElement {
    return this.container
      .getContextService()
      .getDomElement() as HTMLCanvasElement;
  }

  public getLayoutWidthType(): LayoutWidthType {
    return this.options.style?.layoutWidthType!;
  }

  /**
   * Update scroll's offset, the value can be undefined,
   * indicate not update current value
   * @param offsetConfig
   * default offsetX(horizontal scroll need animation)
   * but offsetY(vertical scroll don't need animation)
   */
  public updateScrollOffset(offsetConfig: OffsetConfig) {
    const config: OffsetConfig = {
      offsetX: {
        value: undefined,
        animate: false,
      },
      offsetY: {
        value: undefined,
        animate: false,
      },
      rowHeaderOffsetX: {
        value: undefined,
        animate: false,
      },
    };

    this.facet.updateScrollOffset(
      customMerge(config, offsetConfig) as OffsetConfig,
    );
  }

  // 获取当前cell实例
  public getCell<T extends S2CellType = S2CellType>(
    target: CellEventTarget,
  ): T | null {
    let parent = target;

    // 一直索引到g顶层的canvas来检查是否在指定的cell中
    while (parent && !(parent instanceof Canvas)) {
      if (parent instanceof BaseCell) {
        // 在单元格中，返回true
        return parent as T;
      }

      parent = (parent as DisplayObject)?.parentNode;
    }

    return null;
  }

  // 获取当前cell类型
  public getCellType(target: CellEventTarget) {
    const cell = this.getCell(target);

    return cell?.cellType;
  }

  /**
   * get total's config by dimension id
   * @param dimension unique dimension id
   */
  public getTotalsConfig(dimension: string): Partial<Totals['row']> {
    const { totals } = this.options;
    const { rows } = this.dataSet.fields;

    const totalConfig = get(
      totals,
      includes(rows, dimension) ? 'row' : 'col',
      {},
    ) as Total;
    const showSubTotals =
      totalConfig.showSubTotals &&
      includes(totalConfig.subTotalsDimensions, dimension)
        ? totalConfig.showSubTotals
        : false;

    return {
      showSubTotals,
      showGrandTotals: totalConfig.showGrandTotals,
      reverseLayout: totalConfig.reverseLayout,
      reverseSubLayout: totalConfig.reverseSubLayout,
      label: totalConfig.label || i18n('总计'),
      subLabel: totalConfig.subLabel || i18n('小计'),
    };
  }

  /**
   * Create all related groups, contains:
   * 1. container -- base canvas group
   * 2. backgroundGroup
   * 3. panelGroup -- main facet group belongs to
   * 4. foregroundGroup
   * @param dom
   * @private
   */
  protected initContainer(dom: S2MountContainer) {
    const {
      width,
      height,
      supportCSSTransform,
      devicePixelRatio = 1,
    } = this.options;

    // base canvas group
    this.container = new Canvas({
      container: this.getMountContainer(dom) as HTMLElement,
      width,
      height,
      devicePixelRatio: Math.max(devicePixelRatio, MIN_DEVICE_PIXEL_RATIO),
      renderer: new Renderer() as unknown as CanvasConfig['renderer'],
      supportsCSSTransform: supportCSSTransform,
    });

    this.updateContainerStyle();
  }

  // canvas 需要设置为 块级元素, 不然和父元素有 5px 的高度差
  protected updateContainerStyle() {
    const canvas = this.getCanvasElement();

    if (canvas) {
      canvas.style.display = 'block';
    }
  }

  // 初次渲染时, 如果配置了隐藏列, 则生成一次相关配置信息
  private initHiddenColumnsDetail = () => {
    const { hiddenColumnFields } = this.options.interaction!;
    const lastHiddenColumnsDetail = this.store.get('hiddenColumnsDetail');

    // 隐藏列为空, 并且没有操作的情况下, 则无需生成
    if (isEmpty(hiddenColumnFields) && isEmpty(lastHiddenColumnsDetail)) {
      return;
    }

    hideColumnsByThunkGroup(this, hiddenColumnFields, true);
  };

  private clearCanvasEvent() {
    const canvasEvents = this.getEvents();

    forIn(canvasEvents, (_, event) => {
      this.off(event);
    });
  }

  /**
   * 获取文本在画布中的测量信息
   * @param text 待计算的文本
   * @param font 文本 css 样式
   * @returns 文本测量信息 TextMetrics
   */
  public measureText = memoize(
    (text: number | string = '', font: unknown): TextMetrics | null => {
      if (!font) {
        return null;
      }

      const ctx = this.getCanvasElement()?.getContext('2d')!;
      const { fontSize, fontFamily, fontWeight, fontStyle, fontVariant } =
        font as CSSStyleDeclaration;

      ctx.font = [
        fontStyle,
        fontVariant,
        fontWeight,
        `${fontSize}px`,
        fontFamily,
      ]
        .join(' ')
        .trim();

      return ctx.measureText(String(text));
    },
    (text: any, font) => [text, ...values(font)].join(''),
  );

  /**
   * 计算文本在画布中的宽度
   * @param text 待计算的文本
   * @param font 文本 css 样式
   * @returns 文本宽度
   */
  public measureTextWidth = (
    text: number | string = '',
    font: unknown,
  ): number => {
    const textMetrics = this.measureText(text, font);

    return textMetrics?.width || 0;
  };

  /**
   * 计算文本在画布中的宽度 https://developer.mozilla.org/zh-CN/docs/Web/API/TextMetrics
   * @param text 待计算的文本
   * @param font 文本 css 样式
   * @returns 文本高度
   */
  public measureTextHeight = (
    text: number | string = '',
    font: unknown,
  ): number => {
    const textMetrics = this.measureText(text, font);

    if (!textMetrics) {
      return 0;
    }

    return (
      textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent
    );
  };

  /**
   * 粗略计算文本在画布中的宽度
   * @param text 待计算的文本
   * @param font 文本 css 样式
   * @returns 文本宽度
   */
  public measureTextWidthRoughly = (text: any, font: any = {}): number => {
    const alphaWidth = this.measureTextWidth('a', font);
    const chineseWidth = this.measureTextWidth('蚂', font);

    let w = 0;

    if (!text) {
      return w;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const char of text) {
      const code = char.charCodeAt(0);

      // /[\u0000-\u00ff]/
      w += code >= 0 && code <= 255 ? alphaWidth : chineseWidth;
    }

    return w;
  };

  public updateSortMethodMap(
    nodeId: string,
    sortMethod: SortMethod,
    replace = false,
  ) {
    const lastSortMethodMap = !replace ? this.store.get('sortMethodMap') : null;

    this.store.set('sortMethodMap', {
      ...lastSortMethodMap,
      [nodeId]: sortMethod,
    });
  }

  public getMenuDefaultSelectedKeys(nodeId: string): string[] {
    const sortMethodMap = this.store.get('sortMethodMap');
    const selectedSortMethod = get(sortMethodMap, nodeId);

    return selectedSortMethod ? [selectedSortMethod] : [];
  }
}
