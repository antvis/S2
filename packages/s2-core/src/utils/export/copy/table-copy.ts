import { map, zip } from 'lodash';
import {
  SERIES_NUMBER_FIELD,
  type CellMeta,
  type RawData,
} from '../../../common';
import type {
  CopyAllDataParams,
  CopyableList,
  SheetCopyConstructorParams,
} from '../../../common/interface/export';
import type { Node } from '../../../facet/layout/node';
import type { SpreadSheet } from '../../../sheet-type';
import {
  convertString,
  getColNodeFieldFromNode,
  getSelectedCols,
  getSelectedRows,
} from '../method';
import { BaseDataCellCopy } from './base-data-cell-copy';
import { assembleMatrix, getHeaderNodeFromMeta } from './common';

class TableDataCellCopy extends BaseDataCellCopy {
  private displayData: RawData[];

  private columnNodes: Node[];

  constructor(params: SheetCopyConstructorParams) {
    super(params);

    this.displayData = this.getSelectedDisplayData();
    this.columnNodes = this.getSelectedColNodes();
  }

  protected getHeaderNodeMatrix(node: Node) {
    // 明细表的表头配置即作为列头, 也作为数值, 所以列头不应该被格式化
    return super.getHeaderNodeMatrix(node);
  }

  private getSelectedColNodes(): Node[] {
    const selectedCols = getSelectedCols(this.config.selectedCells);
    const colLeafNodes = this.spreadsheet.facet.getColLeafNodes();

    if (selectedCols.length === 0) {
      return colLeafNodes;
    }

    return map(selectedCols, (meta) => colLeafNodes[meta.colIndex]);
  }

  private getSelectedDisplayData(): RawData[] {
    const selectedRows = getSelectedRows(this.config.selectedCells);
    const originDisplayData = this.spreadsheet.dataSet.getDisplayDataSet();

    if (selectedRows.length === 0) {
      return originDisplayData;
    }

    return map(selectedRows, (cell) => originDisplayData[cell.rowIndex]);
  }

  private getDataMatrix(): string[][] {
    const { seriesNumber } = this.spreadsheet.options;

    return this.displayData.map((row, i) =>
      this.columnNodes.map((node, j) => {
        const field = node?.field;

        if (SERIES_NUMBER_FIELD === field && seriesNumber?.enable) {
          return (i + 1).toString();
        }

        const formatter = this.getFormatter({
          field,
          rowIndex: i,
          colIndex: j,
        });
        const value = row?.[field];

        return formatter(value);
      }),
    ) as string[][];
  }

  protected getDataMatrixRIC(): Promise<string[][]> {
    const { seriesNumber } = this.spreadsheet.options;
    const result: string[][] = [];
    let rowIndex = 0;

    return new Promise((resolve, reject) => {
      try {
        const dataMatrixIdleCallback = (deadline: IdleDeadline) => {
          const rowLength = this.displayData.length;

          // requestIdleCallback 浏览器空闲时会多次执行, 只有一行数据时执行一次即可, 避免生成重复数据
          this.initIdleCallbackCount(rowLength);

          while (
            (deadline.timeRemaining() > 0 ||
              deadline.didTimeout ||
              process.env['NODE_ENV'] === 'test') &&
            rowIndex <= rowLength - 1 &&
            this.idleCallbackCount > 0
          ) {
            for (
              let j = rowIndex;
              j < rowLength && this.idleCallbackCount > 0;
              j++
            ) {
              const rowData = this.displayData[j];
              const row: string[] = [];

              for (let i = 0; i < this.columnNodes.length; i++) {
                const colNode = this.columnNodes[i];
                const field = colNode.field;

                if (SERIES_NUMBER_FIELD === field && seriesNumber?.enable) {
                  row.push((j + 1).toString());
                  // eslint-disable-next-line no-continue
                  continue;
                }

                const formatter = this.getFormatter({
                  field,
                  rowIndex,
                  colIndex: i,
                });
                const value = rowData[field];
                const dataItem = formatter(value);

                row.push(dataItem as string);
              }
              // 生成一行数据后，rowIndex + 1，下次 requestIdleCallback 时从下一行开始
              rowIndex++;
              result.push(row);
              this.idleCallbackCount--;
            }
          }

          if (rowIndex === rowLength) {
            resolve(result);
          } else {
            // 重置 idleCallbackCount，避免下次 requestIdleCallback 时 idleCallbackCount 为 0
            this.initIdleCallbackCount(rowLength);

            requestIdleCallback(dataMatrixIdleCallback);
          }
        };

        requestIdleCallback(dataMatrixIdleCallback);
      } catch (e) {
        reject(e);
      }
    });
  }

