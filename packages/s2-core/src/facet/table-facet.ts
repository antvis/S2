import { Group, Rect } from '@antv/g';
import {
  isBoolean,
  isEmpty,
  isNumber,
  keys,
  last,
  max,
  maxBy,
  set,
} from 'lodash';
import { TableColCell, TableDataCell, TableSeriesNumberCell } from '../cell';
import { LAYOUT_SAMPLE_COUNT, i18n } from '../common';
import {
  EMPTY_PLACEHOLDER_GROUP_CONTAINER_Z_INDEX,
  KEY_GROUP_EMPTY_PLACEHOLDER,
  KEY_GROUP_ROW_RESIZE_AREA,
  LayoutWidthType,
  S2Event,
  SERIES_NUMBER_FIELD,
} from '../common/constant';
import { DebuggerUtil } from '../common/debug';
import type {
  CellCallbackParams,
  Data,
  DataItem,
  FilterParam,
  LayoutResult,
  ResizeInteractionOptions,
  SimpleData,
  SortParams,
  TableSortParam,
  ViewMeta,
  ViewMetaData,
} from '../common/interface';
import type { TableDataSet } from '../data-set';
import type { SpreadSheet } from '../sheet-type';
import { renderIcon, renderText } from '../utils';
import { getDataCellId } from '../utils/cell/data-cell';
import { getOccupiedWidthForTableCol } from '../utils/cell/table-col-cell';
import { getIndexRangeWithOffsets } from '../utils/facet';
import { getAllChildCells } from '../utils/get-all-child-cells';
import { floor, round } from '../utils/math';
import type { BaseFacet } from './base-facet';
import { CornerBBox } from './bbox/corner-bbox';
import { FrozenFacet } from './frozen-facet';
import { Frame } from './header';
import { TableColHeader } from './header/table-col';
import { buildHeaderHierarchy } from './layout/build-header-hierarchy';
import { Hierarchy } from './layout/hierarchy';
import { layoutCoordinate } from './layout/layout-hooks';
import { Node } from './layout/node';

export class TableFacet extends FrozenFacet {
  public emptyPlaceholderGroup: Group;

  private lastRowOffset: number;

  public constructor(spreadsheet: SpreadSheet) {
    super(spreadsheet);
    this.spreadsheet.on(S2Event.RANGE_SORT, this.onSortHandler);
    this.spreadsheet.on(S2Event.RANGE_FILTER, this.onFilterHandler);
  }

  protected getCornerCellInstance() {
    return null;
  }

  protected override getRowCellInstance(node: ViewMeta) {
    const { dataCell } = this.spreadsheet.options;

    return (
      dataCell?.(node, this.spreadsheet) ||
      new TableDataCell(node, this.spreadsheet)
    );
  }

  protected override getColCellInstance(...args: CellCallbackParams) {
    const { colCell } = this.spreadsheet.options;

    return colCell?.(...args) || new TableColCell(...args);
  }

  protected initGroups() {
    super.initGroups();
    this.initEmptyPlaceholderGroup();
  }

  protected shouldRender(): boolean {
    const { fields } = this.spreadsheet.dataSet;
    const isOnlyContainedSeriesNumber = fields?.columns?.every(
      (field) => field === SERIES_NUMBER_FIELD,
    );

    return super.shouldRender() && !isOnlyContainedSeriesNumber;
  }

  public render() {
    if (!this.shouldRender()) {
      return;
    }

    super.render();
    this.renderEmptyPlaceholder();
  }

  public clearAllGroup() {
    super.clearAllGroup();
    this.emptyPlaceholderGroup.remove();
  }

  private initEmptyPlaceholderGroup() {
    this.emptyPlaceholderGroup = this.spreadsheet.container.appendChild(
      new Group({
        name: KEY_GROUP_EMPTY_PLACEHOLDER,
        style: { zIndex: EMPTY_PLACEHOLDER_GROUP_CONTAINER_Z_INDEX },
      }),
    );
  }

