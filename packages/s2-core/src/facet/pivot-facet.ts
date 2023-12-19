import {
  filter,
<<<<<<< HEAD
  find,
=======
>>>>>>> origin/master
  forEach,
  get,
  isArray,
  isEmpty,
  isNil,
  isNumber,
  keys,
  last,
  map,
  maxBy,
  merge,
  reduce,
  size,
  sumBy,
} from 'lodash';
<<<<<<< HEAD
import { ColCell, RowCell, SeriesNumberCell } from '../cell';
=======
import type { Group } from '@antv/g-canvas';
>>>>>>> origin/master
import {
  DEFAULT_TREE_ROW_CELL_WIDTH,
  LAYOUT_SAMPLE_COUNT,
  type IconTheme,
  type MultiData,
<<<<<<< HEAD
  type ViewMeta,
=======
  FrozenGroup,
  KEY_GROUP_FROZEN_SPLIT_LINE,
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  ORIGIN_FIELD,
>>>>>>> origin/master
} from '../common';
import { EXTRA_FIELD, LayoutWidthTypes, VALUE_FIELD } from '../common/constant';
import { CellType } from '../common/constant/interaction';
import { DebuggerUtil } from '../common/debug';
<<<<<<< HEAD
import type { LayoutResult, SimpleData } from '../common/interface';
import type { PivotDataSet } from '../data-set/pivot-data-set';
import type { SpreadSheet } from '../sheet-type';
import { safeJsonParse } from '../utils';
import { getDataCellId } from '../utils/cell/data-cell';
import { getActionIconConfig } from '../utils/cell/header-cell';
import {
  getIndexRangeWithOffsets,
  getSubTotalNodeWidthOrHeightByLevel,
} from '../utils/facet';
import { getCellWidth } from '../utils/text';
import { BaseFacet } from './base-facet';
import { Frame } from './header';
=======
import type {
  LayoutResult,
  S2TableSheetOptions,
  SplitLine,
  ViewMeta,
} from '../common/interface';
import { getDataCellId, handleDataItem } from '../utils/cell/data-cell';
import { getActionIconConfig } from '../utils/cell/header-cell';
import { getIndexRangeWithOffsets } from '../utils/facet';
import { getCellWidth, safeJsonParse } from '../utils/text';
import { getHeaderTotalStatus } from '../utils/dataset/pivot-data-set';
import { getRowsForGrid } from '../utils/grid';
import { renderLine } from '..';
import { FrozenFacet } from './frozen-facet';
>>>>>>> origin/master
import { buildHeaderHierarchy } from './layout/build-header-hierarchy';
import type { Hierarchy } from './layout/hierarchy';
import { layoutCoordinate } from './layout/layout-hooks';
import { Node } from './layout/node';
import { getFrozenRowCfgPivot } from './utils';
import { PivotRowHeader, RowHeader } from './header';

export class PivotFacet extends FrozenFacet {
  protected updateFrozenGroupGrid(): void {
    [FrozenGroup.FROZEN_ROW].forEach((key) => {
      if (!this.frozenGroupInfo[key].range) {
        return;
      }
      let cols = [];
      let rows = [];
      if (key.toLowerCase().includes('row')) {
        const [rowMin, rowMax] = this.frozenGroupInfo[key].range;
        cols = this.gridInfo.cols;
        rows = getRowsForGrid(rowMin, rowMax, this.viewCellHeights);
      }
      this.spreadsheet[`${key}Group`].updateGrid(
        {
          cols,
          rows,
        },
        `${key}Group`,
      );
    });
  }

  protected getBizRevisedFrozenOptions(): S2TableSheetOptions {
    return getFrozenRowCfgPivot(this.cfg, this.layoutResult.rowNodes);
  }

  protected renderFrozenGroupSplitLine = (scrollX: number, scrollY: number) => {
    // remove previous splitline group
    this.foregroundGroup.findById(KEY_GROUP_FROZEN_SPLIT_LINE)?.remove();
    if (this.enableFrozenFirstRow()) {
      // 在分页条件下需要额外处理 Y 轴滚动值
      const relativeScrollY = Math.floor(scrollY - this.getPaginationScrollY());
      const splitLineGroup = this.foregroundGroup.addGroup({
        id: KEY_GROUP_FROZEN_SPLIT_LINE,
        zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
      });
      const style: SplitLine = get(this.cfg, 'spreadsheet.theme.splitLine');
      const horizontalBorderStyle = {
        lineWidth: style?.horizontalBorderWidth,
        stroke: style?.horizontalBorderColor,
        opacity: style?.horizontalBorderColorOpacity,
      };
      const { height: cornerHeight } = this.cornerBBox;

      const cellRange = this.getCellRange();
      const y =
        cornerHeight +
        this.getTotalHeightForRange(cellRange.start, cellRange.start);
      const width =
        this.panelBBox.viewportWidth +
        this.layoutResult.rowsHierarchy.width +
        this.getSeriesNumberWidth();
      renderLine(
        splitLineGroup as Group,
        {
          x1: 0,
          x2: width,
          y1: y,
          y2: y,
        },
        {
          ...horizontalBorderStyle,
        },
      );

      if (style.showShadow && relativeScrollY > 0) {
        splitLineGroup.addShape('rect', {
          attrs: {
            x: 0,
            y,
            width,
            height: style.shadowWidth,
            fill: this.getShadowFill(90),
          },
        });
      }
    }
  };

