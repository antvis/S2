import EE from '@antv/event-emitter';
import { Canvas, IGroup } from '@antv/g-canvas';
import * as _ from 'lodash';
import { Store } from '../common/store';
import { ext } from '@antv/matrix-util';
import {
  ColWidthCache,
  DataCfg,
  DerivedValue,
  OffsetConfig,
  Pagination,
  SpreadsheetFacetCfg,
  SpreadsheetOptions,
  ViewMeta,
} from '../common/interface';
import { DataCell, DataPlaceHolderCell } from '../cell';
import {
  KEY_COL_REAL_WIDTH_INFO,
  KEY_GROUP_BACK_GROUND,
  KEY_GROUP_FORE_GROUND,
  KEY_GROUP_HOVER_BOX,
  KEY_GROUP_PANEL_GROUND,
  PANEL_GROUP_HOVER_BOX_GROUP_ZINDEX,
} from '../common/constant';
import { BaseDataSet } from '../data-set';
import { SpreadsheetFacet } from '../facet';
import {
  BaseCell,
  Conditions,
  Fields,
  Node,
  Totals,
  BaseInteraction,
  SpreadSheetTheme,
} from '../index';
import { DetailFacet } from '../facet/detail';
import { getTheme, registerTheme } from '../theme';
import { BaseTooltip } from '../tooltip';
import { BaseFacet } from '../facet/base-facet';
import { BaseParams } from '../data-set/base-data-set';
import { StrategyDataCell } from '../cell';
import { LruCache } from '../facet/layout/util/lru-cache';
import { DebuggerUtil } from '../common/debug';
import { DefaultStyleCfg } from '../common/default-style-cfg';
import { EventController } from '../interaction/events/event-controller';
import State from '../state/state';

const matrixTransform = ext.transform;

/**
 * Create By Bruce Too
 * On 2020-06-17
 * 所有表入口的基类
 */
export default abstract class BaseSpreadSheet extends EE {
  public static DEBUG_ON = false;

  // dom id
  public dom: HTMLElement;

  // theme config
  public theme: SpreadSheetTheme = getTheme('default');

  public interactions: Map<string, BaseInteraction> = new Map();

  // store some temporary data
  public store: Store = new Store();

  // the original data config
  public dataCfg: DataCfg;

  // Spreadsheet's configurations
  public options: SpreadsheetOptions;

  /**
   * processed data structure, include {@link Fields}, {@link Meta}
   * {@link Data}, {@link SortParams}, {@link Pivot}
   */
  public dataSet: BaseDataSet<BaseParams>;

  /**
   * Facet: determine how to render headers/cell
   * There are two facet default
   * {@link DetailFacet} and {@link SpreadsheetFacet}
   */
  public facet: BaseFacet;

  // tooltips to show float dialog({@see HoverInteraction})
  public tooltip: BaseTooltip;

  // the base container, contains all groups
  public container: Canvas;

  // the background group, render bgColor...
  public backgroundGroup: IGroup;

  // facet cell area group, it contains all cross-tab's cell
  public panelGroup: IGroup;

  // contains rowHeader,cornerHeader,colHeader, scroll bars
  public foregroundGroup: IGroup;

  // cell cache
  public cellCache: LruCache<string, DataCell> = new LruCache(10000);

  // cell 占位格缓存
  public cellPlaceHolderCache: LruCache<
    string,
    DataPlaceHolderCell
  > = new LruCache(10000);

  // cell 真实数据缓存（只用于树结构collapse, 宽、高拖拽拽）
  public viewMetaCache: LruCache<string, ViewMeta> = new LruCache(1000);

  // 是否需要使用view meta的cache(目前的场景 树结构collapse, 宽、高拖拽拽)，一次性消费
  public needUseCacheMeta: boolean;

  // 基础事件
  public eventController: EventController;

  // 状态管理器
  public state = new State(this);

  public devicePixelRatioMedia: MediaQueryList;

  protected constructor(
    dom: string | HTMLElement,
    dataCfg: DataCfg,
    options: SpreadsheetOptions,
  ) {
    super();
    this.dom = _.isString(dom) ? document.getElementById(dom) : dom;
    this.initGroups(this.dom, options);
    this.bindEvents();
    this.dataCfg = this.safetyDataCfg(dataCfg);
    this.options = this.safetyOptions(options);
    this.dataSet = this.initDataSet(this.options);
    this.tooltip = this.initTooltip();
    this.registerEventController();
    this.registerInteractions(this.options);
    this.initDevicePixelRatioListener();
  }

