import { find, isEmpty, map, slice, zip } from 'lodash';
import { type CellMeta, VALUE_FIELD } from '../../../common';
import type { Node } from '../../../facet/layout/node';
import type { SpreadSheet } from '../../../sheet-type';
import type {
  CopyableList,
  CopyAndExportUnifyConfig,
  CopyOrExportConfig,
  FormatOptions,
} from '../interface';
import {
  getColNodeFieldFromNode,
  getSelectedCols,
  getSelectedRows,
} from '../method';
import {
  assembleMatrix,
  completeMatrix,
  getFormatter,
  getMaxRowLen,
  matrixHtmlTransformer,
  matrixPlainTextTransformer,
  unifyConfig,
} from './common';
import { getNodeFormatData } from './core';

class PivotDataCellCopy {
  private spreadsheet: SpreadSheet;

  private leafRowNodes: Node[] = [];

  private leafColNodes: Node[] = [];

  private config: CopyAndExportUnifyConfig;

  /**
   *
   * @param {{
   * spreadsheet: SpreadSheet,
   * selectedCells?: CellMeta[],
   * formatOptions?: FormatOptions,
   * separator?: string}} params
   */
  constructor(params: {
    spreadsheet: SpreadSheet;
    config: CopyOrExportConfig;
    isExport?: boolean;
  }) {
    const { spreadsheet, isExport = false, config } = params;

    this.spreadsheet = spreadsheet;
    this.config = unifyConfig(config, spreadsheet, isExport);

    this.leafRowNodes = this.getLeafRowNodes();
    this.leafColNodes = this.getLeafColNodes();
  }

  getLeafRowNodes() {
    const allRowLeafNodes = this.spreadsheet.getRowLeafNodes();
    let result: Node[] = allRowLeafNodes;
    const selectedRowMeta = getSelectedRows(this.config.selectedCells);

    // selectedRowMeta 选中了指定的行头，则只展示对应行头对应的数据
    if (!isEmpty(selectedRowMeta)) {
      result = this.getSelectedNode(selectedRowMeta, allRowLeafNodes);
    }

    return result;
  }

  private getSelectedNode(
    selectedMeta: CellMeta[],
    allRowOrColLeafNodes: Node[],
  ): Node[] {
    return selectedMeta.reduce<Node[]>((nodes, cellMeta) => {
      const filterNodes = allRowOrColLeafNodes.filter((node) =>
        node.id.startsWith(cellMeta.id),
      );

      nodes.push(...filterNodes);

      return nodes;
    }, []);
  }

  getLeafColNodes() {
    const allColLeafNodes = this.spreadsheet.getColumnLeafNodes();
    let result: Node[] = allColLeafNodes;
    const selectedColMetas = getSelectedCols(this.config.selectedCells);

    // selectedColNodes 选中了指定的列头，则只展示对应列头对应的数据
    if (!isEmpty(selectedColMetas)) {
      result = this.getSelectedNode(selectedColMetas, allColLeafNodes);
    }

    return result;
  }

  getDataMatrixByHeaderNode = () =>
    map(this.leafRowNodes, (rowNode) =>
      this.leafColNodes.map((colNode) => {
        const cellData = this.spreadsheet.dataSet.getCellData({
          query: {
            ...rowNode.query,
            ...colNode.query,
          },
          rowNode,
          isTotals:
            rowNode.isTotals ||
            rowNode.isTotalMeasure ||
            colNode.isTotals ||
            colNode.isTotalMeasure,
        });

        const field = getColNodeFieldFromNode(
          this.spreadsheet.isPivotMode,
          colNode,
        );

        return getFormatter(
          this.spreadsheet,
          field ?? colNode.field,
          this.config.isFormatData,
        )(cellData?.[VALUE_FIELD] ?? '');
      }),
    );

  private getCornerMatrix = (rowMatrix?: string[][]): string[][] => {
    const { fields, meta } = this.spreadsheet.dataCfg;
    const { columns = [], rows = [] } = fields;
    const realRows = rows;
    const maxRowLen = this.spreadsheet.isHierarchyTreeType()
      ? getMaxRowLen(rowMatrix ?? [])
      : realRows.length;

    /*
     * const { showSeriesNumber, seriesNumberText } = this.spreadsheet.options;
     * 需要考虑 serisesNumber
     * if (showSeriesNumber) {
     *   realRows.unshift(getDefaultSeriesNumberText(seriesNumberText));
     * }
     */
    // 为了对齐数值
    columns.push('');
    /*
     * cornerMatrix 形成的矩阵为  rows.length(宽) * columns.length(高)
     */
    const cornerMatrix = map(columns, (col, colIndex) =>
      map(slice(realRows, 0, maxRowLen), (row, rowIndex) => {
        // 角头的最后一行，为行头
        if (colIndex === columns.length - 1) {
          return find(meta, ['field', row])?.name ?? row;
        }

        // 角头的最后一列，为列头
        if (rowIndex === maxRowLen - 1) {
          return find(meta, ['field', col])?.name ?? col;
        }

        return '';
      }),
    ) as unknown as string[][];

    return cornerMatrix;
  };

  private getColMatrix(): string[][] {
    return zip(
      ...map(this.leafColNodes, (n) => getNodeFormatData(n)),
    ) as string[][];
  }

  private getRowMatrix(): string[][] {
    const rowMatrix = map(this.leafRowNodes, (n) => getNodeFormatData(n));

    return completeMatrix(rowMatrix);
  }

  getPivotCopyData(): CopyableList {
    const { copyWithHeader } = this.spreadsheet.options.interaction!;

    const dataMatrix = this.getDataMatrixByHeaderNode() as string[][];

    // 不带表头复制
    if (!copyWithHeader) {
      return [
        matrixPlainTextTransformer(dataMatrix, this.config.separator),
        matrixHtmlTransformer(dataMatrix),
      ];
    }

    // 带表头复制
    const rowMatrix = this.getRowMatrix();

    const colMatrix = this.getColMatrix();

    return assembleMatrix({ rowMatrix, colMatrix, dataMatrix });
  }

  getPivotAllCopyData = (): CopyableList => {
    const rowMatrix = this.getRowMatrix();

    const colMatrix = this.getColMatrix();

    const cornerMatrix = this.getCornerMatrix(rowMatrix);
    const dataMatrix = this.getDataMatrixByHeaderNode() as string[][];

    return assembleMatrix({ rowMatrix, colMatrix, dataMatrix, cornerMatrix });
  };

  processPivotSelected(): CopyableList {
    return this.getPivotCopyData();
  }

  processPivotAllSelected = (): CopyableList => this.getPivotAllCopyData();
}

// -------------------

export function processPivotSelected(
  spreadsheet: SpreadSheet,
  selectedCells: CellMeta[],
): CopyableList {
  const pivotDataCellCopy = new PivotDataCellCopy({
    spreadsheet,
    config: {
      selectedCells,
    },
  });

  return pivotDataCellCopy.processPivotSelected();
}

export const processPivotAllSelected = (
  spreadsheet: SpreadSheet,
  split: string,
  formatOptions?: FormatOptions,
): CopyableList => {
  const pivotDataCellCopy = new PivotDataCellCopy({
    spreadsheet,
    isExport: true,
    config: {
      separator: split,
      formatOptions,
    },
  });

  return pivotDataCellCopy.processPivotAllSelected();
};
