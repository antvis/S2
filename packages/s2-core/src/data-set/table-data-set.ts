import { each, orderBy, filter, includes, isFunction } from 'lodash';
import { isAscSort, isDescSort } from '..';
import type { S2DataConfig, RawData, Data } from '../common/interface';
import type { CellDataParams, Query } from './interface';
import { BaseDataSet } from './base-data-set';

export class TableDataSet extends BaseDataSet {
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
    if (!frozenRowCount) {
      return [];
    }
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
    if (!frozenTrailingRowCount) {
      return [];
    }
    const { displayData } = this;

    return displayData.slice(-frozenTrailingRowCount);
  }

  /**
   * 返回可移动的非冻结行
   * @returns
   */
  protected getMovableRows(): RawData[] {
    const { displayData } = this;
    const { frozenTrailingRowCount, frozenRowCount } =
      this.spreadsheet.options || {};
    return displayData.slice(
      frozenRowCount || 0,
      -frozenTrailingRowCount! || undefined,
    );
  }

  handleDimensionValueFilter = () => {
    each(this.filterParams, ({ filterKey, filteredValues, customFilter }) => {
      const defaultFilterFunc = (row: Query) =>
        !includes(filteredValues, row[filterKey]);

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

  //  sortFunc > sortBy > sortFieldId
  handleDimensionValuesSort = () => {
    each(this.sortParams, (item) => {
      const { sortFieldId, sortBy, sortFunc, sortMethod, query } = item;
      // 排序的前提
      if (!sortFieldId) {
        return;
      }

      let data = this.getMovableRows();

      const restData: RawData[] = [];
      if (query) {
        const scopedData: RawData[] = [];
        data.forEach((record) => {
          const keys = Object.keys(query);
          let inScope = true;
          for (let index = 0; index < keys.length; index++) {
            const k = keys[index];
            if (record[k] !== query[k]) {
              inScope = false;
              restData.push(record);
              break;
            }
          }

          if (inScope) {
            scopedData.push(record);
          }
        });
        data = scopedData;
      }

      let sortedData = data;

      if (sortFunc) {
        sortedData = sortFunc({
          ...item,
          data,
        }) as RawData[];
      } else if (sortBy && !isFunction(sortBy)) {
        const reversedSortBy = [...sortBy].reverse();
        sortedData = data.sort((a, b) => {
          const idxA = reversedSortBy.indexOf(a[sortFieldId] as string);
          const idxB = reversedSortBy.indexOf(b[sortFieldId] as string);

          return idxB - idxA;
        });
      } else if (isAscSort(sortMethod!) || isDescSort(sortMethod!)) {
        const func = isFunction(sortBy) ? sortBy : null;
        sortedData = orderBy(
          data,
          [func || sortFieldId],
          [sortMethod?.toLocaleLowerCase() as boolean | 'asc' | 'desc'],
        );
      }

      if (restData.length) {
        sortedData = [...sortedData, ...restData];
      }

      // For frozen options
      this.displayData = [
        ...this.getStartRows(),
        ...sortedData,
        ...this.getEndRows(),
      ];
    });
  };

  public getDimensionValues(): string[] {
    return [];
  }

  public getCellData({ query }: CellDataParams): Data {
    if (this.displayData.length === 0 && query.rowIndex === 0) {
      return;
    }

    const rowData = this.displayData[query.rowIndex];

    if (!('col' in query)) {
      return rowData as Data;
    }
    return rowData[query.col] as unknown as Data;
  }

  public getMultiData(): Data[] {
    return this.displayData as Data[];
  }
}
