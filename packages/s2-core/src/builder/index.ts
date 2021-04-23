import { deepMix } from '@antv/util';
import {
  CellCallback,
  Conditions,
  CornerHeaderCallback,
  DataCellCallback,
  FrameCallback,
  HierarchyCallback,
  KeepOnlyIds,
  LayoutArrangeCallback,
  LayoutCallback,
  LayoutResultCallback,
  NodeField,
  Pagination,
  SpreadsheetOptions,
  CustomHeaderCells,
  Style,
  Totals,
} from '../common/interface';
import { TREE_ROW_DEFAULT_WIDTH } from '../common/constant';
import { DefaultStyleCfg } from './default-style-cfg';

export class SpreadSheetOptionsBuilder {
  public static Builder(): SpreadSheetOptionsBuilder {
    return new SpreadSheetOptionsBuilder();
  }

  private _conditions: Conditions;

  private _width: number;

  private _height: number;

  private _hierarchyCollapse: boolean;

  private _hierarchyType: 'grid' | 'tree';

  private _linkFieldIds: string[];

  private _pagination: Pagination;

  private _containsRowHeader: boolean;

  private _spreadsheetType: boolean;

  private _style: Partial<Style>;

  private _totals: Totals;

  private _customHeaderCells: CustomHeaderCells;

  private _showSeriesNumber: boolean;

  private _hideNodesIds: string[];

  private _keepOnlyNodesIds: KeepOnlyIds;

  private _registerDefaultInteractions: boolean;

  private _scrollReachNodeField: NodeField;

  private _hideRowColFields: string[];

  private _valueInCols = true;

  // 自定义单元格cell
  private _dataCell: DataCellCallback;

  // 自定义cornerCell
  private _cornerCell: CellCallback;

  // 自定义行头cell
  private _rowCell: CellCallback;

  // 自定义列头cell
  private _colCell: CellCallback;

  // 自定义 frame 边框
  private _frame: FrameCallback;

  // 角头可能需要全部自定义，而不是用交叉表概念的node来渲染
  private _cornerHeader: CornerHeaderCallback;

  // 自定义layout
  private _layout: LayoutCallback;

  // 自定义布局结果
  private _layoutResult: LayoutResultCallback;

  // 行列结构的自定义
  private _hierarchy: HierarchyCallback;

  // 行列 维度值的自定义排序
  private _layoutArrange: LayoutArrangeCallback;

  private _debug: boolean;

  public build(): SpreadsheetOptions {
    return {
      debug: this._debug,
      conditions: this._conditions,
      width: this._width,
      height: this._height,
      hierarchyCollapse: this._hierarchyCollapse || false,
      hierarchyType: this._hierarchyType || 'grid',
      linkFieldIds: this._linkFieldIds || [],
      pagination: this._pagination,
      containsRowHeader: this._containsRowHeader || false,
      spreadsheetType: this._spreadsheetType,
      style: deepMix({}, DefaultStyleCfg(), this._style),
      totals: this._totals,
      customHeaderCells: this._customHeaderCells,
      showSeriesNumber: this._showSeriesNumber || false,
      hideNodesIds: this._hideNodesIds || [],
      keepOnlyNodesIds: this._keepOnlyNodesIds || { rowIds: [], colIds: [] },
      registerDefaultInteractions: this._registerDefaultInteractions,
      scrollReachNodeField: this._scrollReachNodeField || {
        rowField: '',
        colField: '',
      },
      hideRowColFields: this._hideRowColFields || [],
      valueInCols: this._valueInCols || false,
      dataCell: this._dataCell,
      cornerCell: this._cornerCell,
      rowCell: this._rowCell,
      colCell: this._colCell,
      frame: this._frame,
      cornerHeader: this._cornerHeader,
      layout: this._layout,
      layoutResult: this._layoutResult,
      hierarchy: this._hierarchy,
      layoutArrange: this._layoutArrange,
    } as SpreadsheetOptions;
  }

  public debug(debug: boolean) {
    this._debug = debug;
    return this;
  }

  public layoutArrange(layoutArrange: LayoutArrangeCallback) {
    this._layoutArrange = layoutArrange;
    return this;
  }

  public hierarchy(hierarchy: HierarchyCallback) {
    this._hierarchy = hierarchy;
    return this;
  }

  public layoutResult(layoutResult: LayoutResultCallback) {
    this._layoutResult = layoutResult;
    return this;
  }