  private renderEmptyPlaceholder() {
    if (!this.spreadsheet.dataSet?.isEmpty()) {
      return;
    }

    const { empty } = this.spreadsheet.options.placeholder!;
    const { background } = this.spreadsheet.theme;
    const { icon, description } = this.spreadsheet.theme.empty;
    const {
      horizontalBorderWidth,
      horizontalBorderColor,
      horizontalBorderColorOpacity,
    } = this.spreadsheet.theme.dataCell.cell!;
    const { maxY, viewportWidth, height } = this.panelBBox;
    const iconX = viewportWidth / 2 - icon.width / 2;
    const iconY = height / 2 + maxY - icon.height / 2 + icon.margin.top;
    const text = empty?.description ?? i18n('暂无数据');
    const descWidth = this.measureTextWidth(text, description);
    const descX = viewportWidth / 2 - descWidth / 2;
    const descY = iconY + icon.height + icon.margin.bottom;

    // 边框
    const border = new Rect({
      style: {
        x: 0,
        y: maxY,
        width: viewportWidth,
        height,
        stroke: horizontalBorderColor,
        strokeWidth: horizontalBorderWidth,
        strokeOpacity: horizontalBorderColorOpacity,
        fill: background?.color,
        fillOpacity: background?.opacity ?? 1,
      },
    });

    this.emptyPlaceholderGroup.appendChild(border);

    // 空状态 Icon
    renderIcon(this.emptyPlaceholderGroup, {
      ...icon,
      name: empty?.icon!,
      x: iconX,
      y: iconY,
      width: icon.width,
      height: icon.height,
    });

    // 空状态描述文本
    renderText({
      group: this.emptyPlaceholderGroup,
      style: {
        ...description,
        text,
        x: descX,
        y: descY,
      },
    });

    this.emptyPlaceholderGroup.toFront();
  }

  private getDataCellAdaptiveHeight(viewMeta: ViewMeta): number {
    const node = { id: String(viewMeta?.rowIndex) } as Node;
    const rowHeight = this.getRowCellHeight(node);

    if (this.isCustomRowCellHeight(node)) {
      // 标记当前行是否为自定义高度
      this.customRowHeightStatusMap[viewMeta?.rowIndex] = true;

      return rowHeight || 0;
    }

    const defaultHeight = this.getCellHeightByRowIndex(viewMeta?.rowIndex);

    return this.getNodeAdaptiveHeight({
      meta: viewMeta,
      cell: this.textWrapTempRowCell,
      defaultHeight,
    });
  }

  private getCellHeightByRowIndex(rowIndex: number) {
    if (this.rowOffsets) {
      return this.getRowCellHeight({ id: String(rowIndex) } as Node) ?? 0;
    }

    return this.getDefaultCellHeight();
  }

  /**
   * 开启换行后, 需要自适应调整高度, 明细表通过 rowCell.heightByField 调整, 同时还有一个 rowOffsets 控制行高, 所以要提前设置好, 保证渲染正确.
   */
  private presetRowCellHeightIfNeeded(rowIndex: number) {
    const { style } = this.spreadsheet.options;
    const colLeafNodes = this.getColLeafNodes();

    // 不超过一行或者用户已经配置过当前行高则无需预设
    if (isEmpty(colLeafNodes) || style?.dataCell?.maxLines! <= 1) {
      return;
    }

    // 当前行高取整行 dataCell 高度最大的值
    const maxDataCellHeight = max(
      colLeafNodes.map((colNode) => {
        const viewMeta = this.getCellMeta(rowIndex, colNode.colIndex);

        return this.getDataCellAdaptiveHeight(viewMeta!);
      }),
    );

    // getCellHeightByRowIndex 会优先读取 heightByField, 保持逻辑统一
    const height = maxDataCellHeight || this.getDefaultCellHeight();

    set(
      this.spreadsheet.options,
      `style.rowCell.heightByField.${rowIndex}`,
      height,
    );
  }

