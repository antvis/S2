import { LayoutResult, ViewMeta } from 'src/common/interface';
import { ICON_RADIUS, SERIES_NUMBER_FIELD } from 'src/common/constant';
import { BaseFacet } from 'src/facet/index';
import { buildHeaderHierarchy } from 'src/facet/layout/build-header-hierarchy';
import { Hierarchy } from 'src/facet/layout/hierarchy';
import { Node } from 'src/facet/layout/node';
import * as _ from 'lodash';
import { layoutNodes } from 'src/facet/layout/layout-hooks';
import { measureTextWidth, measureTextWidthRoughly } from 'src/utils/text';
import { DebuggerUtil } from 'src/common/debug';

export class TableFacet extends BaseFacet {
  protected doLayout(): LayoutResult {
    const { dataSet, spreadsheet, cellCfg } = this.cfg;

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

    this.calculateNodesCoordinate(
      rowLeafNodes,
      rowsHierarchy,
      colLeafNodes,
      colsHierarchy,
    );

    const getCellMeta = (rowIndex: number, colIndex: number) => {
      const showSeriesNumber = this.getSeriesNumberWidth() > 0;
      const col = colLeafNodes[colIndex];
      const cellHeight =
        cellCfg.height + cellCfg.padding[0] + cellCfg.padding[2];

      let data;

      if (showSeriesNumber && col.field === SERIES_NUMBER_FIELD) {
        data = rowIndex + 1;
      } else {
        data = dataSet.getCellData({
          col: col.field,
          rowIndex,
        });
      }

      return {
        spreadsheet,
        x: col.x,
        y: cellHeight * rowIndex,
        width: col.width,
        height: cellHeight,
        data: [
          {
            [col.field]: data,
          },
        ],
        rowIndex,
        colIndex,
        isTotals: false,
        colId: col.id,
        valueField: col.id,
        fieldValue: data,
      } as ViewMeta;
    };

    const layoutResult = {
      colNodes: colsHierarchy.getNodes(),
      colsHierarchy,
      rowNodes: rowsHierarchy.getNodes(),
      rowsHierarchy,
      rowLeafNodes,
      colLeafNodes,
      getCellMeta,
      spreadsheet,
    } as LayoutResult;

    const callback = this.cfg?.layoutResult;
    return callback ? callback(layoutResult) : layoutResult;
  }

  private calculateNodesCoordinate(
    rowLeafNodes: Node[],
    rowsHierarchy: Hierarchy,
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
    const userDragWidth = _.get(colCfg, `heightByField.${col.key}`);
    return userDragWidth || colCfg.height;
  }

  private calculateColNodesCoordinate(
    colLeafNodes: Node[],
    colsHierarchy: Hierarchy,
  ) {
    let preLeafNode = Node.blankNode();
    const allNodes = colsHierarchy.getNodes();
    for (const levelSample of colsHierarchy.sampleNodesForAllLevels) {
      levelSample.height = this.getColNodeHeight(levelSample);
      colsHierarchy.height += levelSample.height;
    }

    for (let i = 0; i < allNodes.length; i++) {
      const currentNode = allNodes[i];

      currentNode.colIndex = i;
      currentNode.x = preLeafNode.x + preLeafNode.width;
      currentNode.width = this.calculateColLeafNodesWidth(currentNode);
      colsHierarchy.width += currentNode.width;
      preLeafNode = currentNode;
      currentNode.y = 0;

      currentNode.height = this.getColNodeHeight(currentNode);
      layoutNodes(this.cfg, null, currentNode);
    }
  }

  private calculateColLeafNodesWidth(col: Node): number {
    const { cellCfg, colCfg, dataSet, spreadsheet } = this.cfg;

    const userDragWidth = _.get(
      _.get(colCfg, 'widthByFieldValue'),
      `${col.value}`,
      col.width,
    );
    let colWidth;
    if (userDragWidth) {
      colWidth = userDragWidth;
    } else if (cellCfg.width === -1) {
      const datas = dataSet.getMultiData({});
      const colLabel = col.label;

      const allLabels = datas.map((data) => `${data[col.value]}`)?.slice(0, 50);
      allLabels.push(colLabel);
      const maxLabel = _.maxBy(allLabels, (label) =>
        measureTextWidthRoughly(label),
      );

      const seriesNumberWidth = this.getSeriesNumberWidth();

      const textStyle = spreadsheet.theme.header.bolderText;
      DebuggerUtil.getInstance().logger(
        'Max Label In Col:',
        col.field,
        maxLabel,
      );
      colWidth =
        measureTextWidth(maxLabel, textStyle) +
        cellCfg.padding[1] +
        cellCfg.padding[3] +
        ICON_RADIUS * 2;

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

    const cellHeight = cellCfg.height + cellCfg.padding[0] + cellCfg.padding[2];

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
        const yMax = Math.floor(maxHeight / cellHeight);

        return {
          start: yMin,
          end: yMax,
        };
      },
    };
  }
}