  public layout(layout: LayoutCallback) {
    this._layout = layout;
    return this;
  }

  public cornerHeader(cornerHeader: CornerHeaderCallback) {
    this._cornerHeader = cornerHeader;
    return this;
  }

  public frame(frame: FrameCallback) {
    this._frame = frame;
    return this;
  }

  public colCell(colCell: CellCallback) {
    this._colCell = colCell;
    return this;
  }

  public rowCell(rowCell: CellCallback) {
    this._rowCell = rowCell;
    return this;
  }

  public cornerCell(cornerCell: CellCallback) {
    this._cornerCell = cornerCell;
    return this;
  }

  public dataCell(dataCell: DataCellCallback) {
    this._dataCell = dataCell;
    return this;
  }

  public valueInCols(valueInCols: boolean) {
    this._valueInCols = valueInCols;
    return this;
  }

  public hideRowColFields(hideRowColFields: string[]) {
    this._hideRowColFields = hideRowColFields;
    return this;
  }

  public scrollReachNodeField(scrollReachNodeField: NodeField) {
    this._scrollReachNodeField = scrollReachNodeField;
    return this;
  }

  public registerDefaultInteractions(registerDefaultInteractions: boolean) {
    this._registerDefaultInteractions = registerDefaultInteractions;
    return this;
  }

  public keepOnlyNodesIds(keepOnlyNodesIds: KeepOnlyIds) {
    this._keepOnlyNodesIds = keepOnlyNodesIds;
    return this;
  }

  public hideNodesIds(hideNodesIds: string[]) {
    this._hideNodesIds = hideNodesIds;
    return this;
  }

  public showSeriesNumber(
    showSeriesNumber: boolean,
  ): SpreadSheetOptionsBuilder {
    this._showSeriesNumber = showSeriesNumber;
    return this;
  }

  public totals(totals: Totals): SpreadSheetOptionsBuilder {
    this._totals = totals;
    return this;
  }

  public style(style: Partial<Style>): SpreadSheetOptionsBuilder {
    this._style = style;
    return this;
  }

  public customHeaderCells(
    customHeaderCells: CustomHeaderCells,
  ): SpreadSheetOptionsBuilder {
    this._customHeaderCells = customHeaderCells;
    return this;
  }

  public spreadsheetType(spreadsheetType: boolean): SpreadSheetOptionsBuilder {
    this._spreadsheetType = spreadsheetType;
    return this;
  }

  public containsRowHeader(
    containsRowHeader: boolean,
  ): SpreadSheetOptionsBuilder {
    this._containsRowHeader = containsRowHeader;
    return this;
  }

  public pagination(pagination: Pagination): SpreadSheetOptionsBuilder {
    this._pagination = pagination;
    return this;
  }

  public linkFieldIds(linkFieldIds: string[]): SpreadSheetOptionsBuilder {
    this._linkFieldIds = linkFieldIds;
    return this;
  }

  public hierarchyType(
    hierarchyType: 'grid' | 'tree',
  ): SpreadSheetOptionsBuilder {
    this._hierarchyType = hierarchyType;
    return this;
  }

  public hierarchyCollapse(
    hierarchyCollapse: boolean,
  ): SpreadSheetOptionsBuilder {
    this._hierarchyCollapse = hierarchyCollapse;
    return this;
  }

  public height(height: number): SpreadSheetOptionsBuilder {
    this._height = height;
    return this;
  }

  public width(width: number): SpreadSheetOptionsBuilder {
    this._width = width;
    return this;
  }

  public conditions(conditions: Conditions): SpreadSheetOptionsBuilder {
    this._conditions = conditions;
    return this;
  }

  private _defaultStyle(): Style {
    return {
      treeRowsWidth: TREE_ROW_DEFAULT_WIDTH,
      collapsedRows: {},
      collapsedCols: {},
      cellCfg: {
        width: 96,
        height: 30,
        padding: 0,
      },
      rowCfg: {
        width: 96,
        widthByField: {},
      },
      colCfg: {
        height: 40,
        widthByFieldValue: {},
        heightByField: {},
        colWidthType: 'adaptive',
        totalSample: 10,
        detailSample: 30,
        showDerivedIcon: true,
        maxSampleIndex: 1,
      },
      plotSize: {
        width: 640,
        height: 480,
      },
      device: 'pc',
    } as Style;
  }
}
