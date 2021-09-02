import { S2Event, SERIES_NUMBER_FIELD } from 'src/common/constant';
import { PanelIndexes } from 'src/utils/indexes';
import { BaseFacet } from 'src/facet/index';
import { buildHeaderHierarchy } from 'src/facet/layout/build-header-hierarchy';
import { Hierarchy } from 'src/facet/layout/hierarchy';
import { Node } from 'src/facet/layout/node';
import { get, maxBy, orderBy } from 'lodash';
import { layoutCoordinate } from 'src/facet/layout/layout-hooks';
import { measureTextWidth, measureTextWidthRoughly } from 'src/utils/text';
import { DebuggerUtil } from 'src/common/debug';
import { renderLine } from 'src/utils/g-renders';
import { Group } from '@antv/g-canvas';
import { IGroup } from '@antv/g-base';
import { FrozenCellGroupMap } from 'src/common/constant/frozen';

import type {
  LayoutResult,
  SplitLine,
  ViewMeta,
  S2CellType,
} from '../common/interface';
import {
  calculateInViewIndexes,
  translateGroup,
  translateGroupX,
  translateGroupY,
  getFrozenDataCellType,
  calculateFrozenCornerCells,
  splitInViewIndexesWithFrozen,
} from './utils';

export class TableFacet extends BaseFacet {
  public constructor(props) {
    super(props);
    const s2 = this.spreadsheet;
    s2.on(S2Event.RANGE_SORT, ({ sortKey, sortMethod }) => {
      const sortInfo = {
        sortKey,
        sortMethod,
        compareFunc: undefined,
      };
      s2.emit(S2Event.RANGE_SORTING, sortInfo);

      s2.dataCfg.data = orderBy(
        s2.dataSet.originData,
        [sortInfo.compareFunc || sortKey],
        [sortMethod.toLocaleLowerCase() as boolean | 'asc' | 'desc'],
      );
      s2.render(true);
      s2.emit(S2Event.RANGE_SORTED, s2.dataCfg.data);
    });
  }

  public destroy() {
    super.destroy();
    this.spreadsheet.off(S2Event.RANGE_SORT);
  }

  protected doLayout(): LayoutResult {
    const {
      dataSet,
      spreadsheet,
      cellCfg,
      frozenTrailingColCount,
      frozenTrailingRowCount,
    } = this.cfg;

    const {
      leafNodes: rowLeafNodes,
      hierarchy: rowsHierarchy,
    } = buildHeaderHierarchy({
      isRowHeader: true,
      facetCfg: this.cfg,
    });
    const {
      leafNodes: colLeafNodes,
      hierarchy: colsHierarchy,
    } = buildHeaderHierarchy({
      isRowHeader: false,
      facetCfg: this.cfg,
    });

    this.calculateNodesCoordinate(colLeafNodes, colsHierarchy);

    const getCellMeta = (rowIndex: number, colIndex: number) => {
      const showSeriesNumber = this.getSeriesNumberWidth() > 0;
      const col = colLeafNodes[colIndex];
      const cellHeight =
        cellCfg.height + cellCfg.padding?.top + cellCfg.padding?.bottom;

      let data;

      const width = this.panelBBox.maxX;
      const dataLength = dataSet.getMultiData({}).length;
      const colLength = colLeafNodes.length;

      let x = col.x;
      let y = cellHeight * rowIndex;

      if (
        frozenTrailingRowCount > 0 &&
        rowIndex >= dataLength - frozenTrailingRowCount
      ) {
        y = this.panelBBox.maxY - (dataLength - rowIndex) * cellHeight;
      }

      if (
        frozenTrailingColCount > 0 &&
        colIndex >= colLength - frozenTrailingColCount
      ) {
        x =
          width -
          colLeafNodes.reduceRight((prev, item, idx) => {
            if (idx >= colLength - frozenTrailingColCount) {
              return prev + item.width;
            }
            return prev;
          }, 0);
      }

      if (showSeriesNumber && col.field === SERIES_NUMBER_FIELD) {
        data = rowIndex + 1;
      } else {
        data = dataSet.getCellData({
          query: {
            col: col.field,
            rowIndex,
          },
        });
      }

      return {
        spreadsheet,
        x,
        y,
        width: col.width,
        height: cellHeight,
        data: {
          [col.field]: data,
        },
        rowIndex,
        colIndex,
        isTotals: false,
        colId: col.id,
        rowId: String(rowIndex),
        valueField: col.id,
        fieldValue: data,
      } as ViewMeta;
    };

    const layoutResult = {
      colNodes: colsHierarchy.getNodes(),
      colsHierarchy,
      rowNodes: rowsHierarchy.getNodes(),
      rowsHierarchy,
      rowLeafNodes: rowsHierarchy.getLeaves(),
      colLeafNodes,
      getCellMeta,
      spreadsheet,
    } as LayoutResult;

    return layoutResult;
  }

