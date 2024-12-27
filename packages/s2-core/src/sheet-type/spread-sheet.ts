import EE from '@antv/event-emitter';
import {
  Canvas,
  FederatedPointerEvent as CanvasEvent,
  DisplayObject,
  type CanvasConfig,
} from '@antv/g';
import { Renderer } from '@antv/g-canvas';
import {
  forEach,
  forIn,
  get,
  includes,
  isEmpty,
  isFunction,
  isString,
  last,
  memoize,
  some,
  values,
} from 'lodash';
import { BaseCell } from '../cell';
import {
  InterceptType,
  S2Event,
  getDefaultSeriesNumberText,
  getTooltipOperatorSortMenus,
  getTooltipOperatorTableSortMenus,
} from '../common/constant';
import { DebuggerUtil } from '../common/debug';
import { i18n } from '../common/i18n';
import { registerIcon } from '../common/icons/factory';
import type {
  BaseTooltipOperatorMenuOptions,
  CellEventTarget,
  EmitterType,
  Fields,
  InteractionOptions,
  InternalFullyTheme,
  Pagination,
  S2CellType,
  S2DataConfig,
  S2MountContainer,
  S2Options,
  S2RenderOptions,
  S2Theme,
  SimpleData,
  SimplePalette,
  SortMethod,
  ThemeCfg,
  ThemeName,
  TooltipContentType,
  TooltipData,
  TooltipOperatorMenuItems,
  TooltipOperatorOptions,
  TooltipOptions,
  TooltipShowOptions,
  Total,
} from '../common/interface';
import { Store } from '../common/store';
import type { BaseDataSet } from '../data-set';
import type { BaseFacet } from '../facet';
import type { Node } from '../facet/layout/node';
import { RootInteraction } from '../interaction/root';
import { getTheme } from '../theme';
import { HdAdapter } from '../ui/hd-adapter';
import { BaseTooltip } from '../ui/tooltip';
import { getOffscreenCanvas, removeOffscreenCanvas } from '../utils/canvas';
import { clearValueRangeState } from '../utils/condition/state-controller';
import { hideColumnsByThunkGroup } from '../utils/hide-columns';
import { isMobile } from '../utils/is-mobile';
import { customMerge, setupDataConfig, setupOptions } from '../utils/merge';
import { getTooltipData, getTooltipOptions } from '../utils/tooltip';
import type { PivotSheet } from './pivot-sheet';
import type { TableSheet } from './table-sheet';

export abstract class SpreadSheet extends EE {
  public themeName: ThemeName;

  public theme: InternalFullyTheme;

  public store = new Store();

  public dataCfg: S2DataConfig;

  public options: S2Options;

  public dataSet: BaseDataSet;

  public facet: BaseFacet;

  public tooltip: BaseTooltip;

  public container: Canvas;

  public interaction: RootInteraction;

  public hdAdapter: HdAdapter;

  /**
   * 表格是否已销毁
   */
  public destroyed = false;

  protected abstract bindEvents(): void;

  public abstract getDataSet(): BaseDataSet;

  public abstract isPivotMode(): this is PivotSheet;

  public abstract isTableMode(): this is TableSheet;

  public abstract isCustomRowFields(): boolean;

  public abstract isHierarchyTreeType(): boolean;

  public abstract isFrozenRowHeader(): boolean;

  public abstract isValueInCols(): boolean;

  protected abstract buildFacet(): void;

  public abstract clearDrillDownData(
    rowNodeId?: string,
    preventRender?: boolean,
  ): Promise<void>;

  public abstract groupSortByMethod(
    sortMethod: SortMethod,
    meta: Node,
  ): Promise<void> | void;

  public constructor(
    dom: S2MountContainer,
    dataCfg: S2DataConfig,
    options: S2Options | null,
  ) {
    super();
    this.setupDataConfig(dataCfg);
    this.setupOptions(options);
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
    this.mountSheetInstance();
  }

  protected setupDataConfig(dataCfg: S2DataConfig) {
    this.dataCfg = setupDataConfig(dataCfg);
  }

