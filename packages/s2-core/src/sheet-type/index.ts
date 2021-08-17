import { BaseCell, DataCell, DetailDataCell } from '@/cell';
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
  S2Options,
  safetyDataConfig,
  safetyOptions,
  SpreadSheetFacetCfg,
  SpreadsheetMountContainer,
  ThemeCfg,
  TooltipShowOptions,
  Total,
  Totals,
  ViewMeta,
} from '@/common/interface';
import { BaseDataSet, PivotDataSet, TableDataSet } from '@/data-set';
import { CustomTreePivotDataSet } from '@/data-set/custom-tree-pivot-data-set';
import { BaseFacet, PivotFacet, TableFacet } from '@/facet';
import { Node, SpreadSheetTheme } from '@/index';
import { getTheme } from '@/theme';
import { BaseTooltip } from '@/tooltip';
import { updateConditionsByValues } from '@/utils/condition';
import { isMobile } from '@/utils/is-mobile';
import EE from '@antv/event-emitter';
import { Canvas, CanvasCfg, Event, IGroup } from '@antv/g-canvas';
import { ext } from '@antv/matrix-util';
import {
  clone,
  debounce,
  get,
  includes,
  isEmpty,
  isFunction,
  isString,
  merge,
  set,
} from 'lodash';
import { Store } from '../common/store';
import { RootInteraction } from '../interaction/root';

const matrixTransform = ext.transform;

export class SpreadSheet extends EE {
  public static DEBUG_ON = false;

  // dom id
  public dom: SpreadsheetMountContainer;

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

  public devicePixelRatioMedia: MediaQueryList;

  public viewport = window as typeof window & { visualViewport: Element };

  public interaction: RootInteraction;

  public constructor(
    dom: SpreadsheetMountContainer,
    dataCfg: S2DataConfig,
    options: S2Options,
  ) {
    super();
    this.dom = isString(dom)
      ? document.getElementById(dom)
      : (dom as HTMLElement);
    this.dataCfg = safetyDataConfig(dataCfg);
    this.options = safetyOptions(options);
    this.dataSet = this.getDataSet(this.options);
    this.tooltip = this.getTooltip(options?.initTooltip);

    DebuggerUtil.getInstance().setDebug(options?.debug);
    this.initGroups(this.dom, this.options);
    this.bindEvents();
    this.initInteraction();
  }

  initInteraction() {
    this.interaction = new RootInteraction(this);
  }

  getTooltip = (initTooltip: S2Options['initTooltip']): BaseTooltip => {
    return initTooltip?.(this) || new BaseTooltip(this);
  };

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
  public setDataCfg(dataCfg: S2DataConfig): void {
    const newDataCfg = clone(dataCfg);
    const lastSortParam = this.store.get('sortParam');
    const { sortParams } = newDataCfg;
    newDataCfg.sortParams = [].concat(lastSortParam || [], sortParams || []);
    this.dataCfg = newDataCfg;
  }

  public setOptions(options: S2Options): void {
    if (this.tooltip) {
      this.tooltip.hide();
    }
    this.options = merge(this.options, options);
  }

  public render(reloadData = true, callback?: () => void): void {
    if (reloadData) {
      this.dataSet.setDataCfg(this.dataCfg);
    }
    this.buildFacet();
    if (isFunction(callback)) {
      callback();
    }
  }

  public destroy(): void {
    this.facet.destroy();
    this.tooltip.destroy();
    this.removeDevicePixelRatioListener();
    this.removeDeviceZoomListener();
  }

  /**
   * Update theme config, if the {@param type} is exists, re-use it,
   * otherwise create new one {@see theme}
   * @param type string
   * @param theme
   */
  public setThemeCfg(themeCfg: ThemeCfg): void {
    const theme = themeCfg?.theme || {};
    this.theme = merge({}, getTheme(themeCfg), theme);
    this.updateDefaultConditions();
  }

  private updateDefaultConditions() {
    if (isEmpty(this.options.useDefaultConditionValues)) {
      return;
    }
    const { conditions, useDefaultConditionValues } = this.options;
    const updatedConditions = updateConditionsByValues(
      conditions,
      useDefaultConditionValues,
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

  public showTooltip(showOptions: TooltipShowOptions) {
    if (get(this, 'options.tooltip.showTooltip')) {
      this.tooltip.show(showOptions);
    }
  }

  public hideTooltip() {
    this.tooltip.hide();
  }

  public getTooltipDataItemMappingCallback() {
    return get(this, 'options.mappingDisplayDataItem');
  }

  // 获取当前cell实例
  public getCell<T extends S2CellType = S2CellType>(
    target: Event['target'],
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
  public getCellType(target: Event['target']) {
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
    const canvasCfg: CanvasCfg = {
      container: dom,
      width,
      height,
      localRefresh: false,
    };

    // base canvas group
    this.container = new Canvas(canvasCfg);

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
      if (
        this.isTableMode() &&
        this.options.showSeriesNumber &&
        facet.colIndex === 0
      ) {
        return new DetailDataCell(facet, this);
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
    // render facet
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
    this.on(KEY_TREE_ROWS_COLLAPSE_ALL, (isCollapse) => {
      const options = {
        ...this.options,
        hierarchyCollapse: !isCollapse,
      };
      // 清空用户操作的缓存
      set(options, 'style.collapsedRows', {});
      this.setOptions(options);
      this.render(false);
    });

    this.initDevicePixelRatioListener();
    this.initDeviceZoomListener();
  }

  private initDevicePixelRatioListener() {
    this.devicePixelRatioMedia = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`,
    );
    if (this.devicePixelRatioMedia?.addEventListener) {
      this.devicePixelRatioMedia.addEventListener(
        'change',
        this.renderByDevicePixelRatioChanged,
      );
    } else {
      this.devicePixelRatioMedia.addListener(
        this.renderByDevicePixelRatioChanged,
      );
    }
  }

  private removeDevicePixelRatioListener() {
    if (this.devicePixelRatioMedia?.removeEventListener) {
      this.devicePixelRatioMedia.removeEventListener(
        'change',
        this.renderByDevicePixelRatioChanged,
      );
    } else {
      this.devicePixelRatioMedia.removeListener(
        this.renderByDevicePixelRatioChanged,
      );
    }
  }

  private initDeviceZoomListener() {
    // VisualViewport support browser zoom & mac touch tablet
    this.viewport?.visualViewport?.addEventListener(
      'resize',
      this.renderByZoomScale,
    );
  }

  private removeDeviceZoomListener() {
    this.viewport?.visualViewport?.removeEventListener(
      'resize',
      this.renderByZoomScale,
    );
  }

  private renderByDevicePixelRatioChanged = () => {
    this.renderByDevicePixelRatio();
  };

  // 由于行头和列头的选择的模式并不是把一整行或者一整列的cell都setState
  private renderByDevicePixelRatio = (ratio = window.devicePixelRatio) => {
    const { width, height } = this.options;
    const newWidth = Math.floor(width * ratio);
    const newHeight = Math.floor(height * ratio);

    this.container.resetMatrix();
    this.container.set('pixelRatio', ratio);
    this.container.changeSize(newWidth, newHeight);

    matrixTransform(this.container.getMatrix(), [['scale', ratio, ratio]]);

    this.render(false);
  };

  private renderByZoomScale = debounce((e) => {
    if (isMobile()) {
      return;
    }
    const ratio = Math.max(e.target.scale, window.devicePixelRatio);
    if (ratio > 1) {
      this.renderByDevicePixelRatio(ratio);
    }
  }, 350);
}