  private isSeriesNumberField(field: string) {
    const { seriesNumber } = this.spreadsheet.options;

    return SERIES_NUMBER_FIELD === field && seriesNumber?.enable;
  }

  private getColMatrix(): string[][] {
    return zip(
      ...this.columnNodes.map((node) => this.getHeaderNodeMatrix(node)),
    ) as string[][];
  }

  private getValueFromMeta = (meta: CellMeta) => {
    const [, colNode] = getHeaderNodeFromMeta(meta, this.spreadsheet);

    const field = getColNodeFieldFromNode(
      this.spreadsheet.isPivotMode,
      colNode,
    )!;
    const value = this.isSeriesNumberField(field)
      ? meta.rowIndex + 1
      : this.displayData[meta.rowIndex]?.[field];

    const formatter = this.getFormatter({
      field,
      rowIndex: meta.rowIndex,
      colIndex: meta.colIndex,
    });

    return formatter(value);
  };

  getDataMatrixByDataCell(cellMetaMatrix: CellMeta[][]): CopyableList {
    const { copy } = this.spreadsheet.options.interaction!;

    // 因为通过复制数据单元格的方式和通过行列头复制的方式不同，所以不能复用 getDataMatrix 方法
    const dataMatrix = map(cellMetaMatrix, (cellsMeta) =>
      map(cellsMeta, (meta) => convertString(this.getValueFromMeta(meta))),
    ) as string[][];

    if (!copy?.withHeader) {
      return this.matrixTransformer(dataMatrix, this.config.separator);
    }

    const colMatrix = this.getColMatrix();

    return this.matrixTransformer(
      assembleMatrix({ colMatrix, dataMatrix }),
      this.config.separator,
    );
  }

  /**
   * allSelected: false 时，明细表点击 行头/列头 进行复制逻辑
   * allSelected: true 时，明细表点击 全选 进行复制逻辑
   * @deprecated 后续将废弃，使用 asyncProcessSelectedTable 替代
   */
  processSelectedTable(allSelected = false): CopyableList {
    const matrix = this.getDataMatrix();

    if (!allSelected) {
      return this.matrixTransformer(matrix, this.config.separator);
    }

    const colMatrix = this.getColMatrix();

    return this.matrixTransformer(
      assembleMatrix({ colMatrix, dataMatrix: matrix }),
      this.config.separator,
    );
  }

  async asyncProcessSelectedTable(allSelected = false): Promise<CopyableList> {
    const matrix = this.config.async
      ? await this.getDataMatrixRIC()
      : await Promise.resolve(this.getDataMatrix());

    if (!allSelected) {
      return this.matrixTransformer(matrix, this.config.separator);
    }

    const colMatrix = this.getColMatrix();

    return this.matrixTransformer(
      assembleMatrix({ colMatrix, dataMatrix: matrix }),
      this.config.separator,
    );
  }
}

/**
 * 明细表点击行头进行复制逻辑
 * @param {SpreadSheet} spreadsheet
 * @param {CellMeta[]} selectedHeaders
 * @return {CopyableList}
 */
export const processSelectedTableByHeader = (
  spreadsheet: SpreadSheet,
  selectedHeaders: CellMeta[],
): CopyableList => {
  const tableDataCellCopy = new TableDataCellCopy({
    spreadsheet,
    config: {
      selectedCells: selectedHeaders,
    },
  });

  return tableDataCellCopy.processSelectedTable();
};

// 导出全部数据
export const asyncProcessSelectedAllTable = (
  params: CopyAllDataParams,
): Promise<CopyableList> => {
  const { sheetInstance, split, formatOptions, customTransformer, async } =
    params;
  const tableDataCellCopy = new TableDataCellCopy({
    spreadsheet: sheetInstance,
    config: {
      selectedCells: [],
      separator: split,
      formatOptions,
      customTransformer,
      async: async ?? true,
    },
    isExport: true,
  });

  return tableDataCellCopy.asyncProcessSelectedTable(true);
};

// 通过选中数据单元格进行复制
export const processSelectedTableByDataCell = ({
  spreadsheet,
  selectedCells,
  headerSelectedCells,
}: {
  spreadsheet: SpreadSheet;
  selectedCells: CellMeta[][];
  headerSelectedCells: CellMeta[];
}): CopyableList => {
  const tableDataCellCopy = new TableDataCellCopy({
    spreadsheet,
    config: {
      selectedCells: headerSelectedCells,
      formatOptions: true,
    },
  });

  return tableDataCellCopy.getDataMatrixByDataCell(selectedCells);
};