  protected clip(scrollX: number, scrollY: number): void {
    const { isFrozenRowHeader, frozenRowGroup } = this.spreadsheet;
    if (!isFrozenRowHeader.call(this.spreadsheet)) {
      // adapt: close the entire frozen header.
      // 1. panelScrollGroup clip (default)
      // 2. frozenRowGroup clip
      this.panelScrollGroupClip(scrollX, scrollY);
      if (this.enableFrozenFirstRow()) {
        const paginationScrollY = this.getPaginationScrollY();
        frozenRowGroup.setClip({
          type: 'rect',
          attrs: {
            x: 0,
            y: paginationScrollY,
            width: this.panelBBox.width + scrollX,
            height: frozenRowGroup.getBBox().height,
          },
        });
      }
      return;
    }
    super.clip(scrollX, scrollY);
  }

<<<<<<< HEAD
export class PivotFacet extends BaseFacet {
  public constructor(spreadsheet: SpreadSheet) {
    super(spreadsheet);
  }

=======
>>>>>>> origin/master
  get rowCellTheme() {
    return this.spreadsheet.theme.rowCell!.cell;
  }

  public getContentHeight(): number {
    const { rowsHierarchy, colsHierarchy } = this.layoutResult;
    return rowsHierarchy.height + colsHierarchy.height;
  }

