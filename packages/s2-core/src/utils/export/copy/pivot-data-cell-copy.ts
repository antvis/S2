import { find, isEmpty, map, slice, zip } from 'lodash';
import { type CellMeta, NewTab, VALUE_FIELD } from '../../../common';
import type { Node } from '../../../facet/layout/node';
import type { SpreadSheet } from '../../../sheet-type';
import type { CopyableList, FormatOptions } from '../interface';
import { getHeaderList, getSelectedCols, getSelectedRows } from '../method';
import {
  assembleMatrix,
  completeMatrix,
  getFormatOptions,
  getFormatter,
  getMaxRowLen,
  matrixHtmlTransformer,
  matrixPlainTextTransformer,
} from './common';

// 使用 类 替代 函数，重构下面的代码
class PivotDataCellCopy {
  private spreadsheet: SpreadSheet;

  private selectedCells: CellMeta[];

  // @ts-ignore
  private formatOptions: FormatOptions;

  private separator: string;

  private leafRowNodes: Node[] = [];

  private leafColNodes: Node[] = [];

  constructor(params: {
    spreadsheet: SpreadSheet;
    // 未传这是全部选中的
    selectedCells?: CellMeta[];
    formatOptions?: FormatOptions;
    separator?: string;
  }) {
    const { spreadsheet, selectedCells, formatOptions, separator } = params;

    this.spreadsheet = spreadsheet;
    this.selectedCells = selectedCells ?? [];
    this.formatOptions = getFormatOptions(formatOptions ?? false);
    this.separator = separator ?? NewTab;
    this.leafRowNodes = this.getLeafRowNodes();
    this.leafColNodes = this.getLeafColNodes();
  }

  getLeafRowNodes() {
    const allRowLeafNodes = this.spreadsheet.getRowLeafNodes();
    let result: Node[] = allRowLeafNodes;
    const selectedRowNodes = getSelectedRows(this.selectedCells);

    // selectedRowNodes 选中了指定的行头，则只展示对应行头对应的数据
    if (!isEmpty(selectedRowNodes)) {
      result = selectedRowNodes.reduce<Node[]>((nodes, cellMeta) => {
        nodes.push(
          ...allRowLeafNodes.filter((node) => node.id.startsWith(cellMeta.id)),
        );

        return nodes;
      }, []);
    }

    return result;
  }

  getLeafColNodes() {
    const allColLeafNodes = this.spreadsheet.getColumnLeafNodes();
    let result: Node[] = allColLeafNodes;
    const selectedColNodes = getSelectedCols(this.selectedCells);

    // selectedColNodes 选中了指定的列头，则只展示对应列头对应的数据
    if (!isEmpty(selectedColNodes)) {
      result = selectedColNodes.reduce<Node[]>((nodes, cellMeta) => {
        nodes.push(
          ...allColLeafNodes.filter((node) => node.id.startsWith(cellMeta.id)),
        );

        return nodes;
      }, []);
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

        return getFormatter(
          this.spreadsheet,
          colNode.field,
        )(cellData?.[VALUE_FIELD] ?? '');
      }),
    );

  getCornerMatrix = (rowMatrix?: string[][]): string[][] => {
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
    // console.log(slice(realRows, 0, maxRowLen), 'slice(realRows, 0, maxRowLen)');
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

    // console.log(cornerMatrix, 'cornerMatrix');

    return cornerMatrix;
  };

  getPivotCopyData(): CopyableList {
    const { copyWithHeader } = this.spreadsheet.options.interaction!;

    const dataMatrix = this.getDataMatrixByHeaderNode() as string[][];

    // 不带表头复制
    if (!copyWithHeader) {
      return [
        matrixPlainTextTransformer(dataMatrix, this.separator),
        matrixHtmlTransformer(dataMatrix),
      ];
    }

    // 带表头复制
    let rowMatrix = map(this.leafRowNodes, (n) => getHeaderList(n.id));

    rowMatrix = completeMatrix(rowMatrix);

    const colMatrix = zip(
      ...map(this.leafColNodes, (n) => getHeaderList(n.id)),
    ) as string[][];

    return assembleMatrix(rowMatrix, colMatrix, dataMatrix);
  }

  getPivotAllCopyData = (): CopyableList => {
    // todo-zc 的序号处理还有点麻烦，先不处理
    let rowMatrix = map(this.leafRowNodes, (n) => getHeaderList(n.id));

    // 当 rowMatrix 中的元素个数不一致时，需要补全
    rowMatrix = completeMatrix(rowMatrix);

    const colMatrix = zip(
      ...map(this.leafColNodes, (n) => getHeaderList(n.id)),
    ) as string[][];

    const cornerMatrix = this.getCornerMatrix(rowMatrix);
    const dataMatrix = this.getDataMatrixByHeaderNode() as string[][];

    return assembleMatrix(rowMatrix, colMatrix, dataMatrix, cornerMatrix);
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
    selectedCells,
  });

  return pivotDataCellCopy.processPivotSelected();
}

export const processPivotAllSelected = (
  spreadsheet: SpreadSheet,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  split: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formatOptions?: FormatOptions,
): CopyableList => {
  const pivotDataCellCopy = new PivotDataCellCopy({
    spreadsheet,
    separator: split,
    formatOptions,
  });

  return pivotDataCellCopy.processPivotAllSelected();
};