  private calculateNodesCoordinate(
    colLeafNodes: Node[],
    colsHierarchy: Hierarchy,
  ) {
    this.calculateColWidth(colLeafNodes);
    this.calculateColNodesCoordinate(colLeafNodes, colsHierarchy);
  }

  private getAdaptiveColWidth(colLeafNodes: Node[]) {
    const { cellCfg } = this.cfg;
    const colHeaderColSize = colLeafNodes.length;
    const canvasW = this.getCanvasHW().width;
    const size = Math.max(1, colHeaderColSize);
    return Math.max(cellCfg.width, canvasW / size);
  }

  private calculateColWidth(colLeafNodes: Node[]) {
    const { rowCfg, cellCfg } = this.cfg;
    let colWidth;
    if (this.spreadsheet.isColAdaptive()) {
      colWidth = this.getAdaptiveColWidth(colLeafNodes);
    } else {
      colWidth = -1;
    }

    rowCfg.width = colWidth;
    cellCfg.width = colWidth;
  }

  private getColNodeHeight(col: Node) {
    const { colCfg } = this.cfg;
    const userDragWidth = get(colCfg, `heightByField.${col.key}`);
    return userDragWidth || colCfg.height;
  }

  private calculateColNodesCoordinate(
    colLeafNodes: Node[],
    colsHierarchy: Hierarchy,
  ) {
    const { frozenTrailingColCount } = this.spreadsheet?.options;
    let preLeafNode = Node.blankNode();
    const allNodes = colsHierarchy.getNodes();
    for (const levelSample of colsHierarchy.sampleNodesForAllLevels) {
      levelSample.height = this.getColNodeHeight(levelSample);
      colsHierarchy.height += levelSample.height;
    }

    const nodes = [];

    for (let i = 0; i < allNodes.length; i++) {
      const currentNode = allNodes[i];

      currentNode.colIndex = i;
      currentNode.x = preLeafNode.x + preLeafNode.width;
      currentNode.width = this.calculateColLeafNodesWidth(currentNode);
      colsHierarchy.width += currentNode.width;
      preLeafNode = currentNode;
      currentNode.y = 0;

      currentNode.height = this.getColNodeHeight(currentNode);

      nodes.push(currentNode);

      if (frozenTrailingColCount === 0) {
        layoutCoordinate(this.cfg, null, currentNode);
      }
    }

    preLeafNode = Node.blankNode();

    let canvasW = this.getCanvasHW().width;
    canvasW = canvasW >= colsHierarchy.width ? colsHierarchy.width : canvasW;

    if (frozenTrailingColCount > 0) {
      for (let i = 1; i <= allNodes.length; i++) {
        const currentNode = allNodes[allNodes.length - i];

        if (
          currentNode.colIndex >=
          colLeafNodes.length - frozenTrailingColCount
        ) {
          if (currentNode.colIndex === allNodes.length - 1) {
            currentNode.x = canvasW - currentNode.width;
          } else {
            currentNode.x = preLeafNode.x - currentNode.width;
          }
          preLeafNode = currentNode;
        }

        layoutCoordinate(this.cfg, null, currentNode);
      }
    }
  }

  private calculateColLeafNodesWidth(col: Node): number {
    const { cellCfg, colCfg, dataSet, spreadsheet } = this.cfg;

    const userDragWidth = get(
      get(colCfg, 'widthByFieldValue'),
      `${col.value}`,
      col.width,
    );
    let colWidth;
    if (userDragWidth) {
      colWidth = userDragWidth;
    } else if (cellCfg.width === -1) {
      const datas = dataSet.originData;
      const colLabel = col.label;

      const allLabels = datas.map((data) => `${data[col.key]}`)?.slice(0, 50);
      allLabels.push(colLabel);
      const maxLabel = maxBy(allLabels, (label) =>
        measureTextWidthRoughly(label),
      );

      const seriesNumberWidth = this.getSeriesNumberWidth();
      const iconSize = get(spreadsheet, 'theme.colCell.icon.size');
      const textStyle = get(spreadsheet, 'theme.colCell.bolderText');
      DebuggerUtil.getInstance().logger(
        'Max Label In Col:',
        col.field,
        maxLabel,
      );
      colWidth =
        measureTextWidth(maxLabel, textStyle) +
        cellCfg.padding?.left +
        cellCfg.padding?.right +
        iconSize;

      if (col.field === SERIES_NUMBER_FIELD) {
        colWidth = seriesNumberWidth;
      }
    } else {
      colWidth = cellCfg.width;
    }

    return colWidth;
  }