  protected calculateRowOffsets() {
    const { style } = this.spreadsheet.options;
    const heightByField = style?.rowCell?.heightByField;
    const isEnableHeightAdaptive =
      style?.dataCell?.maxLines! > 1 && style?.dataCell?.wordWrap;

    if (keys(heightByField!).length || isEnableHeightAdaptive) {
      const data = this.spreadsheet.dataSet.getDisplayDataSet();

      this.textWrapNodeHeightCache.clear();
      this.customRowHeightStatusMap = {};
      this.rowOffsets = [0];
      this.lastRowOffset = 0;

      data.forEach((_, rowIndex) => {
        this.presetRowCellHeightIfNeeded(rowIndex);
        const currentHeight = this.getCellHeightByRowIndex(rowIndex);
        const currentOffset = this.lastRowOffset + currentHeight;

        this.rowOffsets.push(currentOffset);
        this.lastRowOffset = currentOffset;
      });
    }
  }

  private onSortHandler = async (sortParams: SortParams) => {
    const s2 = this.spreadsheet;
    let params = sortParams;

    // 兼容之前 sortParams 为对象的用法
    if (!Array.isArray(sortParams)) {
      params = [sortParams];
    }

    const currentParams = s2.dataCfg.sortParams || [];

    params = params.map((item) => {
      const newItem = {
        ...item,
        // 兼容之前 sortKey 的用法
        sortFieldId: (item as TableSortParam).sortKey ?? item.sortFieldId,
      };

      const oldItem =
        currentParams.find((p) => p.sortFieldId === newItem.sortFieldId) ?? {};

      return {
        ...oldItem,
        ...newItem,
      };
    });

    const oldConfigs = currentParams.filter((config) => {
      const newItem = params.find((p) => p.sortFieldId === config.sortFieldId);

      if (newItem) {
        return false;
      }

      return true;
    });

    set(s2.dataCfg, 'sortParams', [...oldConfigs, ...params]);
    s2.setDataCfg(s2.dataCfg);
    await s2.render(true);

    s2.emit(
      S2Event.RANGE_SORTED,
      (s2.dataSet as TableDataSet).getDisplayDataSet(),
    );
  };

  private onFilterHandler = async (params: FilterParam) => {
    const s2 = this.spreadsheet;
    const unFilter =
      !params.filteredValues || params.filteredValues.length === 0;

    const oldConfig = s2.dataCfg.filterParams || [];
    // check whether filter condition already exists on column, if so, modify it instead.
    const oldIndex = oldConfig.findIndex(
      (item) => item.filterKey === params.filterKey,
    );

    if (oldIndex !== -1) {
      if (unFilter) {
        // remove filter params on current key if passed an empty filterValues field
        oldConfig.splice(oldIndex, 1);
      } else {
        // if filter with same key already exists, replace it
        oldConfig[oldIndex] = params;
      }
    } else {
      oldConfig.push(params);
    }

    set(s2.dataCfg, 'filterParams', oldConfig);

    await s2.render(true);
    s2.emit(
      S2Event.RANGE_FILTERED,
      (s2.dataSet as TableDataSet).getDisplayDataSet(),
    );
  };

  public destroy(): void {
    super.destroy();
    this.spreadsheet.off(S2Event.RANGE_SORT, this.onSortHandler);
    this.spreadsheet.off(S2Event.RANGE_FILTER, this.onFilterHandler);
  }

  protected calculateCornerBBox() {
    const { colsHierarchy } = this.getLayoutResult();
    const height = floor(colsHierarchy.height);

    this.cornerBBox = new CornerBBox(this as unknown as BaseFacet);
    this.cornerBBox.height = height;
    this.cornerBBox.maxY = height;
  }

