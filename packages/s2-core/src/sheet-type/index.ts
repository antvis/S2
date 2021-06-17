import EE from '@antv/event-emitter';
import { Canvas, IGroup } from '@antv/g-canvas';
import {
  isString,
  get,
  merge,
  clone,
  find,
  isFunction,
  includes,
  debounce,
} from 'lodash';
import { Store } from '@/common/store';
import { ext } from '@antv/matrix-util';
import {
  ColWidthCache,
  DerivedValue,
  safetyDataConfig,
  OffsetConfig,
  Pagination,
  S2DataConfig,
  S2Options,
  SpreadSheetFacetCfg,
  ViewMeta,
  safetyOptions,
  Totals,
  Total,
  ShowProps,
} from '../common/interface';
import { DataCell, BaseCell, RowCell, ColCell, CornerCell } from '../cell';
import {
  KEY_AFTER_COLLAPSE_ROWS,
  KEY_COLLAPSE_ROWS,
  KEY_COLLAPSE_TREE_ROWS,
  KEY_GROUP_BACK_GROUND,
  KEY_GROUP_FORE_GROUND,
  KEY_GROUP_PANEL_GROUND,
  KEY_TREE_ROWS_COLLAPSE_ALL,
  KEY_UPDATE_PROPS,
} from '../common/constant';
import { BaseDataSet, PivotDataSet } from '../data-set';
import {
  Node,
  BaseInteraction,
  SpreadSheetTheme,
  BaseEvent,
  BrushSelection,
  RowColResize,
  DataCellMutiSelection,
  ColRowMutiSelection,
  DataCellClick,
  CornerTextClick,
  RowColumnClick,
  RowTextClick,
  HoverEvent,
  MergedCellsClick,
} from '../index';
import { getTheme } from '../theme';
import { BaseTooltip } from '../tooltip';
import { BaseFacet } from 'src/facet';
import { DebuggerUtil } from '@/common/debug';
import { EventController } from '@/interaction/events/event-controller';
import { DefaultInterceptEvent } from '@/interaction/events/types';
import { State } from '@/state/state';
import { isMobile } from '@/utils/is-mobile';
import {
  EventNames,
  InteractionNames,
  SelectedStateName,
} from '../common/constant';
import { i18n } from '../common/i18n';
import { PivotFacet } from '../facet';

const matrixTransform = ext.transform;
export class SpreadSheet extends EE {
  public static DEBUG_ON = false;

  // dom id
  public dom: HTMLElement;

  // theme config
  public theme: SpreadSheetTheme;

  public interactions: Map<string, BaseInteraction> = new Map();

  public events: Map<string, BaseEvent> = new Map();

  // store some temporary data
  public store: Store = new Store();

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

  // contains rowHeader,cornerHeader,colHeader, scroll bars
  public foregroundGroup: IGroup;

  // 基础事件
  public eventController: EventController;

  // 状态管理器
  public state = new State(this);

  public devicePixelRatioMedia: MediaQueryList;

  // 用来标记需要拦截的事件，interaction和本身的hover等事件可能会有冲突，有冲突时在此屏蔽
  public interceptEvent: Set<DefaultInterceptEvent> = new Set();

  // hover有keep-hover态，是个计时器，hover后800毫秒还在当前cell的情况下，该cell进入keep-hover状态
  // 在任何触发点击，或者点击空白区域时，说明已经不是hover了，因此需要取消这个计时器。
  public hoverTimer: number = null;

  public viewport = window as typeof window & { visualViewport: Element };

  public constructor(
    dom: string | HTMLElement,
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

    // TODO 这个三个好乱，@缨缨 梳理下？
    this.registerEventController();
    // 注意这俩的顺序，不要反过来，因为interaction中会屏蔽event，但是event不会屏蔽interaction
    this.registerInteractions(this.options);
    this.registerEvents();
  }

  getTooltip = (initTooltip: S2Options['initTooltip']): BaseTooltip => {
    return initTooltip?.(this) || new BaseTooltip(this);
  };

