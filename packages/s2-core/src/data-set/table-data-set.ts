/* eslint-disable @typescript-eslint/no-unused-vars */
import { each, orderBy, filter, includes } from 'lodash';
import { CellDataParams, DataType } from './interface';
import { BaseDataSet } from '@/data-set/base-data-set';
import { S2DataConfig } from '@/common/interface';

export class TableDataSet extends BaseDataSet {
  // data that goes into canvas (aka sorted & filtered)
  protected displayData: DataType[];

  public processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    return dataCfg;
  }

  public setDataCfg(dataCfg: S2DataConfig) {
    super.setDataCfg(dataCfg);
    this.handleDimensionValuesSort();
    this.handleDimensionValueFilter();
  }

  protected getStartRows() {
    const { frozenRowCount } = this.spreadsheet.options || {};
    const { displayData } = this;
    return displayData.slice(0, frozenRowCount);
  }

  protected getEndRows() {
    const { frozenTrailingRowCount } = this.spreadsheet.options || {};
    const { displayData } = this;
    return displayData.slice(-frozenTrailingRowCount);
  }

  handleDimensionValueFilter = () => {
    const { displayData } = this;
    each(this.filterParams, ({ filterKey, filteredValues }) => {
      this.displayData = [
        ...this.getStartRows(),
        ...filter(
          displayData,
          (row) => row[filterKey] && !includes(filteredValues, row[filterKey]),
        ),
        ...this.getEndRows(),
      ];
    });
  };

  handleDimensionValuesSort = () => {
    const { displayData } = this;
    each(this.sortParams, (item) => {
      const { sortFieldId, sortBy, sortMethod } = item;
      // 万物排序的前提
      if (!sortFieldId) return;
      // For frozen options
      this.displayData = [
        ...this.getStartRows(),
        ...orderBy(
          displayData,
          [sortBy || sortFieldId],
          [sortMethod.toLocaleLowerCase() as boolean | 'asc' | 'desc'],
        ),
        ...this.getEndRows(),
      ];
    });
  };

  public getDimensionValues(field: string, query?: DataType): string[] {
    return [];
  }

  public getCellData({ query }: CellDataParams): DataType {
    return this.displayData[query.rowIndex][query.col];
  }

  public getMultiData(query: DataType, isTotals?: boolean): DataType[] {
    return this.displayData;
  }
}