  protected getViewCellHeights() {
    const { dataSet, cellCfg } = this.cfg;

    const cellHeight =
      cellCfg.height + cellCfg.padding?.top + cellCfg.padding?.bottom;

    return {
      getTotalHeight: () => {
        return cellHeight * dataSet.originData.length;
      },

      getCellHeight: () => {
        return cellHeight;
      },

      getTotalLength: () => {
        return dataSet.originData.length;
      },

      getIndexRange: (minHeight: number, maxHeight: number) => {
        const yMin = Math.floor(minHeight / cellHeight);
        // 防止数组index溢出导致报错
        const yMax =
          maxHeight % cellHeight === 0
            ? maxHeight / cellHeight - 1
            : Math.floor(maxHeight / cellHeight);
        return {
          start: yMin,
          end: yMax,
        };
      },
    };
  }

  protected initFrozenGroupPosition = () => {
    translateGroup(
      this.spreadsheet.frozenRowGroup,
      this.cornerBBox.width,
      this.cornerBBox.height,
    );
    translateGroup(
      this.spreadsheet.frozenColGroup,
      this.cornerBBox.width,
      this.cornerBBox.height,
    );
    translateGroup(
      this.spreadsheet.frozenTrailingColGroup,
      this.cornerBBox.width,
      this.cornerBBox.height,
    );
    translateGroup(
      this.spreadsheet.frozenTopGroup,
      this.cornerBBox.width,
      this.cornerBBox.height,
    );
  };

  getTotalHeightForRange = (start: number, end: number) => {
    if (start < 0 || end < 0) return 0;
    let totalHeight = 0;
    for (let index = start; index < end + 1; index++) {
      const height = this.viewCellHeights.getCellHeight(index);
      totalHeight += height;
    }
    return totalHeight;
  };

  protected renderFrozenGroupSplitLine = () => {
    const {
      frozenRowCount,
      frozenColCount,
      frozenTrailingColCount,
      frozenTrailingRowCount,
    } = this.spreadsheet.options;
    const colLeafNodes = this.layoutResult.colLeafNodes;
    const dataLength = this.spreadsheet.dataSet.getMultiData({}).length;

    const style: SplitLine = get(this.cfg, 'spreadsheet.theme.splitLine');

    const verticalBorderStyle = {
      lineWidth: style?.verticalBorderWidth,
      stroke: style?.verticalBorderColor,
      opacity: style?.verticalBorderColorOpacity,
    };

    const horizontalBorderStyle = {
      lineWidth: style?.horizontalBorderWidth,
      stroke: style?.horizontalBorderColor,
      opacity: style?.horizontalBorderColorOpacity,
    };

    if (frozenColCount > 0) {
      const x = colLeafNodes.reduce((prev, item, idx) => {
        if (idx < frozenColCount) {
          return prev + item.width;
        }
        return prev;
      }, 0);

      renderLine(
        this.foregroundGroup as Group,
        {
          x1: x,
          x2: x,
          y1: this.cornerBBox.height,
          y2: this.panelBBox.maxY,
        },
        {
          ...verticalBorderStyle,
        },
      );
    }

    if (frozenRowCount > 0) {
      const y =
        this.cornerBBox.height +
        this.getTotalHeightForRange(0, frozenRowCount - 1);
      renderLine(
        this.foregroundGroup as Group,
        {
          x1: 0,
          x2: this.panelBBox.width,
          y1: y,
          y2: y,
        },
        {
          ...horizontalBorderStyle,
        },
      );
    }

    if (frozenTrailingColCount > 0) {
      const width = colLeafNodes.reduceRight((prev, item, idx) => {
        if (idx >= colLeafNodes.length - frozenTrailingColCount) {
          return prev + item.width;
        }
        return prev;
      }, 0);

      const x = this.panelBBox.width - width;

      renderLine(
        this.foregroundGroup as Group,
        {
          x1: x,
          x2: x,
          y1: this.cornerBBox.height,
          y2: this.panelBBox.maxY,
        },
        {
          ...verticalBorderStyle,
        },
      );
    }

    if (frozenTrailingRowCount > 0) {
      const y =
        this.panelBBox.maxY -
        this.getTotalHeightForRange(
          dataLength - frozenTrailingRowCount,
          dataLength - 1,
        );
      renderLine(
        this.foregroundGroup as Group,
        {
          x1: 0,
          x2: this.panelBBox.width,
          y1: y,
          y2: y,
        },
        {
          ...horizontalBorderStyle,
        },
      );
    }
  };

