import { each, orderBy } from 'lodash';
import { CellDataParams, DataType } from './interface';
import { BaseDataSet } from '@/data-set/base-data-set';
import { S2DataConfig } from '@/common/interface';

export class TableDataSet extends BaseDataSet {
  // sorted dimension values
  public sortedDimensionValues: DataType[];

  public processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    return dataCfg;
  }

  public setDataCfg(dataCfg: S2DataConfig) {
    super.setDataCfg(dataCfg);
    this.sortedDimensionValues = this.originData;
    this.handleDimensionValuesSort();
  }

  handleDimensionValuesSort = () => {
    const { frozenRowCount, frozenTrailingRowCount } = this.spreadsheet.options;
    const { sortedDimensionValues } = this;
    each(this.sortParams, (item) => {
      const { sortFieldId, sortBy, sortMethod } = item;
      // 万物排序的前提
      if (!sortFieldId) return;
      // For frozen options
      const startRow = sortedDimensionValues.slice(0, frozenRowCount);
      const endRow = sortedDimensionValues.slice(-frozenTrailingRowCount);
      this.sortedDimensionValues = [
        ...startRow,
        ...orderBy(
          sortedDimensionValues,
          [sortBy || sortFieldId],
          [sortMethod.toLocaleLowerCase() as boolean | 'asc' | 'desc'],
        ),
        ...endRow,
      ];
    });
  };

  public getDimensionValues(field: string, query?: DataType): string[] {
    return [];
  }

  public getCellData({ query }: CellDataParams): DataType {
    return this.sortedDimensionValues[query.rowIndex][query.col];
  }

  public getMultiData(query: DataType, isTotals?: boolean): DataType[] {
    return this.originData;
  }
}
