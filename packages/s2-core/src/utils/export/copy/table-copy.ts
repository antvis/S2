import { map } from 'lodash';
import type { SpreadSheet } from '../../../sheet-type';
import {
  type CellMeta,
  type RawData,
  getDefaultSeriesNumberText,
  SERIES_NUMBER_FIELD,
  AsyncRenderThreshold,
} from '../../../common';
import type { Node } from '../../../facet/layout/node';
import type {
  CopyableList,
  CopyAllDataParams,
  SheetCopyConstructorParams,
} from '../../../common/interface/export';
import {
  convertString,
  getColNodeFieldFromNode,
  getSelectedCols,
  getSelectedRows,
} from '../method';
import { assembleMatrix, getFormatter } from './common';
import { getHeaderNodeFromMeta } from './core';
import { BaseDataCellCopy } from './base-data-cell-copy';

class TableDataCellCopy extends BaseDataCellCopy {
  private displayData: RawData[];

  private columnNodes: Node[];

  constructor(params: SheetCopyConstructorParams) {
    super(params);

    this.displayData = this.getSelectedDisplayData();
    this.columnNodes = this.getSelectedColNodes();
  }

  private getSelectedColNodes(): Node[] {
    const selectedCols = getSelectedCols(this.config.selectedCells);
    const allColNodes = this.spreadsheet.facet.getColNodes();

    if (selectedCols.length === 0) {
      return allColNodes;
    }

    return map(selectedCols, (meta) => allColNodes[meta.colIndex]);
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
      this.columnNodes.map((node) => {
        const field = node?.field;

        if (SERIES_NUMBER_FIELD === field && seriesNumber?.enable) {
          return (i + 1).toString();
        }

        const formatter = getFormatter(
          field,
          this.config.formatData,
          this.spreadsheet.dataSet,
        );
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
          let count = AsyncRenderThreshold;
          const rowLength = this.displayData.length;

          while (
            deadline.timeRemaining() > 0 &&
            count > 0 &&
            rowIndex < rowLength - 1
          ) {
            for (let j = rowIndex; j < rowLength && count > 0; j++) {
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

                const formatter = getFormatter(
                  field,
                  this.config.formatData,
                  this.spreadsheet.dataSet,
                );
                const value = rowData[field];
                const dataItem = formatter(value);

                row.push(dataItem as string);
              }
              rowIndex = j;
              result.push(row);
              count--;
            }
          }

          if (rowIndex === rowLength - 1) {
            resolve(result);
          } else {
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

  private getColMatrix(): string[] {
    const { formatHeader } = this.config;

    // 明细表的表头，没有格式化
    return this.columnNodes.map((node) => {
      const field: string = node.field;

      if (!formatHeader) {
        return field;
      }

      return this.isSeriesNumberField(field)
        ? getDefaultSeriesNumberText()
        : this.spreadsheet.dataSet.getFieldName(field);
    }) as string[];
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

    const formatter = getFormatter(
      field!,
      this.config.formatData,
      this.spreadsheet.dataSet,
    );

    return formatter(value);
  };

  getDataMatrixByDataCell(cellMetaMatrix: CellMeta[][]): CopyableList {
    const { copy } = this.spreadsheet.options.interaction!;

    // 因为通过复制数据单元格的方式和通过行列头复制的方式不同，所以不能复用 getDataMatrix 方法
    const dataMatrix = map(cellMetaMatrix, (cellsMeta) =>
      map(cellsMeta, (it) => convertString(this.getValueFromMeta(it))),
    ) as string[][];

    if (!copy?.withHeader) {
      return this.matrixTransformer(dataMatrix, this.config.separator);
    }

    const colMatrix = this.getColMatrix();

    return this.matrixTransformer(
      assembleMatrix({ colMatrix: [colMatrix], dataMatrix }),
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
      assembleMatrix({ colMatrix: [colMatrix], dataMatrix: matrix }),
      this.config.separator,
    );
  }

  async asyncProcessSelectedTable(allSelected = false): Promise<CopyableList> {
    const matrix = this.config.isAsyncExport
      ? await this.getDataMatrixRIC()
      : await Promise.resolve(this.getDataMatrix());

    if (!allSelected) {
      return this.matrixTransformer(matrix, this.config.separator);
    }

    const colMatrix = this.getColMatrix();

    return this.matrixTransformer(
      assembleMatrix({ colMatrix: [colMatrix], dataMatrix: matrix }),
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
  const {
    sheetInstance,
    split,
    formatOptions,
    customTransformer,
    isAsyncExport,
  } = params;
  const tableDataCellCopy = new TableDataCellCopy({
    spreadsheet: sheetInstance,
    config: {
      selectedCells: [],
      separator: split,
      formatOptions,
      customTransformer,
      isAsyncExport: true ?? isAsyncExport,
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