  protected renderFrozenPanelCornerGroup = () => {
    const {
      frozenRowCount,
      frozenColCount,
      frozenTrailingRowCount,
      frozenTrailingColCount,
    } = this.spreadsheet.options;
    const dataLength = this.viewCellHeights.getTotalLength();
    const colLength = this.layoutResult.colLeafNodes.length;

    const result = calculateFrozenCornerCells(
      {
        frozenRowCount,
        frozenColCount,
        frozenTrailingRowCount,
        frozenTrailingColCount,
      },
      colLength,
      dataLength,
    );

    Object.keys(result).forEach((key) => {
      const cells = result[key];
      const group = this.spreadsheet[FrozenCellGroupMap[key]];
      if (group) {
        cells.forEach((cell) => {
          this.addFrozenCell(cell.x, cell.y, group);
        });
      }
    });
  };

  addFrozenCell = (colIndex: number, rowIndex: number, group: IGroup) => {
    const viewMeta = this.layoutResult.getCellMeta(rowIndex, colIndex);
    if (viewMeta) {
      const cell = this.cfg.dataCell(viewMeta);
      group.add(cell);
    }
  };

  addCell = (cell: S2CellType<ViewMeta>) => {
    const {
      frozenRowCount,
      frozenColCount,
      frozenTrailingRowCount,
      frozenTrailingColCount,
    } = this.spreadsheet.options;
    const dataLength = this.viewCellHeights.getTotalLength();
    const colLength = this.layoutResult.colsHierarchy.getLeaves().length;

    const frozenCellType = getFrozenDataCellType(
      cell.getMeta(),
      {
        frozenRowCount,
        frozenColCount,
        frozenTrailingRowCount,
        frozenTrailingColCount,
      },
      colLength,
      dataLength,
    );

    const group = FrozenCellGroupMap[frozenCellType];
    if (group) {
      (this.spreadsheet[group] as Group).add(cell);
    }
  };

  public init() {
    super.init();
    const { width, height } = this.panelBBox;
    this.spreadsheet.panelGroup.setClip({
      type: 'rect',
      attrs: {
        x: 0,
        y: this.cornerBBox.height,
        width,
        height,
      },
    });
  }

  public render() {
    super.render();
    this.renderFrozenPanelCornerGroup();
    this.initFrozenGroupPosition();
    this.renderFrozenGroupSplitLine();
  }

  protected translateRelatedGroups(
    scrollX: number,
    scrollY: number,
    hRowScroll: number,
  ) {
    translateGroupX(
      this.spreadsheet.frozenRowGroup,
      this.cornerBBox.width - scrollX,
    );
    translateGroupX(
      this.spreadsheet.frozenTrailingRowGroup,
      this.cornerBBox.width - scrollX,
    );
    translateGroupY(
      this.spreadsheet.frozenColGroup,
      this.cornerBBox.height - scrollY,
    );
    translateGroupY(
      this.spreadsheet.frozenTrailingColGroup,
      this.cornerBBox.height - scrollY,
    );

    super.translateRelatedGroups(scrollX, scrollY, hRowScroll);
  }

  protected calculateXYIndexes(scrollX: number, scrollY: number): PanelIndexes {
    const {
      frozenColCount,
      frozenRowCount,
      frozenTrailingColCount,
      frozenTrailingRowCount,
    } = this.spreadsheet.options;

    const dataLength = this.viewCellHeights.getTotalLength();
    const colLength = this.layoutResult.colLeafNodes.length;

    const indexes = calculateInViewIndexes(
      scrollX,
      scrollY,
      this.viewCellWidths,
      this.viewCellHeights,
      this.panelBBox,
      this.getRealScrollX(this.cornerBBox.width),
    );

    return splitInViewIndexesWithFrozen(
      indexes,
      {
        frozenColCount,
        frozenRowCount,
        frozenTrailingColCount,
        frozenTrailingRowCount,
      },
      colLength,
      dataLength,
    );
  }
}
