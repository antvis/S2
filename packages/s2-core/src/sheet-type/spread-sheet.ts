import EE from '@antv/event-emitter';
import { Canvas, Event as CanvasEvent } from '@antv/g-canvas';
import {
  forEach,
  forIn,
  get,
  includes,
  isEmpty,
  isFunction,
  isString,
  memoize,
  values,
} from 'lodash';
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
  SpreadSheetFacetCfg,
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
import { clearValueRangeState } from '../utils/condition/state-controller';
import { hideColumnsByThunkGroup } from '../utils/hide-columns';
import {
  customMerge,
  getSafetyDataConfig,
  getSafetyOptions,
} from '../utils/merge';
import { getTooltipData, getTooltipOptions } from '../utils/tooltip';
import { removeOffscreenCanvas } from '../utils/canvas';

export abstract class SpreadSheet extends EE {
  // theme config
  public theme: S2Theme;

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
    return this.options.tooltip?.renderTooltip?.(this) || new BaseTooltip(this);
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

  public abstract isCustomHeaderFields(
    fieldType?: keyof Pick<Fields, 'columns' | 'rows'>,
  ): boolean;

  public abstract isCustomRowFields(): boolean;

  public abstract isCustomColumnFields(): boolean;

  /**
   * tree type must be in strategy mode
   */
  public abstract isHierarchyTreeType(): boolean;

  /**
   * Check whether scroll contains row header
   * For now contains row header in ListSheet mode by default
   */
  public abstract isScrollContainsRowHeader(): boolean;

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

  /**
   * 避免每次新增、变更dataSet和options时，生成SpreadSheetFacetCfg
   * 要多出定义匹配的问题，直接按需&部分拆分options/dataSet合并为facetCfg
   */
  protected abstract getFacetCfgFromDataSetAndOptions(): SpreadSheetFacetCfg;

  protected abstract buildFacet(): void;

  public abstract clearDrillDownData(
    rowNodeId?: string,
    preventRender?: boolean,
  ): void;

  public abstract handleGroupSort(event: CanvasEvent, meta: Node): void;

  public showTooltip<T = TooltipContentType>(
    showOptions: TooltipShowOptions<T>,
  ) {
    const { content, event } = showOptions;
    const cell = this.getCell(event?.target);
    const displayContent = isFunction(content)
      ? content(cell!, showOptions)
      : content;

    this.tooltip.show?.({
      ...showOptions,
      content: displayContent,
    });
  }

  public showTooltipWithInfo(
    event: CanvasEvent | MouseEvent,
    data: TooltipData[],
    options?: TooltipOptions,
  ) {
    const { showTooltip, content } = getTooltipOptions(this, event)!;
    if (!showTooltip) {
      return;
    }

    const targetCell = this.getCell(event?.target);
    const tooltipData = getTooltipData({
      spreadsheet: this,
      cellInfos: data,
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
      options: {
        enterable: true,
        ...options,
      },
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

  public render(reloadData = true, options: S2RenderOptions = {}) {
    // 防止表格卸载后, 再次调用 render 函数的报错
    if (!this.getCanvasElement()) {
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

  public destroy() {
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
    this.store.set('scrollX', 0);
    this.store.set('scrollY', 0);
  }

  /**
   * 获取当前表格实际内容高度
   */
  public getContentHeight(): number {
    return this.facet.getContentHeight();
  }

  /**
   * @param width
   * @param height
   * @deprecated 该方法将会在2.0被移除, 请使用 changeSheetSize 代替
   */
  public changeSize(
    width: number = this.options.width!,
    height: number = this.options.height!,
  ) {
    this.changeSheetSize(width, height);
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
    const containerWidth = this.container.get('width');
    const containerHeight = this.container.get('height');

    const isSizeChanged =
      width !== containerWidth || height !== containerHeight;

    if (!isSizeChanged || !canvas) {
      return;
    }

    this.options = customMerge(this.options, { width, height });
    // resize the canvas
    this.container.changeSize(width, height);
  }

  /**
   * 获取 <canvas/> HTML元素
   */
  public getCanvasElement(): HTMLCanvasElement {
    return this.container.get('el') as HTMLCanvasElement;
  }

  public getLayoutWidthType(): LayoutWidthType {
    return this.options.style!.layoutWidthType!;
  }

  public getRowNodes(level = -1): Node[] {
    if (level === -1) {
      return this.facet.layoutResult.rowNodes;
    }
    return this.facet.layoutResult.rowNodes.filter(
      (node) => node.level === level,
    );
  }

  public getRowLeafNodes(): Node[] {
    return this.facet?.layoutResult.rowLeafNodes || [];
  }

  /**
   * get columnNode in levels,
   * @param level -1 = get all
   */
  public getColumnNodes(level = -1): Node[] {
    const colNodes = this.facet?.layoutResult.colNodes || [];
    if (level === -1) {
      return colNodes;
    }
    return colNodes.filter((node) => node.level === level);
  }

  public getColumnLeafNodes(): Node[] {
    return this.facet?.layoutResult.colLeafNodes || [];
  }

  /**
   * Update scroll's offset, the value can be undefined,
   * indicate not update current value
   * @param offsetConfig
   * default offsetX(horizontal scroll need animation)
   * but offsetY(vertical scroll don't need animation)
   */
  public updateScrollOffset(offsetConfig: OffsetConfig) {
    this.facet.updateScrollOffset(
      customMerge(
        {
          offsetX: {
            value: undefined,
            animate: false,
          },
          offsetY: {
            value: undefined,
            animate: false,
          },
        },
        offsetConfig,
      ) as OffsetConfig,
    );
  }

  public getTooltipDataItemMappingCallback() {
    return this.options?.mappingDisplayDataItem;
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
      parent = parent.get?.('parent');
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
    const { width, height, supportCSSTransform, devicePixelRatio } =
      this.options;
    // base canvas group
    this.container = new Canvas({
      container: this.getMountContainer(dom) as HTMLElement,
      width: width!,
      height: height!,
      localRefresh: false,
      supportCSSTransform,
      pixelRatio: Math.max(devicePixelRatio!, MIN_DEVICE_PIXEL_RATIO),
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

  public getInitColumnLeafNodes(): Node[] {
    return this.store.get('initColumnLeafNodes', [])!;
  }

  public clearColumnLeafNodes() {
    this.store.set('initColumnLeafNodes', undefined);
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
   * 计算文本在画布中的宽度
   * @param text 待计算的文本
   * @param font 文本 css 样式
   * @returns 文本宽度
   */
  public measureTextWidth = memoize(
    (text: number | string = '', font: unknown): number => {
      if (!font) {
        return 0;
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

      return ctx.measureText(String(text)).width;
    },
    (text: any, font) => [text, ...values(font)].join(''),
  );

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