  protected doLayout(): LayoutResult {
    const rowsHierarchy = new Hierarchy();
    const { colLeafNodes, colsHierarchy } = this.buildColHeaderHierarchy();

    this.calculateColNodesCoordinate(colLeafNodes, colsHierarchy);

    return {
      colNodes: colsHierarchy.getNodes(),
      colLeafNodes,
      colsHierarchy,
      rowNodes: [],
      rowsHierarchy,
      rowLeafNodes: [],
      cornerNodes: [],
    };
  }

  private buildColHeaderHierarchy() {
    const colHierarchy = buildHeaderHierarchy({
      isRowHeader: false,
      spreadsheet: this.spreadsheet,
    });

    return {
      colLeafNodes: colHierarchy.leafNodes,
      colsHierarchy: colHierarchy.hierarchy,
    };
  }

  public getCellMeta(rowIndex: number = 0, colIndex: number = 0) {
    const { options, dataSet } = this.spreadsheet;
    const colLeafNodes = this.getColLeafNodes();
    const colNode = colLeafNodes[colIndex];

    if (!colNode) {
      return null;
    }

    let data: ViewMetaData | SimpleData | undefined;

    const x = colNode.x;
    const y = this.viewCellHeights.getCellOffsetY(rowIndex);
    const cellHeight = this.getCellHeightByRowIndex(rowIndex);

    if (options.seriesNumber?.enable && colNode.field === SERIES_NUMBER_FIELD) {
      data = rowIndex + 1;
    } else {
      data = (dataSet as TableDataSet).getCellData({
        query: {
          field: colNode.field,
          rowIndex,
        },
      });
    }

    const valueField = colNode.field;
    const fieldValue = data as DataItem;
    const rowQuery: ViewMeta['rowQuery'] = { rowIndex };
    const colQuery: ViewMeta['colQuery'] = { colIndex };

    const cellMeta: ViewMeta = {
      spreadsheet: this.spreadsheet,
      x,
      y,
      width: colNode.width,
      height: cellHeight,
      data: {
        [colNode.field]: data,
      } as unknown as Data,
      rowIndex,
      colIndex,
      isTotals: false,
      colId: colNode.id,
      rowId: String(rowIndex),
      valueField,
      fieldValue,
      id: getDataCellId(String(rowIndex), colNode.id),
      rowQuery,
      colQuery,
      query: {
        ...rowQuery,
        ...colQuery,
      },
    };

    return options.layoutCellMeta?.(cellMeta) ?? cellMeta;
  }

  private getAdaptiveColWidth(colLeafNodes: Node[]) {
    const { dataCell } = this.spreadsheet.options.style!;
    const { seriesNumber } = this.spreadsheet.options;

    if (this.spreadsheet.getLayoutWidthType() !== LayoutWidthType.Compact) {
      const seriesNumberWidth = this.getSeriesNumberWidth();
      const colHeaderColSize =
        colLeafNodes.length - (seriesNumber?.enable ? 1 : 0);
      const canvasW =
        this.getCanvasSize().width -
        seriesNumberWidth -
        Frame.getVerticalBorderWidth(this.spreadsheet);

      return Math.max(
        dataCell?.width!,
        floor(canvasW / Math.max(1, colHeaderColSize)),
      );
    }

    return round(dataCell?.width ?? 0);
  }

  private calculateColLeafNodesWidth(
    colLeafNodes: Node[],
    colsHierarchy: Hierarchy,
  ) {
    let preLeafNode = Node.blankNode();
    let currentCollIndex = 0;

    const adaptiveColWidth = this.getAdaptiveColWidth(colLeafNodes);

    colsHierarchy.getLeaves().forEach((currentNode) => {
      currentNode.colIndex = currentCollIndex;
      currentCollIndex += 1;
      currentNode.x = preLeafNode.x + preLeafNode.width;
      currentNode.width = this.getColLeafNodesWidth(
        currentNode,
        adaptiveColWidth,
      );
      layoutCoordinate(this.spreadsheet, null, currentNode);
      colsHierarchy.width += currentNode.width;
      preLeafNode = currentNode;
    });
  }

