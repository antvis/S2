import EE from '@antv/event-emitter';
import { Canvas, Event as CanvasEvent, IGroup } from '@antv/g-canvas';
import {
  clone,
  forEach,
  get,
  includes,
  isEmpty,
  isString,
  merge,
  once,
} from 'lodash';
import { hideColumnsByThunkGroup } from '@/utils/hide-columns';
import { BaseCell } from '@/cell';
import {
  BACK_GROUND_GROUP_CONTAINER_Z_INDEX,
  FRONT_GROUND_GROUP_CONTAINER_Z_INDEX,
  KEY_GROUP_BACK_GROUND,
  KEY_GROUP_FORE_GROUND,
  KEY_GROUP_PANEL_GROUND,
  KEY_GROUP_PANEL_SCROLL,
  PANEL_GROUP_GROUP_CONTAINER_Z_INDEX,
  PANEL_GROUP_SCROLL_GROUP_Z_INDEX,
  S2Event,
} from '@/common/constant';
import { DebuggerUtil } from '@/common/debug';
import { i18n } from '@/common/i18n';
import {
  OffsetConfig,
  Pagination,
  S2CellType,
  S2DataConfig,
  S2MountContainer,
  S2Options,
  safetyDataConfig,
  safetyOptions,
  SpreadSheetFacetCfg,
  ThemeCfg,
  TooltipData,
  TooltipOptions,
  TooltipShowOptions,
  Total,
  Totals,
} from '@/common/interface';
import { EmitterType } from '@/common/interface/emitter';
import { Store } from '@/common/store';
import { BaseDataSet } from '@/data-set';
import { BaseFacet } from '@/facet';
import { CustomSVGIcon, Node, S2Theme } from '@/index';
import { RootInteraction } from '@/interaction/root';
import { getTheme } from '@/theme';
import { HdAdapter } from '@/ui/hd-adapter';
import { BaseTooltip } from '@/ui/tooltip';
import { clearValueRangeState } from '@/utils/condition/state-controller';
import { customMerge } from '@/utils/merge';
import { getTooltipData, getTooltipOptions } from '@/utils/tooltip';
import { registerIcon, getIcon } from '@/common/icons/factory';

export abstract class SpreadSheet extends EE {
  // dom id
  public dom: S2MountContainer;

  // theme config
  public theme: S2Theme;

  // store some temporary data
  public store = new Store();

  // the original data config
  public dataCfg: S2DataConfig;

  // Spreadsheet's configurations
  public options: S2Options;

  /**
   * processed data structure, include {@link Fields}, {@link Meta}
   * {@link Data}, {@link SortParams}
   */
  public dataSet: BaseDataSet;

  /**
   * Facet: determine how to render headers/cell
   */
  public facet: BaseFacet;

  public tooltip: BaseTooltip;

  // the base container, contains all groups
  public container: Canvas;

  // the background group, render bgColor...
  public backgroundGroup: IGroup;

  // facet cell area group, it contains all cross-tab's cell
  public panelGroup: IGroup;

  public panelScrollGroup: IGroup;

  public frozenRowGroup: IGroup;

  public frozenColGroup: IGroup;

  public frozenTrailingRowGroup: IGroup;

  public frozenTrailingColGroup: IGroup;

  public frozenTopGroup: IGroup;

  public frozenBottomGroup: IGroup;

