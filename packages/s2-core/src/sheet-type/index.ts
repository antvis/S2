import { BaseCell, DataCell, TableDataCell, TableRowCell } from '@/cell';
import {
  KEY_AFTER_COLLAPSE_ROWS,
  KEY_COLLAPSE_ROWS,
  KEY_COLLAPSE_TREE_ROWS,
  KEY_GROUP_BACK_GROUND,
  KEY_GROUP_FORE_GROUND,
  KEY_GROUP_PANEL_GROUND,
  KEY_TREE_ROWS_COLLAPSE_ALL,
  KEY_UPDATE_PROPS,
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
  ViewMeta,
} from '@/common/interface';
import { EmitterType } from '@/common/interface/emitter';
import { Store } from '@/common/store';
import { BaseDataSet, PivotDataSet, TableDataSet } from '@/data-set';
import { CustomTreePivotDataSet } from '@/data-set/custom-tree-pivot-data-set';
import { BaseFacet, PivotFacet, TableFacet } from '@/facet';
import { HdAdapter } from '@/hd-adapter';
import { Node, SpreadSheetTheme } from '@/index';
import { RootInteraction } from '@/interaction/root';
import { getTheme } from '@/theme';
import { BaseTooltip } from '@/tooltip';
import { updateConditionsByValues } from '@/utils/condition/generate-condition';
import * as conditionStateController from '@/utils/condition/state-controller';
import { getTooltipData } from '@/utils/tooltip';
import EE from '@antv/event-emitter';
import { Canvas, Event as CanvasEvent, IGroup } from '@antv/g-canvas';
import {
  clone,
  get,
  includes,
  isEmpty,
  isFunction,
  isString,
  merge,
  set,
} from 'lodash';

export class SpreadSheet extends EE {
  // dom id
  public dom: S2MountContainer;

  // theme config
  public theme: SpreadSheetTheme;

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

  public maskContainer: Canvas;

  // the background group, render bgColor...
  public backgroundGroup: IGroup;

  // facet cell area group, it contains all cross-tab's cell
  public panelGroup: IGroup;

  public maskGroup: IGroup;

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
    this.initGroups(this.dom, this.options);
    this.bindEvents();
    this.initInteraction();
    this.initHdAdapter();