  getDataSet = (options: S2Options): BaseDataSet => {
    const { mode, dataSet } = options;
    if (dataSet) {
      return dataSet(this);
    }
    // TODO table data set
    return mode === 'table' ? new PivotDataSet(this) : new PivotDataSet(this);
  };

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
    // 有些属性变化是不需要重新训练数据的，比如树结构的收缩
    if (reloadData) {
      this.dataSet.setDataCfg(this.dataCfg);
      // 有数据变化，情况列宽度计算的缓存
      this.store.set('colRealWidthInfo', {
        widthInfos: {},
        realWidth: {},
      } as ColWidthCache);
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
  public setTheme(
    theme: SpreadSheetTheme,
    type = 'default',
    hueIvert = true,
  ): void {
    this.theme = merge({}, getTheme(type, hueIvert), theme);
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
    return get(this, 'options.hierarchyType', 'grid') === 'tree';
  }

  /**
   * 判断某个维度是否是衍生指标
   * @param field
   */
  public isDerivedValue(field: string): boolean {
    const derivedValues = get(this, 'dataCfg.fields.derivedValues', []);
    return find(derivedValues, (v) => includes(v.derivedValueField, field));
  }

  /**
   * 获取任意度量对应的指标对象（包含主指标和衍生指标）
   * 分别检查每个 主指标和衍生指标
   * @param field
   */
  public getDerivedValue(field: string): DerivedValue {
    const derivedValues = get(this, 'dataCfg.fields.derivedValues', []);
    return (
      find(
        derivedValues,
        (v) => field === v.valueField || includes(v.derivedValueField, field),
      ) || {
        valueField: '',
        derivedValueField: [],
        displayDerivedValueField: [],
      }
    );
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
   * but offsetY(vertical scroll dont need animation)
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
    cells.forEach((cell) => {
      cell.updateByState(this.getCurrentState().stateName);
    });
  }

  public showTooltip(showOptions: ShowProps) {
    if (get(this, 'options.tooltip.showTooltip')) {
      this.tooltip.show(showOptions);
    }
  }

  public hideTooltip() {
    this.tooltip.hide();
  }

  // 获取当前cell实例
  public getCell(target) {
    let parent = target;
    // 一直索引到g顶层的canvas来检查是否在指定的cell中
    while (parent && !(parent instanceof Canvas)) {
      if (parent instanceof BaseCell) {
        // 在单元格中，返回true
        return parent;
      }
      parent = parent.get('parent');
    }
    return null;
  }

  // 获取当前cell类型
  public getCellType(target) {
    const cell = this.getCell(target);
    if (cell instanceof DataCell) {
      return DataCell.name;
    }
    if (cell instanceof RowCell) {
      return RowCell.name;
    }
    if (cell instanceof ColCell) {
      return ColCell.name;
    }
    if (cell instanceof CornerCell) {
      return CornerCell.name;
    }
    return '';
  }

  // 因此需要手动把当前行头列头选择下的cell样式重置
  public clearStyleIndependent() {
    const currentState = this.getCurrentState();
    if (
      currentState.stateName === SelectedStateName.COL_SELECTED ||
      currentState.stateName === SelectedStateName.ROW_SELECTED ||
      currentState.stateName === SelectedStateName.HOVER
    ) {
      this.getPanelAllCells().forEach((cell) => {
        cell.hideShapeUnderState();
      });
    }
  }

  public upDatePanelAllCellsStyle() {
    this.getPanelAllCells().forEach((cell) => {
      cell.update();
    });
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

  protected registerEventController() {
    this.eventController = new EventController(this);
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

  buildFacet = () => {
    const { fields, meta } = this.dataSet;
    const { rows, columns, values, derivedValues } = fields;
    const {
      width,
      height,
      style,
      hierarchyType,
      hierarchyCollapse,
      pagination,
      dataCell,
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

    const defaultCell = (facet: ViewMeta) => this.getCorrectCell(facet);
    // the new facetCfg of facet
    const facetCfg = {
      spreadsheet: this,
      dataSet: this.dataSet,
      hierarchyType,
      collapsedRows,
      collapsedCols,
      hierarchyCollapse,
      meta: meta,
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
      cornerCell,
      rowCell,
      colCell,
      frame,
      layout,
      cornerHeader,
      layoutResult,
      hierarchy,
      layoutArrange,
    } as SpreadSheetFacetCfg;
    this.facet?.destroy();
    this.facet = new PivotFacet(facetCfg);
    // render facet
    this.facet.render();
  };

  /**
   * 注册交互（组件按自己的场景写交互，继承此方法注册）
   * @param options
   */
  protected registerInteractions(options: S2Options) {
    this.interactions.clear();
    if (get(options, 'registerDefaultInteractions', true) && !isMobile()) {
      this.interactions.set(
        InteractionNames.BRUSH_SELECTION_INTERACTION,
        new BrushSelection(this),
      );
      this.interactions.set(
        InteractionNames.COL_ROW_RESIZE_INTERACTION,
        new RowColResize(this),
      );
      this.interactions.set(
        InteractionNames.DATACELL_MUTI_SELECTION_INTERACTION,
        new DataCellMutiSelection(this),
      );
      this.interactions.set(
        InteractionNames.COL_ROW_MUTI_SELECTION_INTERACTION,
        new ColRowMutiSelection(this),
      );
    }
  }

  protected getCorrectCell(facet: ViewMeta): DataCell {
    return new DataCell(facet, this);
    // return this.isValueInCols()
    //   ? new DataCell(facet, this)
    //   : new DataDerivedCell(facet, this);
  }

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
      this.setOptions({
        ...this.options,
        hierarchyCollapse: !isCollapse,
        style: {
          ...this.options?.style,
          collapsedRows: {},
        },
      });
      this.render(false);
    });

    this.initDevicePixelRatioListener();
    this.initDeviceZoomListener();
  }

  // 注册事件
  protected registerEvents() {
    this.events.clear();
    this.events.set(EventNames.DATACELL_CLICK_EVENT, new DataCellClick(this));
    this.events.set(
      EventNames.CORNER_TEXT_CLICK_EVENT,
      new CornerTextClick(this),
    );
    this.events.set(
      EventNames.ROW_COLUMN_CLICK_EVENT,
      new RowColumnClick(this),
    );
    this.events.set(EventNames.ROW_TEXT_CLICK_EVENT, new RowTextClick(this));
    this.events.set(
      EventNames.MERGEDCELLS_CLICK_EVENT,
      new MergedCellsClick(this),
    );
    this.events.set(EventNames.HOVER_EVENT, new HoverEvent(this));
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