  protected doLayout(): LayoutResult {
    const { rowLeafNodes, colLeafNodes, rowsHierarchy, colsHierarchy } =
      this.buildAllHeaderHierarchy();

    this.calculateHeaderNodesCoordinate({
      rowLeafNodes,
      rowsHierarchy,
      colLeafNodes,
      colsHierarchy,
    } as LayoutResult);

<<<<<<< HEAD
    return {
=======
    const getCellMeta = (rowIndex?: number, colIndex?: number): ViewMeta => {
      const i = rowIndex || 0;
      const j = colIndex || 0;
      const row = rowLeafNodes[i];
      const col = colLeafNodes[j];
      if (!row || !col) {
        return null;
      }
      const rowQuery = row.query;
      const colQuery = col.query;
      const isTotals =
        row.isTotals ||
        row.isTotalMeasure ||
        col.isTotals ||
        col.isTotalMeasure;
      const { hierarchyType } = spreadsheet.options;
      const hideMeasure =
        get(spreadsheet, 'facet.cfg.colCfg.hideMeasureColumn') ?? false;
      // 如果在非自定义目录情况下hide measure query中是没有度量信息的，所以需要自动补上
      // 存在一个场景的冲突，如果是多个度量，定位数据数据是无法知道哪一列代表什么
      // 因此默认只会去 第一个度量拼接query
      const measureInfo =
        hideMeasure && hierarchyType !== 'customTree'
          ? {
              [EXTRA_FIELD]: dataSet.fields.values?.[0],
            }
          : {};
      const dataQuery = merge({}, rowQuery, colQuery, measureInfo);
      const totalStatus = getHeaderTotalStatus(row, col);
      const data = dataSet.getCellData({
        query: dataQuery,
        rowNode: row,
        isTotals,
        totalStatus,
      });

      const valueField: string = dataQuery[EXTRA_FIELD];
      const fieldValue = get(data, VALUE_FIELD, null);

      return {
        spreadsheet,
        x: col.x,
        y: row.y,
        width: col.width,
        height: row.height,
        data,
        rowIndex: i,
        colIndex: j,
        isTotals,
        valueField,
        fieldValue,
        rowQuery,
        colQuery,
        rowId: row.id,
        colId: col.id,
        id: getDataCellId(row.id, col.id),
      } as ViewMeta;
    };

    const layoutResult: LayoutResult = {
>>>>>>> origin/master
      colNodes: colsHierarchy.getNodes(),
      colsHierarchy,
      rowNodes: rowsHierarchy.getNodes(),
      rowsHierarchy,
      rowLeafNodes,
      colLeafNodes,
    };
  }

  private buildAllHeaderHierarchy() {
    const { leafNodes: rowLeafNodes, hierarchy: rowsHierarchy } =
      buildHeaderHierarchy({
        isRowHeader: true,
        spreadsheet: this.spreadsheet,
      });
    const { leafNodes: colLeafNodes, hierarchy: colsHierarchy } =
      buildHeaderHierarchy({
        isRowHeader: false,
        spreadsheet: this.spreadsheet,
      });

    return {
      rowLeafNodes,
      colLeafNodes,
      rowsHierarchy,
      colsHierarchy,
    };
  }

  /**
   * 根据行列索引获取单元格元数据
   */
  public getCellMeta = (rowIndex = 0, colIndex = 0) => {
    const { options, dataSet } = this.spreadsheet;
    const { rowLeafNodes, colLeafNodes } = this.getLayoutResult();
    const row = rowLeafNodes[rowIndex];
    const col = colLeafNodes[colIndex];

    if (!row || !col) {
      return null;
    }

    const rowQuery = row.query;
    const colQuery = col.query;
    const isTotals =
      row.isTotals || row.isTotalMeasure || col.isTotals || col.isTotalMeasure;

    const hideMeasure = options.style?.colCell?.hideValue ?? false;

    /*
     * 如果在非自定义目录情况下hide measure query中是没有度量信息的，所以需要自动补上
     * 存在一个场景的冲突，如果是多个度量，定位数据数据是无法知道哪一列代表什么
     * 因此默认只会去 第一个度量拼接query
     */
    const measureInfo = hideMeasure
      ? {
          [EXTRA_FIELD]: dataSet.fields.values?.[0],
        }
      : {};
    const dataQuery = merge({}, rowQuery, colQuery, measureInfo);
    const data = dataSet.getCellData({
      query: dataQuery,
      rowNode: row,
      isTotals,
    });

    const valueField = dataQuery[EXTRA_FIELD]!;
    const fieldValue = get(data, VALUE_FIELD, null);

    const cellMeta: ViewMeta = {
      spreadsheet: this.spreadsheet,
      x: col.x,
      y: row.y,
      width: col.width,
      height: row.height,
      data,
      rowIndex,
      colIndex,
      isTotals,
      valueField,
      fieldValue,
      rowQuery,
      colQuery,
      rowId: row.id,
      colId: col.id,
      id: getDataCellId(row.id, col.id),
    };

    return options.layoutCellMeta?.(cellMeta) ?? cellMeta;
  };

  private getPreLevelSampleNode(colNode: Node, colsHierarchy: Hierarchy) {
    // 之前是采样每一级第一个节点, 现在 sampleNodesForAllLevels 是采样每一级高度最大的节点
    // 但是初始化布局时只有第一个节点有值, 所以这里需要适配下
    return colsHierarchy
      .getNodes(colNode.level - 1)
      .find((node) => !node.isTotals);
  }

  private calculateHeaderNodesCoordinate(layoutResult: LayoutResult) {
    this.calculateRowNodesCoordinate(layoutResult);
    this.calculateColNodesCoordinate(layoutResult);
  }

  /**
   * Calculate all col header related coordinate
   * height, width, x, y
   * colsHierarchy's height
   * colsHierarchy's width
   */
  private calculateColNodesCoordinate(layoutResult: LayoutResult) {
    const { rowLeafNodes, colLeafNodes, rowsHierarchy, colsHierarchy } =
      layoutResult;

    this.updateColsHierarchySampleMaxHeightNodes(colsHierarchy);

    let preLeafNode = Node.blankNode();
<<<<<<< HEAD
    let currentColIndex = 0;

    const colNodes = colsHierarchy.getNodes();

    colNodes.forEach((currentNode) => {
=======
    const allNodes = colsHierarchy.getNodes();
    const sampleNodesForAllLevels = colsHierarchy.sampleNodesForAllLevels;
    for (let level = 0; level < sampleNodesForAllLevels.length; level++) {
      const levelSample = sampleNodesForAllLevels[level];
      levelSample.height = this.getColNodeHeight(levelSample);
      colsHierarchy.height += levelSample.height;
      if (levelSample.level === 0) {
        levelSample.y = 0;
      } else {
        const preLevelSample = sampleNodesForAllLevels[level - 1];
        levelSample.y = preLevelSample?.y + preLevelSample?.height ?? 0;
      }
    }
    let currentCollIndex = 0;
    for (let i = 0; i < allNodes.length; i++) {
      const currentNode = allNodes[i];
>>>>>>> origin/master
      if (currentNode.isLeaf) {
        currentNode.colIndex = currentColIndex;
        currentColIndex += 1;
        currentNode.x = preLeafNode.x + preLeafNode.width;
        currentNode.width = this.calculateColLeafNodesWidth(
          currentNode,
          colLeafNodes,
          rowLeafNodes,
          rowsHierarchy.width,
        );
        colsHierarchy.width += currentNode.width;
        preLeafNode = currentNode;
      }

      if (currentNode.level === 0) {
        currentNode.y = 0;
      } else {
        const preLevelSample = this.getPreLevelSampleNode(
          currentNode,
          colsHierarchy,
        );

        currentNode.y = preLevelSample?.y! + preLevelSample?.height! ?? 0;
      }
<<<<<<< HEAD

      // 数值置于行头时, 列头的总计即叶子节点, 此时应该用列高: https://github.com/antvis/S2/issues/1715
      const colNodeHeight = this.getColNodeHeight(currentNode, colsHierarchy);

      currentNode.height =
        currentNode.isGrandTotals && currentNode.isLeaf
          ? colsHierarchy.height
          : colNodeHeight;

      layoutCoordinate(this.spreadsheet, null, currentNode);
    });

    this.updateCustomFieldsSampleNodes(colsHierarchy);
    this.adjustColLeafNodesHeight({
      leafNodes: colLeafNodes,
      hierarchy: colsHierarchy,
    });
=======
      currentNode.height = this.getColNodeHeight(currentNode);
      layoutCoordinate(this.cfg, null, currentNode);
    }
>>>>>>> origin/master
    this.autoCalculateColNodeWidthAndX(colLeafNodes);

    if (!isEmpty(this.spreadsheet.options.totals?.col)) {
<<<<<<< HEAD
      this.adjustGrandTotalNodesCoordinate(colsHierarchy);
      this.adjustSubTotalNodesCoordinate(colsHierarchy);
=======
      this.adjustTotalNodesCoordinate({
        hierarchy: colsHierarchy,
        isRowHeader: false,
        isSubTotal: true,
      });
      this.adjustTotalNodesCoordinate({
        hierarchy: colsHierarchy,
        isRowHeader: false,
        isSubTotal: false,
      });
>>>>>>> origin/master
    }
  }

  /**
   * Auto Auto Auto column no-leaf node's width and x coordinate
   * @param colLeafNodes
   */
  private autoCalculateColNodeWidthAndX(colLeafNodes: Node[]) {
<<<<<<< HEAD
    let prevColParent: Node | null = null;
    const leafNodes = colLeafNodes.slice(0);

    while (leafNodes.length) {
      const node = leafNodes.shift();
      const parentNode = node?.parent;

=======
    let prevColParent: Node = null;
    let i = 0;
    const leafNodes = colLeafNodes.slice(0);

    while (i < leafNodes.length) {
      const node = leafNodes[i++];
      const parentNode = node.parent;
>>>>>>> origin/master
      if (prevColParent !== parentNode && parentNode) {
        leafNodes.push(parentNode);

        const firstVisibleChildNode = parentNode.children?.find(
          (childNode) => childNode.width,
        );
<<<<<<< HEAD
        // 父节点 x 坐标 = 第一个未隐藏的子节点的 x 坐标
        const parentNodeX = firstVisibleChildNode?.x ?? 0;
=======
        // 父节点 x 坐标 = 第一个正常布局处理过的子节点 x 坐标(width 有值认为是正常布局过)
        const parentNodeX = firstVisibleChildNode?.x;
>>>>>>> origin/master
        // 父节点宽度 = 所有子节点宽度之和
        const parentNodeWidth = sumBy(parentNode.children, 'width');

        parentNode.x = parentNodeX;
        parentNode.width = parentNodeWidth;

        prevColParent = parentNode;
      }
    }
  }

  private calculateColLeafNodesWidth(
    col: Node,
    colLeafNodes: Node[],
    rowLeafNodes: Node[],
    rowHeaderWidth: number,
  ): number {
    const { colCell } = this.spreadsheet.options.style!;

    const cellDraggedWidth = this.getColCellDraggedWidth(col);

    // 1. 拖拽后的宽度优先级最高
    if (isNumber(cellDraggedWidth)) {
      return cellDraggedWidth;
    }

    // 2. 其次是自定义, 返回 null 则使用默认宽度
    const cellCustomWidth = this.getCellCustomSize(col, colCell?.width!);

    if (isNumber(cellCustomWidth)) {
      return cellCustomWidth;
    }

    // 3. 紧凑布局
    if (this.spreadsheet.getLayoutWidthType() === LayoutWidthTypes.Compact) {
      const {
        bolderText: colCellTextStyle,
        cell: colCellStyle,
        icon: colIconStyle,
<<<<<<< HEAD
      } = this.spreadsheet.theme.colCell!;
=======
      } = this.spreadsheet.theme.colCell;
      const { text: dataCellTextStyle } = this.spreadsheet.theme.dataCell;
>>>>>>> origin/master

      // leaf node rough width
      const cellFormatter = this.spreadsheet.dataSet.getFieldFormatter(
        col.field,
      );
      const leafNodeLabel = cellFormatter?.(col.value) ?? col.value;
      const iconWidth = this.getExpectedCellIconWidth(
        CellType.COL_CELL,
        this.spreadsheet.isValueInCols() &&
          this.spreadsheet.options.showDefaultHeaderActionIcon!,
        colIconStyle!,
      );
      const leafNodeRoughWidth =
        this.spreadsheet.measureTextWidthRoughly(
          leafNodeLabel,
          colCellTextStyle,
        ) + iconWidth;

      // 采样 50 个 label，逐个计算找出最长的 label
      let maxDataLabel = '';
      let maxDataLabelWidth = 0;

      for (let index = 0; index < LAYOUT_SAMPLE_COUNT; index++) {
        const rowNode = rowLeafNodes[index];

        if (rowNode) {
          const cellData = (
            this.spreadsheet.dataSet as PivotDataSet
          ).getCellData({
            query: { ...col.query, ...rowNode.query },
            rowNode,
            isTotals:
              col.isTotals ||
              col.isTotalMeasure ||
              rowNode.isTotals ||
              rowNode.isTotalMeasure,
            totalStatus: getHeaderTotalStatus(rowNode, col),
          });

          if (cellData) {
            // 总小计格子不一定有数据
            const valueData = cellData?.[VALUE_FIELD];
            const formattedValue =
              this.spreadsheet.dataSet.getFieldFormatter(
                cellData[EXTRA_FIELD],
              )?.(valueData) ?? valueData;
            const cellLabel = `${formattedValue}`;
            const cellLabelWidth = this.spreadsheet.measureTextWidthRoughly(
              cellLabel,
              dataCellTextStyle,
            );

            if (cellLabelWidth > maxDataLabelWidth) {
              maxDataLabel = cellLabel;
              maxDataLabelWidth = cellLabelWidth;
            }
          }
        }
      }

      const isLeafNodeWidthLonger = leafNodeRoughWidth > maxDataLabelWidth;
      const maxLabel = isLeafNodeWidthLonger ? leafNodeLabel : maxDataLabel;
      const appendedWidth = isLeafNodeWidthLonger ? iconWidth : 0;

      DebuggerUtil.getInstance().logger(
        'Max Label In Col:',
        col.field,
        maxLabel,
        maxDataLabelWidth,
      );

      // 取列头/数值字体最大的文本宽度 https://github.com/antvis/S2/issues/2385
      const maxTextWidth = this.spreadsheet.measureTextWidth(maxLabel, {
        ...colCellTextStyle,
        fontSize: Math.max(
          dataCellTextStyle.fontSize,
          colCellTextStyle.fontSize,
        ),
      });

      return (
<<<<<<< HEAD
        this.spreadsheet.measureTextWidth(maxLabel, colCellTextStyle) +
        colCellStyle!.padding!.left! +
        colCellStyle!.padding!.right! +
        colCellStyle!.verticalBorderWidth! * 2 +
=======
        maxTextWidth +
        colCellStyle.padding?.left +
        colCellStyle.padding?.right +
>>>>>>> origin/master
        appendedWidth
      );
    }

    /**
     * 4. 自适应 adaptive
     * 4.1 树状自定义
     */
    if (this.spreadsheet.isHierarchyTreeType()) {
      return this.getAdaptTreeColWidth(col, colLeafNodes, rowLeafNodes);
    }

    // 4.2 网格自定义
    return this.getAdaptGridColWidth(colLeafNodes, rowHeaderWidth);
  }

<<<<<<< HEAD
  private getRowNodeHeight(rowNode: Node): number {
    const rowCell = new RowCell(rowNode, this.spreadsheet, {
      shallowRender: true,
    });
    const defaultHeight = this.getRowCellHeight(rowNode);

    return this.getCellAdaptiveHeight(rowCell, defaultHeight);
  }

  protected getColNodeHeight(colNode: Node, colsHierarchy: Hierarchy): number {
    if (!colNode) {
      return 0;
    }

    const colCell = new ColCell(colNode, this.spreadsheet, {
      shallowRender: true,
    });

    const defaultHeight = this.getDefaultColNodeHeight(colNode, colsHierarchy);

    return this.getCellAdaptiveHeight(colCell, defaultHeight);
=======
  private getColNodeHeight(col: Node) {
    const { colCfg } = this.cfg;
    const userDraggedHeight = get(colCfg, ['heightByField', col.key]);
    return userDraggedHeight ?? colCfg?.height;
>>>>>>> origin/master
  }

  /**
   * 获得图标区域预估宽度
   * 不考虑用户自定义的 displayCondition 条件
   * @param iconStyle 图标样式
   * @returns 宽度
   */
  private getExpectedCellIconWidth(
    cellType: CellType,
    useDefaultIcon: boolean,
    iconStyle: IconTheme,
  ): number {
    // count icons
    let iconCount = 0;

    if (useDefaultIcon) {
      iconCount = 1;
    } else {
      const actionIcons = map(
        this.spreadsheet.options.headerActionIcons,
        (iconCfg) => {
          return {
            ...iconCfg,
            // ignore condition func when layout calc
            displayCondition: () => true,
          };
        },
      );
      const customIcons = getActionIconConfig(
        actionIcons,
        null as unknown as Node,
        cellType,
      );

      iconCount = customIcons?.icons.length ?? 0;
    }

    // calc width
    return iconCount
      ? iconCount * (iconStyle.size! + iconStyle.margin?.left!) +
          iconStyle.margin?.right!
      : 0;
  }

  /**
   * Calculate all row header related coordinate
   * height, width, x, y
   * rowHierarchy's height
   * rowHierarchy's width
   */
  private calculateRowNodesCoordinate(layoutResult: LayoutResult) {
    const { rowsHierarchy, rowLeafNodes, colLeafNodes } = layoutResult;
    const isTree = this.spreadsheet.isHierarchyTreeType();

    const sampleNodeByLevel = rowsHierarchy.sampleNodesForAllLevels || [];

    // 1、calculate first node's width in every level
    if (isTree) {
      rowsHierarchy.width = this.getTreeRowHeaderWidth();
    } else {
      sampleNodeByLevel.forEach((levelSample) => {
        levelSample.width = this.calculateGridRowNodesWidth(
          levelSample,
          colLeafNodes,
        );
        rowsHierarchy.width += levelSample.width;
        const preLevelSample = sampleNodeByLevel[levelSample.level - 1] ?? {
          x: 0,
          width: 0,
        };

        levelSample.x = preLevelSample?.x + preLevelSample?.width;
      });
    }

    // 2、calculate node's height & y（leaf nodes）, x-coordinate & width(all nodes), height & y (not-leaf),
    let preLeafNode = Node.blankNode();
    const allNodes = rowsHierarchy.getNodes();

    for (let i = 0; i < allNodes.length; i++) {
      const currentNode = allNodes[i];
      // in tree type, all nodes treat as leaf
      const isLeaf = isTree || (!isTree && currentNode.isLeaf);

      if (isLeaf) {
        // 1. 普通树状结构, 叶子节点各占一行, 2. 自定义树状结构 (平铺模式)
        const rowIndex = (preLeafNode?.rowIndex ?? -1) + 1;
        const nodeHeight = this.getRowNodeHeight(currentNode);

        currentNode.rowIndex ??= rowIndex;
        currentNode.colIndex ??= i;
        currentNode.y = preLeafNode.y + preLeafNode.height;
        currentNode.height = nodeHeight;
        preLeafNode = currentNode;
        // mark row hierarchy's height
        rowsHierarchy.height += currentNode.height;
      }

      // calc node.x
      if (isTree || currentNode.level === 0) {
        currentNode.x = 0;
      } else {
        const preLevelSample = sampleNodeByLevel[currentNode.level - 1];

        currentNode.x = preLevelSample?.x + preLevelSample?.width;
      }

      // calc node.width
      if (isTree) {
        currentNode.width = this.getTreeRowHeaderWidth();
      } else {
        // same level -> same width
        const levelSampleNode = sampleNodeByLevel[currentNode.level];

        currentNode.width = levelSampleNode?.width;
      }

      layoutCoordinate(this.spreadsheet, currentNode, null);
    }
    if (!isTree) {
      this.adjustRowLeafNodesWidth({
        leafNodes: rowLeafNodes,
        hierarchy: rowsHierarchy,
      });
      this.autoCalculateRowNodeHeightAndY(rowLeafNodes);
<<<<<<< HEAD
      if (!isEmpty(this.spreadsheet.options.totals?.row)) {
        this.adjustGrandTotalNodesCoordinate(rowsHierarchy, true);
        this.adjustSubTotalNodesCoordinate(rowsHierarchy, true);
=======
      if (!isEmpty(spreadsheet.options.totals?.row)) {
        this.adjustTotalNodesCoordinate({
          hierarchy: rowsHierarchy,
          isRowHeader: true,
          isSubTotal: false,
        });
        this.adjustTotalNodesCoordinate({
          hierarchy: rowsHierarchy,
          isRowHeader: true,
          isSubTotal: true,
        });
>>>>>>> origin/master
      }
    }
  }

  /**
   * @description Auto calculate row no-leaf node's height and y coordinate
   * @param rowLeafNodes
   */
  private autoCalculateRowNodeHeightAndY(rowLeafNodes: Node[]) {
    let prevRowParent = null;
    let i = 0;
    const leafNodes = rowLeafNodes.slice(0);
<<<<<<< HEAD

    while (leafNodes.length) {
      const node = leafNodes.shift();
      const parent = node?.parent;

=======
    while (i < leafNodes.length) {
      const node = leafNodes[i++];
      const parent = node.parent;
>>>>>>> origin/master
      if (prevRowParent !== parent && parent) {
        leafNodes.push(parent);
        // parent's y = first child's y
        parent.y = parent.children[0].y;
        // parent's height = all children's height
        parent.height = parent.children.reduce(
          (sum, current) => sum + current.height,
          0,
        );
        prevRowParent = parent;
      }
    }
  }

<<<<<<< HEAD
  /**
   * @description adjust the coordinate of total nodes and their children
   * @param hierarchy Hierarchy
   * @param isRowHeader boolean
   */
  private adjustGrandTotalNodesCoordinate(
=======
  // please read README-adjustTotalNodesCoordinate.md to understand this function
  private getMultipleMap(
>>>>>>> origin/master
    hierarchy: Hierarchy,
    isRowHeader?: boolean,
    isSubTotal?: boolean,
  ) {
<<<<<<< HEAD
    const moreThanOneValue = this.spreadsheet.dataSet.moreThanOneValue();
    const { maxLevel } = hierarchy;
    const grandTotalNode = find(
      hierarchy.getNodes(0),
      (node: Node) => node.isGrandTotals,
    );

    if (!(grandTotalNode instanceof Node)) {
      return;
    }

    const grandTotalChildren = grandTotalNode.children;

    // 总计节点层级 (有且有两级)
    if (isRowHeader) {
      // 填充行总单元格宽度
      grandTotalNode.width = hierarchy.width;
      // 调整其叶子节点位置和宽度
      forEach(grandTotalChildren, (node: Node) => {
        const maxLevelNode = hierarchy.getNodes(maxLevel)[0];

        node.x = maxLevelNode.x;
        node.width = maxLevelNode.width;
      });
    } else if (maxLevel > 1 || (maxLevel <= 1 && !moreThanOneValue)) {
      /*
       * 只有当列头总层级大于1级或列头为1级单指标时总计格高度才需要填充
       * 填充列总计单元格高度
       */
      const grandTotalChildrenHeight = grandTotalChildren?.[0]?.height ?? 0;

      grandTotalNode.height = hierarchy.height - grandTotalChildrenHeight;
      // 调整其叶子节点位置, 以非小计行为准
      const positionY =
        find(hierarchy.getNodes(maxLevel), (node: Node) => !node.isTotalMeasure)
          ?.y || 0;

      forEach(grandTotalChildren, (node: Node) => {
        node.y = positionY;
      });
=======
    const { maxLevel } = hierarchy;
    const { totals, dataSet } = this.cfg;
    const moreThanOneValue = dataSet.moreThanOneValue();
    const { rows, columns } = dataSet.fields;
    const fields = isRowHeader ? rows : columns;
    const totalConfig = isRowHeader ? totals.row : totals.col;
    const dimensionGroup = isSubTotal
      ? totalConfig.subTotalsGroupDimensions || []
      : totalConfig.totalsGroupDimensions || [];
    const multipleMap: number[] = Array.from({ length: maxLevel + 1 }, () => 1);
    for (let level = maxLevel; level > 0; level--) {
      const currentField = fields[level] as string;
      // 若不符合【分组维度包含此维度】或【者指标维度下非单指标维度】，此表头单元格为空，将宽高合并到上级单元格
      const existValueField = currentField === EXTRA_FIELD && moreThanOneValue;
      if (!(dimensionGroup.includes(currentField) || existValueField)) {
        multipleMap[level - 1] += multipleMap[level];
        multipleMap[level] = 0;
      }
>>>>>>> origin/master
    }
    return multipleMap;
  }

<<<<<<< HEAD
  /**
   * @description adust the coordinate of subTotal nodes when there is just one value
   * @param hierarchy Hierarchy
   * @param isRowHeader boolean
   */
  private adjustSubTotalNodesCoordinate(
    hierarchy: Hierarchy,
    isRowHeader?: boolean,
  ) {
    const subTotalNodes = hierarchy
      .getNodes()
      .filter((node) => node.isSubTotals);

    if (isEmpty(subTotalNodes)) {
      return;
    }

    const { maxLevel } = hierarchy;

    forEach(subTotalNodes, (subTotalNode: Node) => {
      const subTotalChildNode = subTotalNode.children;

      if (isRowHeader) {
        // 填充行总单元格宽度
        subTotalNode.width = getSubTotalNodeWidthOrHeightByLevel(
          hierarchy.sampleNodesForAllLevels,
          subTotalNode.level,
          'width',
        );

        // 调整其叶子节点位置
        forEach(subTotalChildNode, (node: Node) => {
          node.x = hierarchy.getNodes(maxLevel)[0].x;
        });
      } else {
        // 填充列总单元格高度
        const totalHeight = getSubTotalNodeWidthOrHeightByLevel(
          hierarchy.sampleNodesForAllLevels,
          subTotalNode.level,
          'height',
        );
        const subTotalNodeChildrenHeight = subTotalChildNode?.[0]?.height ?? 0;

        subTotalNode.height = totalHeight - subTotalNodeChildrenHeight;
        // 调整其叶子节点位置, 以非小计行为准
        const positionY =
          find(
            hierarchy.getNodes(maxLevel),
            (node: Node) => !node.isTotalMeasure,
          )?.y || 0;

        forEach(subTotalChildNode, (node: Node) => {
          node.y = positionY;
        });
=======
  // please read README-adjustTotalNodesCoordinate.md to understand this function
  private adjustTotalNodesCoordinate(params: {
    hierarchy: Hierarchy;
    isRowHeader?: boolean;
    isSubTotal?: boolean;
  }) {
    const { hierarchy, isRowHeader, isSubTotal } = params;
    const multipleMap = this.getMultipleMap(hierarchy, isRowHeader, isSubTotal);
    const totalNodes = filter(hierarchy.getNodes(), (node: Node) =>
      isSubTotal ? node.isSubTotals : node.isGrandTotals,
    );
    const key = isRowHeader ? 'width' : 'height';
    forEach(totalNodes, (node: Node) => {
      let multiple = multipleMap[node.level];
      // 小计根节点若为 0，则改为最近上级倍数 - level 差
      if (!multiple && isSubTotal) {
        let lowerLevelIndex = 1;
        while (multiple < 1) {
          multiple =
            multipleMap[node.level - lowerLevelIndex] - lowerLevelIndex;
          lowerLevelIndex++;
        }
>>>>>>> origin/master
      }
      let res = 0;
      for (let i = 0; i < multiple; i++) {
        res += hierarchy.sampleNodesForAllLevels.find(
          (sampleNode) => sampleNode.level === node.level + i,
        )[key];
      }
      node[key] = res;
    });
  }

  /**
   * 计算 grid 模式下 node 宽度
   * @param node
   * @returns
   */
  private calculateGridRowNodesWidth(node: Node, colLeafNodes: Node[]): number {
    const { rowCell } = this.spreadsheet.options.style!;

<<<<<<< HEAD
    const cellDraggedWidth = this.getRowCellDraggedWidth(node);
=======
    const cellDraggedWidth = get(rowCfg, ['widthByField', node.key]);
>>>>>>> origin/master

    if (isNumber(cellDraggedWidth)) {
      return cellDraggedWidth;
    }

    const cellCustomWidth = this.getCellCustomSize(node, rowCell?.width!);

    if (isNumber(cellCustomWidth)) {
      return cellCustomWidth;
    }

    if (this.spreadsheet.getLayoutWidthType() !== LayoutWidthTypes.Adaptive) {
      // compact or colAdaptive
      return this.getCompactGridRowWidth(node);
    }

    // adaptive
    return this.getAdaptGridColWidth(colLeafNodes);
  }

  /**
   *  计算树状模式等宽条件下的列宽
   * @returns number
   */
  private getAdaptTreeColWidth(
    col: Node,
    colLeafNodes: Node[],
    rowLeafNodes: Node[],
  ): number {
    // tree row width = [config width, canvas / 2]
    const canvasW = this.getCanvasSize().width;
    const availableWidth =
      canvasW -
      this.getSeriesNumberWidth() -
      Frame.getVerticalBorderWidth(this.spreadsheet);
    const rowHeaderWidth = Math.min(
      availableWidth / 2,
      this.getTreeRowHeaderWidth(),
    );
    // calculate col width
    const colSize = Math.max(1, colLeafNodes.length);
    const { dataCell } = this.spreadsheet.options.style!;

    return Math.max(
      getCellWidth(dataCell!, this.getColLabelLength(col, rowLeafNodes)),
      Math.floor((availableWidth - rowHeaderWidth) / colSize),
    );
  }

  private getColLabelLength(col: Node, rowLeafNodes: Node[]) {
    // 如果 label 字段形如 "["xx","xxx"]"，直接获取其长度
    const labels = safeJsonParse<string[]>(col?.value);

    if (isArray(labels)) {
      return labels.length;
    }

    // 采样前 50，根据指标个数获取单元格列宽
    let maxLength = 1;

    for (let index = 0; index < LAYOUT_SAMPLE_COUNT; index++) {
      const rowNode = rowLeafNodes[index];

      if (!rowNode) {
        // 抽样个数大于叶子节点个数
        return maxLength;
      }

      const cellData = this.spreadsheet.dataSet.getCellData({
        query: {
          ...col.query,
          ...rowNode.query,
        },
        rowNode,
        isTotals:
          col.isTotals ||
          col.isTotalMeasure ||
          rowNode.isTotals ||
          rowNode.isTotalMeasure,
        totalStatus: getHeaderTotalStatus(rowNode, col),
      });

<<<<<<< HEAD
      const cellDataKeys = keys(cellData);
=======
      const cellDataKeys = keys(cellData?.[ORIGIN_FIELD]);
      for (let j = 0; j < cellDataKeys.length; j++) {
        const dataValue: MultiData = cellData[cellDataKeys[j]];
>>>>>>> origin/master

      for (let j = 0; j < cellDataKeys.length; j++) {
        const dataValue: MultiData = get(cellData, cellDataKeys[j]);

        const valueSize = size(get(dataValue?.values as SimpleData[][], '0'));

        if (valueSize > maxLength) {
          // greater length
          maxLength = valueSize;
        }
      }
    }

    return maxLength;
  }

  /**
   *  计算平铺模式等宽条件下的列宽
   * @returns number
   */
  private getAdaptGridColWidth(colLeafNodes: Node[], rowHeaderWidth?: number) {
    const { rows = [] } = this.spreadsheet.dataSet.fields;
    const { dataCell } = this.spreadsheet.options.style!;
    const rowHeaderColSize = rows.length;
    const colHeaderColSize = colLeafNodes.length;
    const { width } = this.getCanvasSize();
    const availableWidth =
      width -
      this.getSeriesNumberWidth() -
      Frame.getVerticalBorderWidth(this.spreadsheet);

    const colSize = Math.max(1, rowHeaderColSize + colHeaderColSize);

    if (!rowHeaderWidth) {
      return Math.max(
        getCellWidth(dataCell!),
        Math.floor(availableWidth / colSize),
      );
    }

    return Math.max(
      getCellWidth(dataCell!),
      Math.floor((availableWidth - rowHeaderWidth) / colHeaderColSize),
    );
  }

  /**
   * 计算树状结构行头宽度
   * @returns number
   */
  private getTreeRowHeaderWidth(): number {
    const { rowCell } = this.spreadsheet.options.style!;
    const { rows = [] } = this.spreadsheet.dataSet.fields;

    // 1. 用户拖拽或手动指定的行头宽度优先级最高
    const customRowWidth = this.getCellCustomSize(null, rowCell?.width!);

    if (!isNil(customRowWidth)) {
      return customRowWidth;
    }

    // 2. 然后是计算 (+ icon province/city/level)
    const treeHeaderLabel = rows
      .map((field) => this.spreadsheet.dataSet.getFieldName(field))
      .join('/');

    const { bolderText: cornerCellTextStyle, icon: cornerIconStyle } =
<<<<<<< HEAD
      this.spreadsheet.theme.cornerCell!;

    // 初始化角头时，保证其在树形模式下不换行，给与两个icon的宽度空余（tree icon 和 action icon），减少复杂的 action icon 判断
=======
      this.spreadsheet.theme.cornerCell;
    // 初始化角头时，保证其在树形模式下不换行
    // 给与两个icon的宽度空余（tree icon 和 action icon），减少复杂的 action icon 判断
    // 额外增加 1，当内容和容器宽度恰好相等时会出现换行
>>>>>>> origin/master
    const maxLabelWidth =
      1 +
      this.spreadsheet.measureTextWidth(treeHeaderLabel, cornerCellTextStyle) +
      cornerIconStyle!.size! * 2 +
      cornerIconStyle!.margin!.left! +
      cornerIconStyle!.margin!.right! +
      this.rowCellTheme?.padding?.left! +
      this.rowCellTheme?.padding?.right!;

    return Math.max(DEFAULT_TREE_ROW_CELL_WIDTH, maxLabelWidth);
  }

  /**
   * 计算 compact 模式下 node 宽度
   *
   * |   fieldName  |
   *  _______________
   * | label - icon  | <- node
   * | label - icon  |
   * | label - icon  |
   *
   * @param node 目标节点
   * @returns 宽度
   */
  private getCompactGridRowWidth(node: Node): number {
    const {
      bolderText: rowTextStyle,
      icon: rowIconStyle,
      cell: rowCellStyle,
    } = this.spreadsheet.theme.rowCell!;
    const {
      bolderText: cornerTextStyle,
      icon: cornerIconStyle,
      cell: cornerCellStyle,
    } = this.spreadsheet.theme.cornerCell!;
    const { field, isLeaf } = node;

    // calc rowNode width
    const rowIconWidth = this.getExpectedCellIconWidth(
      CellType.ROW_CELL,
      !this.spreadsheet.isValueInCols() &&
        isLeaf &&
        this.spreadsheet.options.showDefaultHeaderActionIcon!,
      rowIconStyle!,
    );
    const allLabels = this.spreadsheet.dataSet
      .getDimensionValues(field)
      ?.slice(0, LAYOUT_SAMPLE_COUNT)
      .map(
        (dimValue) =>
          this.spreadsheet.dataSet.getFieldFormatter(field)?.(dimValue) ??
          dimValue,
      );
    const maxLabel = maxBy(allLabels, (label) => `${label}`.length);
    const rowNodeWidth =
      this.spreadsheet.measureTextWidth(maxLabel, rowTextStyle) +
      rowIconWidth +
      rowCellStyle!.padding!.left! +
      rowCellStyle!.padding!.right! +
      rowCellStyle!.verticalBorderWidth!;

    // calc corner fieldNameNodeWidth
    const fieldName = this.spreadsheet.dataSet.getFieldName(field);
    const cornerIconWidth = this.getExpectedCellIconWidth(
      CellType.CORNER_CELL,
      false,
      cornerIconStyle!,
    );
    const fieldNameNodeWidth =
      this.spreadsheet.measureTextWidth(fieldName, cornerTextStyle) +
      cornerIconWidth +
      cornerCellStyle!.padding!.left! +
      cornerCellStyle!.padding!.right!;

    DebuggerUtil.getInstance().logger(
      'Max Label In Row:',
      field,
      rowNodeWidth > fieldNameNodeWidth ? maxLabel : fieldName,
    );

    return Math.max(rowNodeWidth, fieldNameNodeWidth);
  }

  public getViewCellHeights() {
    const rowLeafNodes = this.getRowLeafNodes();

    const heights = reduce(
      rowLeafNodes,
      (result: number[], node: Node) => {
        const currentNodeHeight = last(result) || 0;

        result.push(currentNodeHeight + node.height);

        return result;
      },
      [0],
    );

    return {
      getTotalHeight: () => last(heights) || 0,
      getCellOffsetY: (index: number) => heights[index],
      // 多了一个数据 [0]
      getTotalLength: () => heights.length - 1,
      getIndexRange: (minHeight: number, maxHeight: number) =>
        getIndexRangeWithOffsets(heights, minHeight, maxHeight),
    };
  }

<<<<<<< HEAD
  /**
   * 获取序号单元格
   * @description 对于透视表, 序号属于 RowCell
   */
  public getSeriesNumberCells(): SeriesNumberCell[] {
    return filter(
      this.getSeriesNumberHeader()?.children,
      (element: SeriesNumberCell) => element instanceof SeriesNumberCell,
    ) as unknown[] as SeriesNumberCell[];
=======
  protected getRowHeader(): RowHeader {
    if (!this.rowHeader) {
      const { viewportHeight, ...otherProps } = this.getRowHeaderCfg();
      const { frozenRowHeight } = getFrozenRowCfgPivot(
        this.cfg,
        this.layoutResult.rowNodes,
      );
      return new PivotRowHeader({
        ...otherProps,
        viewportHeight: viewportHeight - frozenRowHeight,
      });
    }
  }

  public enableFrozenFirstRow(): boolean {
    return !!this.getBizRevisedFrozenOptions().frozenRowCount;
>>>>>>> origin/master
  }
}