  private calculateColNodesHeight(colsHierarchy: Hierarchy) {
    const colNodes = colsHierarchy.getNodes();

    colNodes.forEach((colNode) => {
      if (colNode.level === 0) {
        colNode.y = 0;
      } else {
        colNode.y = colNode?.parent?.y! + colNode?.parent?.height! || 0;
      }

      colNode.height = this.getColNodeHeight({
        colNode,
        colsHierarchy,
        useCache: false,
      });
    });
  }

  private calculateColNodesCoordinate(
    colLeafNodes: Node[],
    colsHierarchy: Hierarchy,
  ) {
    // 先计算宽度, 再计算高度, 确保计算多行文本时能获取到正确的最大文本宽度
    this.calculateColLeafNodesWidth(colLeafNodes, colsHierarchy);
    this.calculateColParentNodeWidthAndX(colLeafNodes);
    this.updateColsHierarchySampleMaxHeightNodes(colsHierarchy);
    this.calculateColNodesHeight(colsHierarchy);
    this.updateCustomFieldsSampleNodes(colsHierarchy);
    this.adjustCustomColLeafNodesHeight({
      leafNodes: colLeafNodes,
      hierarchy: colsHierarchy,
    });
  }

  private getCompactColNodeWidth(colNode: Node) {
    const { theme, dataSet } = this.spreadsheet;
    const { bolderText: colCellTextStyle } = theme.colCell!;
    const { text: dataCellTextStyle, cell: cellStyle } = theme.dataCell!;
    const data = dataSet.getDisplayDataSet();
    const formatter = dataSet.getFieldFormatter(colNode.field);

    // 采样前 50，找出表身最长的数据
    const maxLabel = maxBy(
      data
        ?.slice(0, LAYOUT_SAMPLE_COUNT)
        .map(
          (data) =>
            `${formatter?.(data[colNode.field]) ?? data[colNode.field]}`,
        ),
      (label) => this.measureTextWidth(label, dataCellTextStyle),
    );

    DebuggerUtil.getInstance().logger(
      'Max Label In Col:',
      colNode.field,
      maxLabel,
    );

    const maxLabelWidth =
      this.measureTextWidth(maxLabel, dataCellTextStyle) +
      cellStyle!.padding!.left! +
      cellStyle!.padding!.right!;

    // 计算表头 label+icon 占用的空间
    const colHeaderNodeWidth =
      this.measureTextWidth(colNode.value, colCellTextStyle) +
      getOccupiedWidthForTableCol(this.spreadsheet, colNode, theme.colCell!);

    return round(Math.max(colHeaderNodeWidth, maxLabelWidth));
  }

  private getColLeafNodesWidth(
    colNode: Node,
    adaptiveColWidth: number,
  ): number {
    const { colCell } = this.spreadsheet.options.style!;
    const layoutWidthType = this.spreadsheet.getLayoutWidthType();
    const cellDraggedWidth = this.getColCellDraggedWidth(colNode);

    // 1. 拖拽后的宽度优先级最高
    if (isNumber(cellDraggedWidth)) {
      return round(cellDraggedWidth);
    }

    // 2. 其次是自定义, 返回 null 则使用默认宽度
    const cellCustomWidth = this.getCellCustomSize(colNode, colCell?.width);

    if (isNumber(cellCustomWidth)) {
      return round(cellCustomWidth);
    }

    // 3. 序号列, 使用配置宽度
    if (colNode.field === SERIES_NUMBER_FIELD) {
      return this.getSeriesNumberWidth();
    }

    // 4. 紧凑模式
    if (layoutWidthType === LayoutWidthType.Compact) {
      return this.getCompactColNodeWidth(colNode);
    }

    // 5. 默认自适应列宽
    return round(adaptiveColWidth);
  }