  protected registerEventController() {
    this.eventController = new EventController(this);
  }

  safetyDataCfg = (dataCfg: DataCfg): DataCfg => {
    const { rows, columns, values, derivedValues } = dataCfg.fields;
    const safetyFields = {
      rows: rows || [],
      columns: columns || [],
      values: values || [],
      derivedValues: derivedValues || [],
    } as Fields;
    return {
      ...dataCfg,
      meta: dataCfg.meta || [],
      data: dataCfg.data || [],
      sortParams: dataCfg.sortParams || [],
      fields: safetyFields,
    } as DataCfg;
  };

  safetyOptions = (options: SpreadsheetOptions): SpreadsheetOptions => {
    const safetyConditions = {
      text: [],
      background: [],
      interval: [],
      icon: [],
    } as Conditions;
    const safetyTotals = {
      row: {},
      col: {},
    } as Totals;
    return {
      ...options,
      width: options.width || 600,
      height: options.height || 480,
      debug: _.get(options, 'debug', false),
      hierarchyType: options.hierarchyType || 'grid',
      hierarchyCollapse: _.get(options, 'hierarchyCollapse', false),
      conditions: _.merge({}, safetyConditions, options.conditions || {}),
      totals: _.merge({}, safetyTotals, options.totals || {}),
      linkFieldIds: options.linkFieldIds || [],
      pagination: options.pagination || false,
      containsRowHeader: _.get(options, 'containsRowHeader', true),
      spreadsheetType: _.get(options, 'spreadsheetType', true),
      style: _.merge({}, DefaultStyleCfg(), options.style),
      showSeriesNumber: _.get(options, 'showSeriesNumber', false),
      hideNodesIds: options.hideNodesIds || [],
      keepOnlyNodesIds: options.keepOnlyNodesIds || [],
      registerDefaultInteractions: _.get(
        options,
        'registerDefaultInteractions',
        true,
      ),
      scrollReachNodeField: options.scrollReachNodeField || {
        rowField: [],
        colField: [],
      },
      hideRowColFields: options.hideRowColFields || [],
      valueInCols: _.get(options, 'valueInCols', true),
      needDataPlaceHolderCell: _.get(options, 'needDataPlaceHolderCell', false),
      hideTooltip: _.get(options, 'hideTooltip', false),
      // dataCell, cornerCell, rowCell, colCell, frame, cornerHeader, layout
      // layoutResult, hierarchy, layoutArrange 存在使用时校验，在此不处理
    } as SpreadsheetOptions;
  };

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
  protected initGroups(dom: HTMLElement, options: SpreadsheetOptions): void {
    const { width, height } = options;

    // base canvas group
    this.container = new Canvas({
      container: dom,
      width,
      height,
      localRefresh: false,
      // autoDraw: false,
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
   * 注册交互（组件按自己的场景写交互，继承此方法注册）
   * @param options
   */
  protected abstract registerInteractions(options: SpreadsheetOptions): void;

  protected abstract initDataSet(
    options: Partial<SpreadsheetOptions>,
  ): BaseDataSet<BaseParams>;

  protected abstract initTooltip(): BaseTooltip;

  protected abstract bindEvents(): void;

  protected initFacet(facetCfg: SpreadsheetFacetCfg): BaseFacet {
    return new SpreadsheetFacet(facetCfg);
  }

  protected buildFacet(): void {
    const { fields } = this.dataSet;
    if (!fields) {
      return;
    }
    const { rows, columns, values, derivedValues } = fields;

    const {
      debug,
      width,
      height,
      style,
      totals,
      hierarchyType,
      hierarchyCollapse,
      pagination,
      hideNodesIds,
      keepOnlyNodesIds,
      dataCell,
      needDataPlaceHolderCell,
      cornerCell,
      rowCell,
      colCell,
      frame,
      layout,
      cornerHeader,
      layoutResult,
      hierarchy,
      layoutArrange,
    } = this.options;

    const {
      cellCfg,
      colCfg,
      rowCfg,
      collapsedRows,
      collapsedCols,
      treeRowsWidth,
    } = style;
    this.dataSet.pivot.updateTotals(totals);
    this.dataSet.pivot.updateHideNodesIds(hideNodesIds);
    this.dataSet.pivot.updateKeepOnlyNodesIds(keepOnlyNodesIds);

    const defaultCell = (facet: ViewMeta) => this.getCorrectCell(facet);
    DebuggerUtil.getInstance().setDebug(debug);
    // the new facetCfg of facet
    // TODO 我觉得这个cfg可以干掉，因为完全就是options的映射
    const facetCfg = {
      spreadsheet: this,
      dataSet: this.dataSet,
      hierarchyType,
      collapsedRows,
      collapsedCols,
      hierarchyCollapse,
      meta: this.dataCfg.meta,
      cols: columns,
      rows,
      cellCfg,
      colCfg,
      width,
      height,
      rowCfg,
      treeRowsWidth,
      pagination,
      values,
      derivedValues,
      dataCell: dataCell || defaultCell,
      needDataPlaceHolderCell,
      cornerCell,
      rowCell,
      colCell,
      frame,
      layout,
      cornerHeader,
      layoutResult,
      hierarchy,
      layoutArrange,
    } as SpreadsheetFacetCfg;

    if (this.facet) {
      // destroy pre-facet if exists
      this.facet.destroy();
    }
    this.facet = this.initFacet(facetCfg);
    // render facet
    this.facet.render();
  }

  protected getCorrectCell(facet: ViewMeta): DataCell {
    // const valueHasDerivedValue = this.getDerivedValue(facet.valueField).derivedValueField.length === 0;
    // const isDerivedValue = this.isDerivedValue(facet.valueField);
    return this.isValueInCols()
      ? new DataCell(facet, this)
      : new StrategyDataCell(facet, this);
  }

  /**
   * Update data config and keep pre-sort operations
   * Group sort params kept in {@see store} and
   * Priority: group sort > advanced sort
   * @param dataCfg
   */
  public setDataCfg(dataCfg: DataCfg): void {
    const newDataCfg = _.clone(dataCfg);
    const lastSortParam = this.store.get('sortParam');
    const { sortParams } = newDataCfg;
    newDataCfg.sortParams = [].concat(lastSortParam || [], sortParams || []);
    if (!_.isEqual(dataCfg, this.dataSet)) {
      // 数据结构发生了任何改变，都需要清空所有meta 缓存
      this.viewMetaCache.clear();
    }
    this.dataCfg = newDataCfg;
  }

  public setOptions(options: SpreadsheetOptions): void {
    if (this.tooltip) {
      this.tooltip.hide();
    }
  }

  public render(reloadData = true, callback?: () => void): void {
    // 有些属性变化是不需要重新训练数据的，比如树结构的收缩
    if (reloadData) {
      this.dataSet.setDataCfg(this.dataCfg);
      // 有数据变化，情况列宽度计算的缓存
      this.store.set(KEY_COL_REAL_WIDTH_INFO, {
        widthInfos: {},
        realWidth: {},
      } as ColWidthCache);
    }

    this.buildFacet();
    if (_.isFunction(callback)) {
      callback();
    }
  }

  public destroy(): void {
    this.facet.destroy();
    this.tooltip.destroy();
    this.cellCache.clear();
    this.viewMetaCache.clear();
    this.removeDevicePixelRatioListener();
  }

  /**
   * Preset totalCache by users.
   * @param cache
   */
  public setTotalCache(cache: Map<string, number>): void {
    this.dataSet.pivot.updateTotalCacheGift(cache);
  }

  /**
   * Update theme config, if the {@param type} is exists, re-use it,
   * otherwise create new one {@see theme}
   * @param type string
   * @param theme
   */
  public setTheme(theme: SpreadSheetTheme, type = 'default'): void {
    if (!getTheme(type)) {
      if (theme) {
        this.theme = registerTheme(type, theme);
      } else {
        throw new Error(`Theme type '${type}' not founded.`);
      }
    } else {
      this.theme = _.merge({}, getTheme(type), theme);
    }
  }

  /**
   * Update pagination config which store in {@see options}
   * @param pagination
   */
  public updatePagination(pagination: Pagination) {
    this.options = _.merge({}, this.options, {
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
    this.options = _.merge({}, this.options, { width, height });
    // resize the canvas
    this.container.changeSize(width, height);
  }

  /**
   * tree type must be in strategy mode
   */
  public isHierarchyTreeType(): boolean {
    return _.get(this, 'options.hierarchyType', 'grid') === 'tree';
  }

  public isStrategyMode(): boolean {
    return false;
  }

  /**
   * 判断某个维度是否是衍生指标
   * @param field
   */
  public isDerivedValue(field: string): boolean {
    const derivedValues = _.get(this, 'dataCfg.fields.derivedValues', []);
    return _.find(derivedValues, (v) => _.includes(v.derivedValueField, field));
  }

  /**
   * 获取任意度量对应的指标对象（包含主指标和衍生指标）
   * 分别检查每个 主指标和衍生指标
   * @param field
   */
  public getDerivedValue(field: string): DerivedValue {
    const derivedValues = _.get(this, 'dataCfg.fields.derivedValues', []);
    return (
      _.find(
        derivedValues,
        (v) => field === v.valueField || _.includes(v.derivedValueField, field),
      ) || {
        valueField: '',
        derivedValueField: [],
        displayDerivedValueField: [],
      }
    );
  }

  public isColAdaptive(): boolean {
    return (
      _.get(this, 'options.style.colCfg.colWidthType', 'adaptive') ===
      'adaptive'
    );
  }

  /**
   * Check if is SpreadSheet mode
   */
  public isSpreadsheetType(): boolean {
    return _.get(this, 'options.spreadsheetType', true);
  }

  /**
   * Check whether scroll contains row header
   * For now contains row header in ListSheet mode by default
   */
  public isScrollContainsRowHeader(): boolean {
    return (
      !_.get(this, 'options.containsRowHeader', true) ||
      !this.isSpreadsheetType()
    );
  }

  /**
   * Scroll Freeze Row Header
   */
  public freezeRowHeader(): boolean {
    return !_.get(this, 'options.containsRowHeader', true);
  }

  /**
   * Get all panel group cells
   * @param callback to handle each cell if needed
   */
  public getPanelAllCells(callback?: (cell: DataCell) => void): DataCell[] {
    const children = this.panelGroup.get('children');
    const cells: DataCell[] = [];
    children.forEach((child) => {
      if (child instanceof DataCell) {
        cells.push(child);
        if (callback) {
          callback(child);
        }
      }
    });
    return cells;
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
    return _.get(this, 'dataCfg.fields.columns', []).length + 1;
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
   * but offsetY(vertical scroll dont need animation)
   */
  public updateScrollOffset(offsetConfig: OffsetConfig): void {
    this.facet.updateScrollOffset(
      _.merge(
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
    return this.options.valueInCols;
  }

  private initDevicePixelRatioListener() {
    this.devicePixelRatioMedia = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`,
    );
    if (this.devicePixelRatioMedia?.addEventListener) {
      this.devicePixelRatioMedia.addEventListener(
        'change',
        this.renderByDevicePixelRatio,
      );
    } else {
      this.devicePixelRatioMedia.addListener(this.renderByDevicePixelRatio);
    }
  }

  private removeDevicePixelRatioListener() {
    if (this.devicePixelRatioMedia?.removeEventListener) {
      this.devicePixelRatioMedia.removeEventListener(
        'change',
        this.renderByDevicePixelRatio,
      );
    } else {
      this.devicePixelRatioMedia.removeListener(this.renderByDevicePixelRatio);
    }
  }

  private renderByDevicePixelRatio = () => {
    const { width, height } = this.options;
    const ratio = window.devicePixelRatio;
    const newWidth = Math.floor(width * ratio);
    const newHeight = Math.floor(height * ratio);

    this.container.resetMatrix();
    this.container.set('pixelRatio', ratio);
    this.container.changeSize(newWidth, newHeight);

    matrixTransform(this.container.getMatrix(), [['scale', ratio, ratio]]);

    this.render(false);
  };

  public setState(cell, stateName) {
    this.state.setState(cell, stateName);
  }

  public getCurrentState() {
    return this.state.getCurrentState();
  }

  public clearState() {
    this.state.clearState();
  }

  public updateCellStyleByState() {
    const cells = this.getCurrentState().cells;
    cells.forEach((cell: BaseCell<Node>) => {
      cell.updateByState(this.getCurrentState().stateName);
    });
  }
}
