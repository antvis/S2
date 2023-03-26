import { map } from 'lodash';
import type { SpreadSheet } from '../../../sheet-type';
import {
  type CellMeta,
  type RawData,
  getDefaultSeriesNumberText,
  SERIES_NUMBER_FIELD,
  type Data,
} from '../../../common';
import type { Node } from '../../../facet/layout/node';
import type {
  CopyableList,
  CopyAndExportUnifyConfig,
  CopyOrExportConfig,
  FormatOptions,
} from '../interface';
import { convertString, getSelectedCols, getSelectedRows } from '../method';
import {
  assembleMatrix,
  getFormatOptions,
  getFormatter,
  matrixHtmlTransformer,
  matrixPlainTextTransformer,
  unifyConfig,
} from './common';
import { getValueFromMeta } from '@/utils/export/copy/core';

class TableDataCellCopy {
  private readonly spreadsheet: SpreadSheet;

  private config: CopyAndExportUnifyConfig;

  private displayData: RawData[];

  private columnNodes: Node[];

  constructor(params: {
    spreadsheet: SpreadSheet;
    config: CopyOrExportConfig;
    isExport?: boolean;
  }) {
    const { spreadsheet, isExport = false, config } = params;

    this.spreadsheet = spreadsheet;
    this.config = unifyConfig(config, spreadsheet, isExport);
    this.displayData = this.getSelectedDisplayData();
    this.columnNodes = this.getSelectedColNodes();
  }

  private getSelectedColNodes(): Node[] {
    const selectedCols = getSelectedCols(this.config.selectedCells);
    const allColNodes = this.spreadsheet.getColumnNodes();

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
    const { showSeriesNumber } = this.spreadsheet.options;

    return this.displayData.map((row, i) =>
      this.columnNodes.map((node) => {
        const field = node.field;

        if (SERIES_NUMBER_FIELD === field && showSeriesNumber) {
          return (i + 1).toString();
        }

        const formatter = getFormatter(
          this.spreadsheet,
          field,
          this.config.isFormatData,
        );
        const value = row[field];

        return formatter(value);
      }),
    ) as string[][];
  }

  getDataMatrixByDataCell(
    cellMetaMatrix: CellMeta[][],
    displayData: Data[],
    spreadsheet: SpreadSheet,
  ): CopyableList {
    const { copyWithHeader } = spreadsheet.options.interaction!;

    const dataMatrix = map(cellMetaMatrix, (cellsMeta) =>
      map(cellsMeta, (it) =>
        convertString(getValueFromMeta(it, displayData, spreadsheet)),
      ),
    ) as string[][];

    if (!copyWithHeader) {
      return [
        matrixPlainTextTransformer(dataMatrix),
        matrixHtmlTransformer(dataMatrix),
      ];
    }

    // 明细表的表头，没有格式化
    const colMatrix = this.columnNodes.map((node) => {
      const field: string = node.field;

      return spreadsheet.dataSet.getFieldName(field);
    }) as string[];

    return assembleMatrix({ colMatrix: [colMatrix], dataMatrix });
  }

  /**
   * 明细表点击 行头/列头 进行复制逻辑
   * @return {CopyableList}
   */
  processTableSelected = (): CopyableList => {
    const matrix = this.getDataMatrix();

    return [matrixPlainTextTransformer(matrix), matrixHtmlTransformer(matrix)];
  };

  processTableAllSelected = (
    spreadsheet: SpreadSheet,
    split: string,
    formatOptions?: FormatOptions,
  ): CopyableList => {
    const { isFormatHeader } = getFormatOptions(formatOptions);
    const { showSeriesNumber } = this.spreadsheet.options;

    // 明细表的表头，没有格式化
    const colMatrix = this.columnNodes.map((node) => {
      const field: string = node.field;

      if (!isFormatHeader) {
        return field;
      }

      return SERIES_NUMBER_FIELD === field && showSeriesNumber
        ? getDefaultSeriesNumberText()
        : spreadsheet.dataSet.getFieldName(field);
    }) as string[];

    const dataMatrix = this.getDataMatrix();

    return assembleMatrix({ colMatrix: [colMatrix], dataMatrix });
  };
}

export const processTableColSelected = (
  spreadsheet: SpreadSheet,
  selectedCols: CellMeta[],
): CopyableList => {
  const tableDataCellCopy = new TableDataCellCopy({
    spreadsheet,
    config: { selectedCells: selectedCols },
  });

  return tableDataCellCopy.processTableSelected();
};

/**
 * 明细表点击行头进行复制逻辑
 * @param {SpreadSheet} spreadsheet
 * @param {CellMeta[]} selectedRows
 * @return {CopyableList}
 */
export const processTableRowSelected = (
  spreadsheet: SpreadSheet,
  selectedRows: CellMeta[],
): CopyableList => {
  const tableDataCellCopy = new TableDataCellCopy({
    spreadsheet,
    config: {
      selectedCells: selectedRows,
    },
  });

  return tableDataCellCopy.processTableSelected();
};

export const processTableAllSelected = (
  spreadsheet: SpreadSheet,
  split: string,
  formatOptions?: FormatOptions,
): CopyableList => {
  const tableDataCellCopy = new TableDataCellCopy({
    spreadsheet,
    config: {
      selectedCells: [],
      separator: split,
      formatOptions,
    },
    isExport: true,
  });

  return tableDataCellCopy.processTableAllSelected(
    spreadsheet,
    split,
    formatOptions,
  );
};

export const processTableSelectedByDataCell = ({
  spreadsheet,
  selectedCells,
  displayData,
  headerSelectedCells,
}: {
  spreadsheet: SpreadSheet;
  selectedCells: CellMeta[][];
  displayData: Data[];
  headerSelectedCells: CellMeta[];
}): CopyableList => {
  const tableDataCellCopy = new TableDataCellCopy({
    spreadsheet,
    config: {
      selectedCells: headerSelectedCells,
    },
  });

  return tableDataCellCopy.getDataMatrixByDataCell(
    selectedCells,
    displayData,
    spreadsheet,
  );
};