  // contains rowHeader,cornerHeader,colHeader, scroll bars
  public foregroundGroup: IGroup;

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
    options: S2Options,
  ) {
    super();
    this.dom = this.getMountContainer(dom);
    this.dataCfg = safetyDataConfig(dataCfg);
    this.options = safetyOptions(options);
    this.dataSet = this.getDataSet(this.options);

    this.initTooltip();
    this.initGroups();
    this.bindEvents();
    this.initInteraction();
    this.initTheme();
    this.initHdAdapter();
    this.registerIcons();
    this.setDebug();
  }

  private setDebug() {
    DebuggerUtil.getInstance().setDebug(this.options.debug);
  }

  private initTheme() {
    // When calling spreadsheet directly, there is no theme and initialization is required
    this.setThemeCfg({
      name: 'default',
    });
  }

  private getMountContainer(dom: S2MountContainer) {
    const mountContainer = isString(dom)
      ? document.getElementById(dom)
      : (dom as HTMLElement);

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

  protected abstract bindEvents();

  public abstract getDataSet(options: S2Options): BaseDataSet;

  /**
   * Check if is pivot mode
   */
  public abstract isPivotMode(): boolean;

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
  public abstract isFreezeRowHeader(): boolean;

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

  public abstract clearDrillDownData(rowNodeId?: string): void;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handleGroupSort(event: CanvasEvent, meta: Node) {}

  public showTooltip(showOptions: TooltipShowOptions) {
    this.tooltip.show?.(showOptions);
  }

  public showTooltipWithInfo(
    event: CanvasEvent | MouseEvent,
    data: TooltipData[],
    options?: TooltipOptions,
  ) {
    const { showTooltip, tooltipComponent } = getTooltipOptions(this, event);
    if (!showTooltip) {
      return;
    }

    const tooltipData = getTooltipData({
      spreadsheet: this,
      cellInfos: data,
      options,
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
      element: tooltipComponent,
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
    if (isEmpty(customSVGIcons)) return;

    forEach(customSVGIcons, (customSVGIcon: CustomSVGIcon) => {
      if (isEmpty(getIcon(customSVGIcon.name))) {
        registerIcon(customSVGIcon.name, customSVGIcon.svg);
      }
    });
  }

  /**
   * Update data config and keep pre-sort operations
   * Group sort params kept in {@see store} and
   * Priority: group sort > advanced sort
   * @param dataCfg
   */
  public setDataCfg(dataCfg: S2DataConfig) {
    const newDataCfg = clone(dataCfg);
    const lastSortParam = this.store.get('sortParam');
    const { sortParams } = newDataCfg;
    newDataCfg.sortParams = [].concat(lastSortParam || [], sortParams || []);
    this.dataCfg = safetyDataConfig(newDataCfg);
    // clear value ranger after each updated data cfg
    clearValueRangeState(this);
  }

  public setOptions(options: Partial<S2Options>) {
    this.hideTooltip();
    this.options = customMerge(this.options, options);
    this.registerIcons();
  }

  public render(reloadData = true) {
    this.emit(S2Event.LAYOUT_BEFORE_RENDER);
    if (reloadData) {
      this.dataSet.setDataCfg(this.dataCfg);
    }
    this.buildFacet();
    this.emit(S2Event.LAYOUT_AFTER_RENDER);
    this.initHiddenColumnsDetail();
  }

  public destroy() {
    this.facet.destroy();
    this.hdAdapter?.destroy();
    this.interaction.destroy();
    this.store.clear();
    this.destroyTooltip();
  }

  /**
   * Update theme config, if the {@param type} is exists, re-use it,
   * otherwise create new one {@see theme}
   * @param type string
   * @param theme
   */
  public setThemeCfg(themeCfg: ThemeCfg) {
    const theme = themeCfg?.theme || {};
    this.theme = merge({}, getTheme({ ...themeCfg, spreadsheet: this }), theme);
  }

  /**
   * Update pagination config which store in {@see options}
   * @param pagination
   */
  public updatePagination(pagination: Pagination) {
    this.options = merge({}, this.options, {
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
   * 修改表格画布大小，不用重新加载数据
   * @param width
   * @param height
   */
  public changeSize(width: number, height: number) {
    this.options = merge({}, this.options, { width, height });
    // resize the canvas
    this.container.changeSize(width, height);
  }

  public isColAdaptive(): boolean {
    return this.options.style.colCfg?.colWidthType === 'adaptive';
  }

  public getRowNodes(level = -1): Node[] {
    if (level === -1) {
      return this.facet.layoutResult.rowNodes;
    }
    return this.facet.layoutResult.rowNodes.filter(
      (value) => value.level === level,
    );
  }

  /**
   * get columnNode in levels,
   * @param level -1 = get all
   */
  public getColumnNodes(level = -1): Node[] {
    if (level === -1) {
      return this.facet?.layoutResult.colNodes;
    }
    return this.facet?.layoutResult.colNodes.filter(
      (value) => value.level === level,
    );
  }

  /**
   * Update scroll's offset, the value can be undefined,
   * indicate not update current value
   * @param offsetConfig
   * default offsetX(horizontal scroll need animation)
   * but offsetY(vertical scroll don't need animation)
   */
  public updateScrollOffset(offsetConfig: OffsetConfig): void {
    this.facet.updateScrollOffset(
      merge(
        {},
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
    target: CanvasEvent['target'],
  ): T {
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
  public getCellType(target: CanvasEvent['target']) {
    const cell = this.getCell(target);
    return cell?.cellType;
  }

  /**
   * get total's config by dimension id
   * @param dimension unique dimension id
   */
  public getTotalsConfig(dimension: string): Partial<Totals['row']> {
    const { totals } = this.options;
    const { rows } = this.dataCfg.fields;
    const totalConfig = get(
      totals,
      includes(rows, dimension) ? 'row' : 'col',
      {},
    ) as Total;
    const showSubTotals = totalConfig.showSubTotals
      ? includes(totalConfig.subTotalsDimensions, dimension)
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
   * @param options
   * @private
   */
  protected initGroups() {
    const { width, height } = this.options;
    // base canvas group
    this.container = new Canvas({
      container: this.dom,
      width,
      height,
      localRefresh: false,
    });

    // the main three layer groups
    this.backgroundGroup = this.container.addGroup({
      name: KEY_GROUP_BACK_GROUND,
      zIndex: BACK_GROUND_GROUP_CONTAINER_Z_INDEX,
    });
    this.panelGroup = this.container.addGroup({
      name: KEY_GROUP_PANEL_GROUND,
      zIndex: PANEL_GROUP_GROUP_CONTAINER_Z_INDEX,
    });
    this.foregroundGroup = this.container.addGroup({
      name: KEY_GROUP_FORE_GROUND,
      zIndex: FRONT_GROUND_GROUP_CONTAINER_Z_INDEX,
    });
    this.initPanelGroupChildren();
  }

  protected initPanelGroupChildren() {
    this.panelScrollGroup = this.panelGroup.addGroup({
      name: KEY_GROUP_PANEL_SCROLL,
      zIndex: PANEL_GROUP_SCROLL_GROUP_Z_INDEX,
    });
  }

  public getInitColumnNodes(): Node[] {
    return this.store.get('initColumnNodes', []);
  }

  public hideColumns(hiddenColumnFields: string[] = []) {
    hideColumnsByThunkGroup(this, hiddenColumnFields);
  }

  // 初次渲染时, 如果配置了隐藏列, 则生成一次相关配置信息
  private initHiddenColumnsDetail = once(() => {
    const { hiddenColumnFields } = this.options;
    if (isEmpty(hiddenColumnFields)) {
      return;
    }
    hideColumnsByThunkGroup(this, hiddenColumnFields, true);
  });
}