    DebuggerUtil.getInstance().setDebug(options?.debug);
  }

  get isShowTooltip() {
    return this.options?.tooltip?.showTooltip;
  }

  private getMountContainer(dom: S2MountContainer) {
    return isString(dom) ? document.getElementById(dom) : (dom as HTMLElement);
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
    return (
      this.options?.tooltip?.renderTooltip?.(this) || new BaseTooltip(this)
    );
  }

  public showTooltip(showOptions: TooltipShowOptions) {
    if (this.isShowTooltip) {
      this.tooltip.show?.(showOptions);
    }
  }

  public showTooltipWithInfo(
    event: CanvasEvent | MouseEvent,
    data: TooltipData[],
    options?: TooltipOptions,
  ) {
    if (!this.isShowTooltip) {
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
    });
  }

  public hideTooltip() {
    if (this.isShowTooltip) {
      this.tooltip.hide?.();
    }
  }

  public destroyTooltip() {
    if (this.isShowTooltip) {
      this.tooltip.destroy?.();
    }
  }

  getDataSet = (options: S2Options): BaseDataSet => {
    const { mode, dataSet, hierarchyType } = options;
    if (dataSet) {
      return dataSet(this);
    }

    let realDataSet;
    if (hierarchyType === 'customTree') {
      realDataSet = new CustomTreePivotDataSet(this);
    } else {
      realDataSet = new PivotDataSet(this);
    }

    return mode === 'table' ? new TableDataSet(this) : realDataSet;
  };

  public clearDrillDownData(rowNodeId?: string) {
    if (this.dataSet instanceof PivotDataSet) {
      this.dataSet.clearDrillDownData(rowNodeId);
      this.render(false);
    }
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
    this.dataCfg = newDataCfg;
    // clear value ranger after each updated data cfg
    conditionStateController.clearState(this);
  }

  public setOptions(options: S2Options) {
    this.hideTooltip();
    this.options = merge(this.options, options);
  }

  public render(reloadData = true, callback?: () => void) {
    if (reloadData) {
      this.dataSet.setDataCfg(this.dataCfg);
    }
    this.buildFacet();
    if (isFunction(callback)) {
      callback();
    }
  }

  public destroy() {
    this.facet.destroy();
    this.hdAdapter?.destroy();
    this.interaction.destroy();
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
    this.updateDefaultConditions();
  }

  private updateDefaultConditions() {
    if (isEmpty(this.options.indicateConditionValues)) {
      return;
    }
    const { conditions, indicateConditionValues } = this.options;
    const updatedConditions = updateConditionsByValues(
      conditions,
      indicateConditionValues,
      this.theme.dataCell.icon,
    );
    this.setOptions({ conditions: updatedConditions } as S2Options);
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
   * 修改交叉表画布大小，不用重新加载数据
   * @param width
   * @param height
   */
  public changeSize(width: number, height: number) {
    this.options = merge({}, this.options, { width, height });
    // resize the canvas
    this.container.changeSize(width, height);
  }

  /**
   * tree type must be in strategy mode
   */
  public isHierarchyTreeType(): boolean {
    const type = this.options.hierarchyType;
    // custom tree and tree!!!
    return type === 'tree' || type === 'customTree';
  }

  public isColAdaptive(): boolean {
    return (
      get(this, 'options.style.colCfg.colWidthType', 'adaptive') === 'adaptive'
    );
  }

  /**
   * Check if is pivot mode
   */
  public isPivotMode(): boolean {
    return this.options?.mode === 'pivot';
  }

  /**
   * Check if is pivot mode
   */
  public isTableMode(): boolean {
    return this.options?.mode === 'table';
  }

  /**
   * Check whether scroll contains row header
   * For now contains row header in ListSheet mode by default
   */
  public isScrollContainsRowHeader(): boolean {
    return !this.freezeRowHeader() || !this.isPivotMode();
  }

  /**
   * Scroll Freeze Row Header
   */
  public freezeRowHeader(): boolean {
    return this.options?.freezeRowHeader;
  }

  public getRowNodes(level = -1): Node[] {
    if (level === -1) {
      return this.facet.layoutResult.rowNodes;
    }
    return this.facet.layoutResult.rowNodes.filter(
      (value) => value.level === level,
    );
  }

  public getRealColumnSize(): number {
    return get(this, 'dataCfg.fields.columns', []).length + 1;
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

  public isValueInCols(): boolean {
    return this.dataSet.fields.valueInCols;
  }

  public getTooltipDataItemMappingCallback() {
    return get(this, 'options.mappingDisplayDataItem');
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
      parent = parent.get('parent');
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
  protected initGroups(dom: HTMLElement, options: S2Options): void {
    const { width, height } = options;

    // base canvas group
    this.container = new Canvas({
      container: dom,
      width,
      height,
      localRefresh: false,
    });

    // the main three layer groups
    this.backgroundGroup = this.container.addGroup({
      name: KEY_GROUP_BACK_GROUND,
      zIndex: 0,
    });
    this.panelGroup = this.container.addGroup({
      name: KEY_GROUP_PANEL_GROUND,
      zIndex: 1,
    });
    this.foregroundGroup = this.container.addGroup({
      name: KEY_GROUP_FORE_GROUND,
      zIndex: 2,
    });
  }

  /**
   * 避免每次新增、变更dataSet和options时，生成SpreadSheetFacetCfg
   * 要多出定义匹配的问题，直接按需&部分拆分options/dataSet合并为facetCfg
   */
  getFacetCfgFromDataSetAndOptions = (): SpreadSheetFacetCfg => {
    const { fields, meta } = this.dataSet;
    const { style, dataCell } = this.options;
    // 默认单元格实现
    const defaultCell = (facet: ViewMeta) => {
      if (this.isTableMode()) {
        if (this.options.showSeriesNumber && facet.colIndex === 0) {
          return new TableRowCell(facet, this);
        }
        return new TableDataCell(facet, this);
      }
      return new DataCell(facet, this);
    };
    return {
      ...fields,
      ...style,
      ...this.options,
      meta,
      spreadsheet: this,
      dataSet: this.dataSet,
      dataCell: dataCell ?? defaultCell,
    } as SpreadSheetFacetCfg;
  };

  buildFacet = () => {
    this.facet?.destroy();
    const facetCfg = this.getFacetCfgFromDataSetAndOptions();
    if (this.isPivotMode()) {
      this.facet = new PivotFacet(facetCfg);
    } else {
      this.facet = new TableFacet(facetCfg);
    }
    this.facet.render();
  };

  protected bindEvents() {
    this.off(KEY_COLLAPSE_TREE_ROWS);
    this.off(KEY_UPDATE_PROPS);
    this.off(KEY_TREE_ROWS_COLLAPSE_ALL);
    // collapse rows in tree mode of SpreadSheet
    this.on(KEY_COLLAPSE_TREE_ROWS, (data) => {
      const { id, isCollapsed } = data;
      const style = this.options.style;
      const options = merge({}, this.options, {
        style: {
          ...style,
          collapsedRows: {
            [id]: isCollapsed,
          },
        },
      });
      // post to x-report to store state
      this.emit(KEY_COLLAPSE_ROWS, {
        collapsedRows: options.style.collapsedRows,
      });
      this.setOptions(options);

      this.render(false, () => {
        this.emit(KEY_AFTER_COLLAPSE_ROWS, {
          collapsedRows: options.style.collapsedRows,
        });
      });
    });
    // 收起、展开按钮
    this.on(KEY_TREE_ROWS_COLLAPSE_ALL, (isCollapse: boolean) => {
      const options = {
        ...this.options,
        hierarchyCollapse: !isCollapse,
      };
      // 清空用户操作的缓存
      set(options, 'style.collapsedRows', {});
      this.setOptions(options);
      this.render(false);
    });
  }
}
