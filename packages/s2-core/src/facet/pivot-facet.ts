import {
  filter,
  forEach,
  get,
  isArray,
  isEmpty,
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
import type { Group } from '@antv/g-canvas';
import {
  DEFAULT_TREE_ROW_WIDTH,
  LAYOUT_SAMPLE_COUNT,
  type IconTheme,
  type MultiData,
  FrozenGroup,
  KEY_GROUP_FROZEN_SPLIT_LINE,
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  ORIGIN_FIELD,
} from '../common';
import { EXTRA_FIELD, LayoutWidthTypes, VALUE_FIELD } from '../common/constant';
import { CellTypes } from '../common/constant/interaction';
import { DebuggerUtil } from '../common/debug';
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
import { getDataCellIconStyle, renderLine } from '..';
import { FrozenFacet } from './frozen-facet';
import { buildHeaderHierarchy } from './layout/build-header-hierarchy';
import type { Hierarchy } from './layout/hierarchy';
import { layoutCoordinate, layoutDataPosition } from './layout/layout-hooks';
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

  get rowCellTheme() {
    return this.spreadsheet.theme.rowCell.cell;
  }

  public getContentHeight(): number {
    const { rowsHierarchy, colsHierarchy } = this.layoutResult;
    return rowsHierarchy.height + colsHierarchy.height;
  }

  protected doLayout(): LayoutResult {
    // 1、layout all nodes in rowHeader and colHeader
    const { leafNodes: rowLeafNodes, hierarchy: rowsHierarchy } =
      buildHeaderHierarchy({
        isRowHeader: true,
        facetCfg: this.cfg,
      });
    const { leafNodes: colLeafNodes, hierarchy: colsHierarchy } =
      buildHeaderHierarchy({
        isRowHeader: false,
        facetCfg: this.cfg,
      });

    // 2、calculate all related nodes coordinate
    this.calculateNodesCoordinate(
      rowLeafNodes,
      rowsHierarchy,
      colLeafNodes,
      colsHierarchy,
    );
    const { dataSet, spreadsheet } = this.cfg;

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
      const measureInfo = this.getMeasureInfo();
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
      colNodes: colsHierarchy.getNodes(),
      colsHierarchy,
      rowNodes: rowsHierarchy.getNodes(),
      rowsHierarchy,
      rowLeafNodes,
      colLeafNodes,
      getCellMeta,
      spreadsheet,
    };

    return layoutDataPosition(this.cfg, layoutResult);
  }

  protected getMeasureInfo() {
    const { dataSet, spreadsheet } = this.cfg;
    const { hierarchyType } = spreadsheet.options;
    const hideMeasure =
      get(spreadsheet, 'facet.cfg.colCfg.hideMeasureColumn') ?? false;

    // 如果在非自定义目录情况下hide measure query中是没有度量信息的，所以需要自动补上
    // 存在一个场景的冲突，如果是多个度量，定位数据数据是无法知道哪一列代表什么
    // 因此默认只会去 第一个度量拼接query
    return hideMeasure && hierarchyType !== 'customTree'
      ? {
          [EXTRA_FIELD]: dataSet.fields.values?.[0],
        }
      : {};
  }

  private calculateNodesCoordinate(
    rowLeafNodes: Node[],
    rowsHierarchy: Hierarchy,
    colLeafNodes: Node[],
    colsHierarchy: Hierarchy,
  ) {
    this.calculateRowNodesCoordinate(rowLeafNodes, rowsHierarchy, colLeafNodes);
    this.calculateColNodesCoordinate(
      colLeafNodes,
      colsHierarchy,
      rowLeafNodes,
      rowsHierarchy.width,
    );
  }

  /**
   * Calculate all col header related coordinate
   * height, width, x, y
   * colsHierarchy's height
   * colsHierarchy's width
   * @param colLeafNodes
   * @param colsHierarchy
   * @param rowLeafNodes
   * @param rowHeaderWidth
   */
  private calculateColNodesCoordinate(
    colLeafNodes: Node[],
    colsHierarchy: Hierarchy,
    rowLeafNodes: Node[],
    rowHeaderWidth: number,
  ) {
    let preLeafNode = Node.blankNode();
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
      if (currentNode.isLeaf) {
        currentNode.colIndex = currentCollIndex;
        currentCollIndex += 1;
        currentNode.x = preLeafNode.x + preLeafNode.width;
        currentNode.width = this.calculateColLeafNodesWidth(
          currentNode,
          colLeafNodes,
          rowLeafNodes,
          rowHeaderWidth,
        );
        colsHierarchy.width += currentNode.width;
        preLeafNode = currentNode;
      }

      if (currentNode.level === 0) {
        currentNode.y = 0;
      } else {
        const preLevelSample = colsHierarchy.sampleNodesForAllLevels.find(
          (n) => n.level === currentNode.level - 1,
        );
        currentNode.y = preLevelSample?.y + preLevelSample?.height ?? 0;
      }
      currentNode.height = this.getColNodeHeight(currentNode);
      layoutCoordinate(this.cfg, null, currentNode);
    }
    this.autoCalculateColNodeWidthAndX(colLeafNodes);
    if (!isEmpty(this.spreadsheet.options.totals?.col)) {
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
    }
  }

  /**
   * Auto Auto Auto column no-leaf node's width and x coordinate
   * @param colLeafNodes
   */
  private autoCalculateColNodeWidthAndX(colLeafNodes: Node[]) {
    let prevColParent: Node = null;
    let i = 0;
    const leafNodes = colLeafNodes.slice(0);

    while (i < leafNodes.length) {
      const node = leafNodes[i++];
      const parentNode = node.parent;
      if (prevColParent !== parentNode && parentNode) {
        leafNodes.push(parentNode);

        const firstVisibleChildNode = parentNode.children?.find(
          (childNode) => childNode.width,
        );
        // 父节点 x 坐标 = 第一个正常布局处理过的子节点 x 坐标(width 有值认为是正常布局过)
        const parentNodeX = firstVisibleChildNode?.x;
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
    const { colCfg, dataSet, filterDisplayDataItem } = this.cfg;
    const cellDraggedWidth = this.getCellDraggedWidth(col);

    // 1. 拖拽后的宽度优先级最高
    if (isNumber(cellDraggedWidth)) {
      return cellDraggedWidth;
    }

    // 2. 其次是自定义, 返回 null 则使用默认宽度
    const cellCustomWidth = this.getCellCustomWidth(col, colCfg?.width);
    if (isNumber(cellCustomWidth)) {
      return cellCustomWidth;
    }

    // 3. 紧凑布局
    if (this.spreadsheet.getLayoutWidthType() === LayoutWidthTypes.Compact) {
      const {
        bolderText: colCellTextStyle,
        cell: colCellStyle,
        icon: colIconStyle,
      } = this.spreadsheet.theme.colCell;
      const { text: dataCellTextStyle } = this.spreadsheet.theme.dataCell;

      // leaf node rough width
      const cellFormatter = this.spreadsheet.dataSet.getFieldFormatter(
        col.field,
      );
      const leafNodeLabel = cellFormatter?.(col.value) ?? col.label;
      const colIconWidth = this.getExpectedCellIconWidth(
        CellTypes.COL_CELL,
        this.spreadsheet.isValueInCols() &&
          this.spreadsheet.options.showDefaultHeaderActionIcon,
        colIconStyle,
      );
      const leafNodeRoughWidth =
        this.spreadsheet.measureTextWidth(leafNodeLabel, colCellTextStyle) +
        colIconWidth;

      const measureInfo = this.getMeasureInfo();

      // 采样 50 个 label，逐个计算找出最长的 label
      let maxDataLabel: string;
      let maxDataLabelWidth = 0;
      let iconWidthOfMaxDataLabel = 0;
      for (let index = 0; index < LAYOUT_SAMPLE_COUNT; index++) {
        const rowNode = rowLeafNodes[index];
        if (rowNode) {
          const cellData = dataSet.getCellData({
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
            const valueData = handleDataItem(cellData, filterDisplayDataItem);
            const formattedValue =
              this.spreadsheet.dataSet.getFieldFormatter(
                cellData[EXTRA_FIELD],
              )?.(valueData) ?? valueData;
            const cellLabel = `${formattedValue}`;
            const dataQuery = merge({}, rowNode.query, col.query, measureInfo);
            const valueField = dataQuery[EXTRA_FIELD];
            const {
              size,
              margin: { left, right },
            } = getDataCellIconStyle(
              this.spreadsheet.options.conditions,
              this.spreadsheet.theme.dataCell.icon,
              valueField,
            );
            const dataCellIconWidth = size + left + right;
            const cellLabelWidth =
              this.spreadsheet.measureTextWidth(cellLabel, dataCellTextStyle) +
              dataCellIconWidth;

            if (cellLabelWidth > maxDataLabelWidth) {
              maxDataLabel = cellLabel;
              maxDataLabelWidth = cellLabelWidth;
              iconWidthOfMaxDataLabel = dataCellIconWidth;
            }
          }
        }
      }

      const isLeafNodeWidthLonger = leafNodeRoughWidth > maxDataLabelWidth;
      const maxLabel = isLeafNodeWidthLonger ? leafNodeLabel : maxDataLabel;
      const appendedWidth = isLeafNodeWidthLonger
        ? colIconWidth
        : iconWidthOfMaxDataLabel;

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
        maxTextWidth +
        colCellStyle.padding?.left +
        colCellStyle.padding?.right +
        appendedWidth
      );
    }

    // 4. 自适应 adaptive
    // 4.1 树状自定义
    if (this.spreadsheet.isHierarchyTreeType()) {
      return this.getAdaptTreeColWidth(col, colLeafNodes, rowLeafNodes);
    }
    // 4.2 网格自定义
    return this.getAdaptGridColWidth(colLeafNodes, rowHeaderWidth);
  }

  private getColNodeHeight(col: Node) {
    const { colCfg } = this.cfg;
    const userDraggedHeight = get(colCfg, ['heightByField', col.key]);
    return userDraggedHeight ?? colCfg?.height;
  }

  /**
   * 获得图标区域预估宽度
   * 不考虑用户自定义的 displayCondition 条件
   * @param iconStyle 图标样式
   * @returns 宽度
   */
  private getExpectedCellIconWidth(
    cellType: CellTypes,
    useDefaultIcon: boolean,
    iconStyle: IconTheme,
  ): number {
    // count icons
    let iconCount = 0;
    if (useDefaultIcon) {
      iconCount = 1;
    } else {
      const customIcons = getActionIconConfig(
        map(this.spreadsheet.options.headerActionIcons, (iconCfg) => ({
          ...iconCfg,
          // ignore condition func when layout calc
          displayCondition: () => true,
        })),
        null,
        cellType,
      );

      iconCount = customIcons?.iconNames.length ?? 0;
    }

    // calc width
    return iconCount
      ? iconCount * (iconStyle.size + iconStyle.margin.left) +
          iconStyle.margin.right
      : 0;
  }

  /**
   * Calculate all row header related coordinate
   * height, width, x, y
   * rowHierarchy's height
   * rowHierarchy's width
   * @param rowLeafNodes
   * @param rowsHierarchy
   */
  private calculateRowNodesCoordinate(
    rowLeafNodes: Node[],
    rowsHierarchy: Hierarchy,
    colLeafNodes: Node[],
  ) {
    const { cellCfg, spreadsheet } = this.cfg;
    const isTree = spreadsheet.isHierarchyTreeType();
    const heightByField = get(
      spreadsheet,
      'options.style.rowCfg.heightByField',
      {},
    );

    const sampleNodeByLevel = rowsHierarchy.sampleNodesForAllLevels ?? [];

    // 1、calculate first node's width in every level
    if (isTree) {
      rowsHierarchy.width = this.getTreeRowHeaderWidth();
    } else {
      for (const levelSample of rowsHierarchy.sampleNodesForAllLevels) {
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
      }
    }

    // 2、calculate node's height & y（leaf nodes）, x-coordinate & width(all nodes), height & y (not-leaf),
    let preLeafNode = Node.blankNode();
    const allNodes = rowsHierarchy.getNodes();

    for (let i = 0; i < allNodes.length; i++) {
      const currentNode = allNodes[i];
      // in tree type, all nodes treat as leaf
      const isLeaf = isTree || (!isTree && currentNode.isLeaf);
      if (isLeaf) {
        // leaf node
        currentNode.rowIndex ??= i;
        currentNode.colIndex ??= i;
        currentNode.y = preLeafNode.y + preLeafNode.height;
        currentNode.height =
          (heightByField?.[currentNode.id] ?? cellCfg?.height) +
          this.rowCellTheme.padding?.top +
          this.rowCellTheme.padding?.bottom;
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

      layoutCoordinate(this.cfg, currentNode, null);
    }
    if (!isTree) {
      this.autoCalculateRowNodeHeightAndY(rowLeafNodes);
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
    while (i < leafNodes.length) {
      const node = leafNodes[i++];
      const parent = node.parent;
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

  // please read README-adjustTotalNodesCoordinate.md to understand this function
  private getMultipleMap(
    hierarchy: Hierarchy,
    isRowHeader?: boolean,
    isSubTotal?: boolean,
  ) {
    const { maxLevel } = hierarchy;
    const { totals, dataSet } = this.cfg;
    const moreThanOneValue = dataSet.moreThanOneValue();
    const { rows, columns } = dataSet.fields;
    const fields = isRowHeader ? rows : columns;
    const totalConfig = isRowHeader ? totals.row : totals.col;
    const defaultDimensionGroup = isSubTotal
      ? totalConfig.subTotalsGroupDimensions || []
      : totalConfig.totalsGroupDimensions || [];
    const dimensionGroup = !dataSet.isEmpty() ? defaultDimensionGroup : [];
    const multipleMap: number[] = Array.from({ length: maxLevel + 1 }, () => 1);

    for (let level = maxLevel; level > 0; level--) {
      const currentField = fields[level] as string;
      // 若不符合【分组维度包含此维度】或【者指标维度下非单指标维度】，此表头单元格为空，将宽高合并到上级单元格
      const existValueField = currentField === EXTRA_FIELD && moreThanOneValue;
      if (!(dimensionGroup.includes(currentField) || existValueField)) {
        multipleMap[level - 1] += multipleMap[level];
        multipleMap[level] = 0;
      }
    }
    return multipleMap;
  }

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
      }
      let res = 0;
      for (let i = 0; i < multiple; i++) {
        res +=
          hierarchy.sampleNodesForAllLevels.find(
            (sampleNode) => sampleNode.level === node.level + i,
          )?.[key] || 0;
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
    const { rowCfg, spreadsheet } = this.cfg;

    const cellDraggedWidth = get(rowCfg, ['widthByField', node.key]);

    if (isNumber(cellDraggedWidth)) {
      return cellDraggedWidth;
    }

    const cellCustomWidth = this.getCellCustomWidth(node, rowCfg?.width);
    if (isNumber(cellCustomWidth)) {
      return cellCustomWidth;
    }

    if (spreadsheet.getLayoutWidthType() !== LayoutWidthTypes.Adaptive) {
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
    const canvasW = this.getCanvasHW().width;
    const availableWidth = canvasW - this.getSeriesNumberWidth();
    const rowHeaderWidth = Math.min(
      availableWidth / 2,
      this.getTreeRowHeaderWidth(),
    );
    // calculate col width
    const colSize = Math.max(1, colLeafNodes.length);
    const { cellCfg } = this.cfg;
    return Math.max(
      getCellWidth(cellCfg, this.getColLabelLength(col, rowLeafNodes)),
      (availableWidth - rowHeaderWidth) / colSize,
    );
  }

  private getColLabelLength(col: Node, rowLeafNodes: Node[]) {
    // 如果 label 字段形如 "["xx","xxx"]"，直接获取其长度
    const labels = safeJsonParse(col?.value);
    if (isArray(labels)) {
      return labels.length;
    }

    // 采样前50，根据指标个数获取单元格列宽
    let maxLength = 1;
    for (let index = 0; index < LAYOUT_SAMPLE_COUNT; index++) {
      const rowNode = rowLeafNodes[index];
      if (!rowNode) {
        // 抽样个数大于叶子节点个数
        return maxLength;
      }

      const cellData = this.cfg.dataSet.getCellData({
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

      const cellDataKeys = keys(cellData?.[ORIGIN_FIELD]);
      for (let j = 0; j < cellDataKeys.length; j++) {
        const dataValue: MultiData = cellData[cellDataKeys[j]];

        const valueSize = size(dataValue?.values?.[0]);
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
    const { rows, cellCfg } = this.cfg;
    const rowHeaderColSize = rows.length;
    const colHeaderColSize = colLeafNodes.length;
    const canvasW = this.getCanvasHW().width;
    const availableWidth = canvasW - this.getSeriesNumberWidth();

    const size = Math.max(1, rowHeaderColSize + colHeaderColSize);
    if (!rowHeaderWidth) {
      return Math.max(getCellWidth(cellCfg), availableWidth / size);
    }

    return Math.max(
      getCellWidth(cellCfg),
      (availableWidth - rowHeaderWidth) / colHeaderColSize,
    );
  }

  /**
   * 计算树状结构行头宽度
   * @returns number
   */
  private getTreeRowHeaderWidth(): number {
    const { rows, dataSet, rowCfg, treeRowsWidth } = this.cfg;

    // 1. 用户拖拽或手动指定的行头宽度优先级最高
    // TODO: 由于历史原因, 存在两个行头宽度, (1. style.rowCfg.treeRowsWidth  2.style.treeRowsWidth) 暂时保持兼容
    const currentTreeRowsWidth = treeRowsWidth ?? rowCfg?.treeRowsWidth;
    if (isNumber(currentTreeRowsWidth)) {
      return currentTreeRowsWidth;
    }

    // 2. 其次是自定义
    const customRowWidth = this.getCellCustomWidth(null, rowCfg?.width);
    if (isNumber(customRowWidth)) {
      return customRowWidth;
    }

    // 3. 然后是计算 (+ icon province/city/level)
    const treeHeaderLabel = rows
      .map((key: string): string => dataSet.getFieldName(key))
      .join('/');

    const { bolderText: cornerCellTextStyle, icon: cornerIconStyle } =
      this.spreadsheet.theme.cornerCell;
    // 初始化角头时，保证其在树形模式下不换行
    // 给与两个icon的宽度空余（tree icon 和 action icon），减少复杂的 action icon 判断
    // 额外增加 1，当内容和容器宽度恰好相等时会出现换行
    const maxLabelWidth =
      1 +
      this.spreadsheet.measureTextWidth(treeHeaderLabel, cornerCellTextStyle) +
      cornerIconStyle.size * 2 +
      cornerIconStyle.margin?.left +
      cornerIconStyle.margin?.right +
      this.rowCellTheme.padding?.left +
      this.rowCellTheme.padding?.right;

    const width = Math.max(
      currentTreeRowsWidth ?? DEFAULT_TREE_ROW_WIDTH,
      maxLabelWidth,
    );

    return Number.isNaN(width) ? DEFAULT_TREE_ROW_WIDTH : width;
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
    const { dataSet, spreadsheet } = this.cfg;
    const {
      bolderText: rowTextStyle,
      icon: rowIconStyle,
      cell: rowCellStyle,
    } = spreadsheet.theme.rowCell;
    const {
      bolderText: cornerTextStyle,
      icon: cornerIconStyle,
      cell: cornerCellStyle,
    } = spreadsheet.theme.cornerCell;
    const { field, isLeaf } = node;

    // calc rowNode width
    const rowIconWidth = this.getExpectedCellIconWidth(
      CellTypes.ROW_CELL,
      !spreadsheet.isValueInCols() &&
        isLeaf &&
        spreadsheet.options.showDefaultHeaderActionIcon,
      rowIconStyle,
    );
    const allLabels = dataSet
      .getDimensionValues(field)
      ?.slice(0, LAYOUT_SAMPLE_COUNT)
      .map(
        (dimValue) =>
          this.spreadsheet.dataSet.getFieldFormatter(field)?.(dimValue) ??
          dimValue,
      );
    const maxLabel = maxBy(allLabels, (label) => `${label}`.length);
    const rowNodeWidth =
      spreadsheet.measureTextWidth(maxLabel, rowTextStyle) +
      rowIconWidth +
      rowCellStyle.padding.left +
      rowCellStyle.padding.right;

    // calc corner fieldNameNodeWidth
    const fieldName = dataSet.getFieldName(field);
    const cornerIconWidth = this.getExpectedCellIconWidth(
      CellTypes.CORNER_CELL,
      false,
      cornerIconStyle,
    );
    const fieldNameNodeWidth =
      spreadsheet.measureTextWidth(fieldName, cornerTextStyle) +
      cornerIconWidth +
      cornerCellStyle.padding.left +
      cornerCellStyle.padding.right;

    DebuggerUtil.getInstance().logger(
      'Max Label In Row:',
      field,
      rowNodeWidth > fieldNameNodeWidth ? maxLabel : fieldName,
    );

    // return max
    return Math.max(rowNodeWidth, fieldNameNodeWidth);
  }

  public getViewCellHeights(layoutResult: LayoutResult) {
    const { rowLeafNodes } = layoutResult;

    const heights = reduce(
      rowLeafNodes,
      (result: number[], node: Node) => {
        result.push(last(result) + node.height);
        return result;
      },
      [0],
    );

    return {
      getTotalHeight: () => {
        return last(heights) || 0;
      },
      getCellOffsetY: (index: number) => {
        return heights[index] || 0;
      },
      getTotalLength: () => {
        // 多了一个数据 [0]
        return heights.length - 1;
      },
      getIndexRange: (minHeight: number, maxHeight: number) => {
        return getIndexRangeWithOffsets(heights, minHeight, maxHeight);
      },
    };
  }

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
  }
}