  protected setupOptions(options: S2Options | null | undefined) {
    this.options = setupOptions(options);
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

  protected initTheme() {
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
    if (this.options.hd) {
      this.hdAdapter = new HdAdapter(this);
      this.hdAdapter.init();
    }
  }

  protected initInteraction() {
    this.interaction?.destroy?.();
    this.interaction = new RootInteraction(this);
  }

  private initTooltip() {
    this.tooltip?.destroy?.();
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

  private getTargetCell(target: CellEventTarget): S2CellType {
    // 刷选等场景, 以最后一个发生交互的单元格为准
    return this.getCell(target) || last(this.interaction.getInteractedCells())!;
  }

  /**
   * 展示 Tooltip 提示
   * @alias s2.tooltip.show()
   * @example
      s2.showTooltip({
        position: {
          x: event.clientX,
          y: event.clientY,
        },
        content: '<div>xxx</div>',
        options: {}
      })
   */
  public showTooltip<
    T = TooltipContentType,
    Menu = BaseTooltipOperatorMenuOptions,
  >(showOptions: TooltipShowOptions<T, Menu>): Promise<void> {
    const { content, event } = showOptions;
    const cell = this.getTargetCell(event?.target);
    const displayContent = isFunction(content)
      ? content(cell!, showOptions)
      : content;

    return new Promise((resolve) => {
      const options: TooltipShowOptions<T, Menu> = {
        ...showOptions,
        content: displayContent,
        onMounted: resolve,
      };

      this.tooltip?.show?.(options);
    });
  }

  public showTooltipWithInfo(
    event: CanvasEvent | MouseEvent,
    cellInfos: TooltipData[],
    options?: TooltipOptions,
  ): Promise<void> | void {
    const { enable: showTooltip, content } = getTooltipOptions(this, event)!;

    if (!showTooltip) {
      return;
    }

    const targetCell = this.getTargetCell(event?.target);
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

    return this.showTooltip({
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
    this.tooltip?.hide?.();
  }

  public destroyTooltip() {
    this.tooltip?.destroy?.();
  }

  public registerIcons() {
    const customSVGIcons = this.options.customSVGIcons;

    if (isEmpty(customSVGIcons)) {
      return;
    }

    forEach(customSVGIcons, (customSVGIcon) => {
      registerIcon(customSVGIcon.name, customSVGIcon.src);
    });
  }

  /**
   * 更新表格数据
   * @param dataCfg 数据源配置
   * @param reset 是否重置数据源配置, 直接使用传入的 dataCfg，不再与之前的配置进行合并
   * @example s2.setDataCfg(dataCfg)
   * @example s2.setDataCfg(dataCfg, true)
   */
  public setDataCfg<T extends boolean = false>(
    dataCfg: T extends true
      ? S2DataConfig | undefined | null
      : Partial<S2DataConfig>,
    reset?: T,
  ) {
    this.store.set('originalDataCfg', dataCfg);
    if (reset) {
      this.dataCfg = setupDataConfig(dataCfg);
    } else {
      this.dataCfg = setupDataConfig(this.dataCfg, dataCfg);
    }

    // clear value ranger after each updated data cfg
    clearValueRangeState(this);
  }

  /**
   * 更新表格配置
   * @param options 配置
   * @param reset 是否重置配置, 直接使用传入的 options，不再与之前的配置进行合并
   * @example s2.setOptions(dataCfg)
   * @example s2.setOptions(dataCfg, true)
   */
  public setOptions<T extends boolean = false>(
    options: T extends true ? S2Options | undefined | null : Partial<S2Options>,
    reset?: T,
  ) {
    this.hideTooltip();

    if (reset) {
      this.setupOptions(options);
    } else {
      this.options = customMerge(this.options, options);
    }

    if (reset || options?.tooltip?.render) {
      this.initTooltip();
    }

    this.resetHiddenColumnsDetailInfoIfNeeded();
    this.registerIcons();
  }

  /**
   * 重置表格数据
   * @example s2.resetDataCfg()
   */
  public resetDataCfg() {
    this.setDataCfg(null, true);
  }

  /**
   * 重置表格配置
   * @example s2.resetOptions()
   */
  public resetOptions() {
    this.setOptions(null, true);
  }

  private resetHiddenColumnsDetailInfoIfNeeded() {
    if (!isEmpty(this.options.interaction?.hiddenColumnFields)) {
      this.store.set('hiddenColumnsDetail', []);
    }
  }

  private async doRender(options?: S2RenderOptions) {
    // 防止表格卸载后, 再次调用 render 函数的报错
    if (
      !this.getCanvasElement() ||
      !window.document.body.contains(this.getCanvasElement())
    ) {
      return;
    }

    const {
      reloadData = true,
      rebuildDataSet = false,
      rebuildHiddenColumnsDetail = true,
    } = options || {};

    this.emit(S2Event.LAYOUT_BEFORE_RENDER);

    if (rebuildDataSet) {
      this.dataSet = this.getDataSet();
    }

    if (reloadData) {
      this.clearDrillDownData('', true);
      this.dataSet.setDataCfg(this.dataCfg);
    }

    this.buildFacet();

    if (rebuildHiddenColumnsDetail) {
      await this.initHiddenColumnsDetail();
    }

    this.emit(S2Event.LAYOUT_AFTER_RENDER);
  }

  /**
   * 渲染表格
   * @param reloadData
   * @param options
   * @example
      s2.render(true)
      s2.render(false)
      s2.render({
        reloadData: true;
        rebuildDataSet: true;
        rebuildHiddenColumnsDetail: true;
      })
   */
  public async render(options?: S2RenderOptions | boolean): Promise<void> {
    if (this.destroyed) {
      return;
    }

    const renderOptions: S2RenderOptions =
      typeof options === 'boolean'
        ? {
            reloadData: options,
          }
        : options!;

    await this.container.ready;
    await this.doRender(renderOptions);
  }

  private mountSheetInstance() {
    const canvas = this.getCanvasElement();

    if (canvas) {
      // eslint-disable-next-line no-underscore-dangle
      canvas.__s2_instance__ = this;
    }
  }

  private unmountSheetInstance() {
    const canvas = this.getCanvasElement();

    if (canvas) {
      // @ts-ignore
      // eslint-disable-next-line no-underscore-dangle
      delete canvas.__s2_instance__;
    }
  }

  /**
   * 卸载表格
   * @example s2.destroy()
   */
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
    this.unmountSheetInstance();
    this.container?.destroy();
    removeOffscreenCanvas();
  }

  protected setThemeName(name: ThemeName) {
    this.themeName = name;
  }

  public setThemeCfg(
    themeCfg: ThemeCfg = {},
    getCustomTheme?: (
      palette: SimplePalette,
      spreadsheet?: SpreadSheet,
    ) => S2Theme,
  ) {
    const theme = themeCfg?.theme || {};
    const newTheme = getTheme({
      ...themeCfg,
      spreadsheet: this,
      getCustomTheme,
    });

    this.theme = customMerge(newTheme, theme);
    this.setThemeName(themeCfg?.name!);
  }

  public setTheme(theme: S2Theme) {
    this.theme = customMerge(this.theme, theme);
  }

  public getTheme(): InternalFullyTheme {
    return this.theme;
  }

  public getThemeName() {
    return this.themeName;
  }

  /**
   * 更新分页配置
   */
  public updatePagination(pagination: Pagination) {
    this.options = customMerge(this.options, {
      pagination,
    });

    // 清空滚动进度
    this.facet.resetScrollOffset();
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

  public override on<K extends keyof EmitterType>(
    event: `${K}`,
    listener: EmitterType[K],
  ): this {
    return super.on(event, listener);
  }

  public override emit<K extends keyof EmitterType>(
    event: `${K}`,
    ...args: Parameters<EmitterType[K]>
  ): void {
    super.emit(event, ...args);
  }

  /**
   * 获取 G Canvas 实例
   * @see https://g.antv.antgroup.com/api/renderer/canvas
   */
  public getCanvas(): Canvas {
    return this.container;
  }

  /**
   * 获取 G Canvas 配置
   * @see https://g.antv.antgroup.com/api/canvas/options
   */
  public getCanvasConfig(): Partial<
    CanvasConfig & { supportsCSSTransform?: boolean }
  > {
    return this.getCanvas().getConfig();
  }

  /**
   * 获取 <canvas/> HTML 元素
   */
  public getCanvasElement(): HTMLCanvasElement & {
    // eslint-disable-next-line camelcase
    __s2_instance__: SpreadSheet;
  } {
    return this.getCanvas()
      .getContextService()
      .getDomElement() as HTMLCanvasElement & {
      // eslint-disable-next-line camelcase
      __s2_instance__: SpreadSheet;
    };
  }

  public getLayoutWidthType() {
    return this.options.style?.layoutWidthType!;
  }

  protected isCellType(cell?: CellEventTarget) {
    return cell instanceof BaseCell;
  }

  // 获取当前 cell 实例
  public getCell<T extends S2CellType = S2CellType>(
    target: CellEventTarget,
  ): T | null {
    let parent = target;

    // 一直索引到 g 顶层的 Canvas 来检查是否在指定的 cell 中
    while (parent && !(parent instanceof Canvas)) {
      if (this.isCellType(parent)) {
        // 在单元格中则返回
        return parent as T;
      }

      parent = (parent as DisplayObject)?.parentNode;
    }

    return null;
  }

  // 获取当前 cell 类型
  public getCellType(target: CellEventTarget) {
    const cell = this.getCell(target);

    return cell?.cellType;
  }

  /**
   * 获取当前维度对应的汇总配置
   */
  public getTotalsConfig(dimension: string): Total {
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
      grandTotalsLabel: i18n('总计'),
      subTotalsLabel: i18n('小计'),
      grandTotalsGroupDimensions: [],
      subTotalsGroupDimensions: [],
      ...totalConfig,
      showSubTotals,
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
    const { width, height, device, transformCanvasConfig } = this.options;

    const renderer = new Renderer();
    const canvasConfig = transformCanvasConfig?.(renderer, this);
    /**
     * https://github.com/antvis/S2/issues/2857
     * 开启 supportsPointerEvents 后, G Canvas 会禁用 `touchAction`: https://github.com/antvis/G/blob/910c58e9bcba48cfa7bb0585064d27d3ae0bff4c/packages/g-plugin-dom-interaction/src/DOMInteractionPlugin.ts#L135
     */
    const supportsPointerEvents = !isMobile(device);

    this.container = new Canvas({
      container: this.getMountContainer(dom) as HTMLElement,
      width,
      height,
      renderer,
      supportsPointerEvents,
      ...canvasConfig,
    });

    this.setupContainerStyle();
  }

  protected setupContainerStyle() {
    const canvas = this.getCanvasElement();

    if (canvas) {
      // canvas 需要设置为块级元素, 不然和父元素有 5px 的高度差
      canvas.style.display = 'block';
      // 避免双击 canvas 造成的外部文本选中
      canvas.style.userSelect = 'none';
    }
  }

  // 初次渲染时, 如果配置了隐藏列, 则生成一次相关配置信息
  private async initHiddenColumnsDetail() {
    const { hiddenColumnFields } = this.options.interaction!;
    const lastHiddenColumnsDetail = this.store.get('hiddenColumnsDetail');

    // 隐藏列为空, 并且没有操作的情况下, 则无需生成
    if (isEmpty(hiddenColumnFields) && isEmpty(lastHiddenColumnsDetail)) {
      return;
    }

    await hideColumnsByThunkGroup(this, hiddenColumnFields, true);
  }

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
    (text: SimpleData, font: unknown): TextMetrics | null => {
      if (!font) {
        return null;
      }

      const canvas = getOffscreenCanvas() || this.getCanvasElement();
      const ctx = canvas?.getContext('2d')!;
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
    (text: SimpleData, font) => [text, ...values(font)].join(''),
  );

  /**
   * 计算文本在画布中的宽度
   * @param text 待计算的文本
   * @param font 文本 css 样式
   * @returns 文本宽度
   */
  public measureTextWidth = (text: SimpleData, font: unknown): number => {
    const textMetrics = this.measureText(text, font);

    return textMetrics?.width || 0;
  };

  /**
   * 计算文本在画布中的宽度 https://developer.mozilla.org/zh-CN/docs/Web/API/TextMetrics
   * @param text 待计算的文本
   * @param font 文本 css 样式
   * @returns 文本高度
   */
  public measureTextHeight = (text: SimpleData, font: unknown): number => {
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
  public measureTextWidthRoughly = (
    text: SimpleData,
    font: unknown,
  ): number => {
    const alphaWidth = this.measureTextWidth('a', font);
    const chineseWidth = this.measureTextWidth('蚂', font);

    let w = 0;

    if (!text) {
      return w;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const char of String(text)) {
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

  public handleGroupSort(event: CanvasEvent, meta: Node) {
    event.stopPropagation();
    this.interaction.addIntercepts([InterceptType.HOVER]);

    const selectedKeys = this.getMenuDefaultSelectedKeys(meta?.id);
    const menuItems: TooltipOperatorMenuItems = this.isTableMode()
      ? getTooltipOperatorTableSortMenus()
      : getTooltipOperatorSortMenus();

    const operator: TooltipOperatorOptions = {
      menu: {
        selectedKeys,
        items: menuItems,
        onClick: async ({ key: sortMethod }) => {
          await this.groupSortByMethod(sortMethod as SortMethod, meta);
          this.emit(S2Event.RANGE_SORTED, event);
        },
      },
    };

    this.showTooltipWithInfo(event, [], {
      operator,
      onlyShowOperator: true,
    });
  }

  public getSeriesNumberText() {
    const { text, enable } = this.options.seriesNumber ?? {};

    if (!enable) {
      return '';
    }

    return text ?? getDefaultSeriesNumberText();
  }

  public enableAsyncExport(): Error | true {
    return true;
  }
}
