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
    this.handleDimensionValueFilter();
    this.handleDimensionValuesSort();
  }

  /**
   * 返回顶部冻结行
   * @returns
   */
  protected getStartRows() {
    const { frozenRowCount } = this.spreadsheet.options || {};
    if (!frozenRowCount) return [];
    const { displayData } = this;
    return displayData.slice(0, frozenRowCount);
  }

  /**
   * 返回底部冻结行
   * @returns
   */
  protected getEndRows() {
    const { frozenTrailingRowCount } = this.spreadsheet.options || {};
    // 没有冻结行时返回空数组
    if (!frozenTrailingRowCount) return [];
    const { displayData } = this;

    return displayData.slice(-frozenTrailingRowCount);
  }

  /**
   * 返回可移动的非冻结行
   * @returns
   */
  protected getMovableRows() {
    const { displayData } = this;
    const { frozenTrailingRowCount, frozenRowCount } =
      this.spreadsheet.options || {};
    return displayData.slice(
      frozenRowCount || 0,
      -frozenTrailingRowCount || undefined,
    );
  }

  handleDimensionValueFilter = () => {
    each(this.filterParams, ({ filterKey, filteredValues, customFilter }) => {
      const defaultFilterFunc = (row: DataType) =>
        row[filterKey] && !includes(filteredValues, row[filterKey]);
      this.displayData = [
        ...this.getStartRows(),
        ...filter(this.getMovableRows(), (row) => {
          if (customFilter) {
            return customFilter(row) && defaultFilterFunc(row);
          }
          return defaultFilterFunc(row);
        }),
        ...this.getEndRows(),
      ];
    });
  };

  handleDimensionValuesSort = () => {
    each(this.sortParams, (item) => {
      const { sortFieldId, sortBy, sortMethod } = item;
      // 万物排序的前提
      if (!sortFieldId || !sortMethod) return;
      // For frozen options
      this.displayData = [
        ...this.getStartRows(),
        ...orderBy(
          this.getMovableRows(),
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
    if (this.displayData.length === 0 && query.rowIndex === 0) {
      return;
    }
    return this.displayData[query.rowIndex][query.col];
  }

  public getMultiData(query: DataType, isTotals?: boolean): DataType[] {
    return this.displayData;
  }
}