  public getViewCellHeights() {
    const defaultCellHeight = this.getDefaultCellHeight();

    return {
      getTotalHeight: () => {
        if (this.rowOffsets) {
          return last(this.rowOffsets) || 0;
        }

        return (
          defaultCellHeight *
          this.spreadsheet.dataSet.getDisplayDataSet().length
        );
      },
      getCellOffsetY: (offset: number) => {
        if (offset <= 0) {
          return 0;
        }

        if (this.rowOffsets) {
          return this.rowOffsets[offset];
        }

        return offset * defaultCellHeight;
      },
      getTotalLength: () => this.spreadsheet.dataSet.getDisplayDataSet().length,
      getIndexRange: (minHeight: number, maxHeight: number) => {
        if (this.rowOffsets) {
          return getIndexRangeWithOffsets(
            this.rowOffsets,
            minHeight,
            maxHeight,
          );
        }

        const yMin = floor(minHeight / defaultCellHeight, 0);
        // 防止数组index溢出导致报错
        const yMax =
          maxHeight % defaultCellHeight === 0
            ? maxHeight / defaultCellHeight - 1
            : floor(maxHeight / defaultCellHeight, 0);

        return {
          start: Math.max(0, yMin),
          end: Math.max(0, yMax),
        };
      },
    };
  }

  protected renderRowResizeArea() {
    const { resize } = this.spreadsheet.options.interaction!;

    const shouldDrawResize = isBoolean(resize)
      ? resize
      : (resize as ResizeInteractionOptions)?.rowCellVertical;

    if (!shouldDrawResize) {
      return;
    }

    const rowResizeGroup = this.foregroundGroup.getElementById<Group>(
      KEY_GROUP_ROW_RESIZE_AREA,
    );

    if (rowResizeGroup) {
      rowResizeGroup.removeChildren();
    }

    const cells = getAllChildCells<TableDataCell>(
      this.panelGroup.children as TableDataCell[],
      TableDataCell,
    );

    cells.forEach((cell) => {
      cell.drawResizeArea();
    });
  }

  protected getRowHeader() {
    return null;
  }

  protected getColHeader() {
    if (!this.columnHeader) {
      const { x, width, viewportHeight, viewportWidth } = this.panelBBox;

      return new TableColHeader({
        width,
        height: this.cornerBBox.height,
        viewportWidth,
        viewportHeight,
        cornerWidth: this.cornerBBox.width,
        position: { x, y: 0 },
        nodes: this.getColNodes(),
        sortParam: this.spreadsheet.store.get('sortParam'),
        spreadsheet: this.spreadsheet,
      });
    }

    return this.columnHeader;
  }

  protected getSeriesNumberHeader() {
    return null;
  }

  protected getScrollbarPosition() {
    const { height } = this.getCanvasSize();
    const position = super.getScrollbarPosition();
    // 滚动条有两种模式, 一种是根据实际内容撑开, 一种是根据 Canvas 高度撑开, 现在有空数据占位符, 对于这种, 滚动条需要撑满
    const maxY = this.spreadsheet.dataSet.isEmpty()
      ? height - this.scrollBarSize
      : position.maxY;

    return {
      ...position,
      maxY,
    };
  }

  /**
   * 获取序号单元格
   * @description 明细表序号单元格是基于 DataCell 实现
   */
  public getSeriesNumberCells(): TableSeriesNumberCell[] {
    return this.getDataCells().filter((cell) => {
      return cell.getMeta().valueField === SERIES_NUMBER_FIELD;
    }) as TableSeriesNumberCell[];
  }

  public getContentWidth(): number {
    const { colsHierarchy } = this.layoutResult;

    return round(colsHierarchy.width);
  }

  public getContentHeight(): number {
    const { getTotalHeight } = this.getViewCellHeights();
    const { colsHierarchy } = this.layoutResult;

    return round(
      getTotalHeight() +
        colsHierarchy.height +
        Frame.getHorizontalBorderWidth(this.spreadsheet),
    );
  }
}
