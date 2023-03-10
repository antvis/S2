import { find, isEmpty, map, slice, zip } from 'lodash';
import { type CellMeta, NewTab, VALUE_FIELD } from '../../../common';
import type { Node } from '../../../facet/layout/node';
import type { SpreadSheet } from '../../../sheet-type';
import type { CopyableList, FormatOptions } from '../interface';
import {
  getColNodeFieldFromNode,
  getSelectedCols,
  getSelectedRows,
} from '../method';
import {
  assembleMatrix,
  completeMatrix,
  getFormatOptions,
  getFormatter,
  getMaxRowLen,
  matrixHtmlTransformer,
  matrixPlainTextTransformer,
} from './common';
import { getNodeFormatData } from '@/utils';

// 使用 类 替代 函数，重构下面的代码

interface PivotDataCellCopyConfig {
  selectedCells?: CellMeta[];
  formatOptions?: FormatOptions;
  separator?: string;
}

interface PivotDataCellCopyUnifyConfig {
  separator: string;
  isFormatHeader: boolean;
  isFormatData: boolean;
  selectedCells: CellMeta[];
}

class PivotDataCellCopy {
  private spreadsheet: SpreadSheet;

  private leafRowNodes: Node[] = [];

  private leafColNodes: Node[] = [];

  private isExport: boolean;

  private config: PivotDataCellCopyUnifyConfig;

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
    config: PivotDataCellCopyConfig;
    isExport?: boolean;
  }) {
    const { spreadsheet, isExport = false, config } = params;

    this.spreadsheet = spreadsheet;
    this.isExport = isExport;
    this.config = this.unifyConfig(config);
    // selectedCells 选中了指定的单元格，则只展示对应单元格的数据, 否则展示所有数据
    this.leafRowNodes = this.getLeafRowNodes();
    this.leafColNodes = this.getLeafColNodes();
  }

  // 因为 copy 和 export 在配置上有一定差异，此方法用于抹平差异
  unifyConfig(config: PivotDataCellCopyConfig): PivotDataCellCopyUnifyConfig {
    let result = {
      isFormatData:
        this.spreadsheet.options.interaction?.copyWithFormat ?? false,
      isFormatHeader:
        this.spreadsheet.options.interaction?.copyWithFormat ?? false,
    };

    if (this.isExport) {
      const { isFormatData, isFormatHeader } = getFormatOptions(
        config?.formatOptions ?? false,
      );

      result = {
        isFormatData,
        isFormatHeader,
      };
    }

    return {
      separator: config.separator ?? NewTab,
      selectedCells: config.selectedCells ?? [],
      ...result,
    };
  }

  getLeafRowNodes() {
    const allRowLeafNodes = this.spreadsheet.getRowLeafNodes();
    let result: Node[] = allRowLeafNodes;
    const selectedRowNodes = getSelectedRows(this.config.selectedCells);

    // selectedRowNodes 选中了指定的行头，则只展示对应行头对应的数据
    if (!isEmpty(selectedRowNodes)) {
      result = selectedRowNodes.reduce<Node[]>((nodes, cellMeta) => {
        const filterNodes = allRowLeafNodes.filter((node) =>
          node.id.startsWith(cellMeta.id),
        );

        // console.log('filterNodes', filterNodes);
        nodes.push(...filterNodes);

        return nodes;
      }, []);
    }

    return result;
  }

  getLeafColNodes() {
    const allColLeafNodes = this.spreadsheet.getColumnLeafNodes();
    let result: Node[] = allColLeafNodes;
    const selectedColNodes = getSelectedCols(this.config.selectedCells);

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

  getPivotCopyData(): CopyableList {
    const { copyWithHeader } = this.spreadsheet.options.interaction!;

    /*
     * todo-zc: 这里可以直接使用 getDataMatrixByDataCell
     * 然后再根据 selectedCellsMeta 的 firstRow 和 firstCol 来查找对应的 header
     * 这样就获得了 leafRowNodes 和 leafColNodes
     * 最后根据 leafRowNodes 和 leafColNodes 的信息来格式化
     */
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

    return assembleMatrix(rowMatrix, colMatrix, dataMatrix);
  }

  private getColMatrix(): string[][] {
    return zip(
      ...map(this.leafColNodes, (n) => getNodeFormatData(n)),
    ) as string[][];
  }

  private getRowMatrix(): string[][] {
    const rowMatrix = map(this.leafRowNodes, (n) => getNodeFormatData(n));

    return completeMatrix(rowMatrix);
  }

  getPivotAllCopyData = (): CopyableList => {
    const rowMatrix = this.getRowMatrix();

    const colMatrix = this.getColMatrix();

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
