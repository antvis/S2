import { each, filter, hasIn, isFunction, isObject, orderBy } from 'lodash';
import { isAscSort, isDescSort } from '..';
import type { CellMeta } from '../common';
import type { Data, RawData, S2DataConfig } from '../common/interface';
import type { RowData } from '../common/interface/basic';
import { BaseDataSet } from './base-data-set';
import type { DataType, GetCellMultiDataParams } from './interface';

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
  protected getStartFrozenRows(displayData: DataType[]): DataType[] {
     const { rowCount } = this.spreadsheet.options.frozen!;

    if (!rowCount) {
      return [];
    }

    return displayData.slice(0, rowCount);
  }

  /**
   * 返回底部冻结行
   * @returns
   */
  protected getEndFrozenRows(displayData: DataType[]): DataType[] {
    const { trailingRowCount } = this.spreadsheet.options.frozen!;

    // 没有冻结行时返回空数组
    if (!trailingRowCount) {
      return [];
    }


    return displayData.slice(-trailingRowCount);
  }

  protected getDisplayData(displayData: DataType[]): DataType[] {
    const startFrozenRows = this.getStartFrozenRows(displayData);
    const endFrozenRows = this.getEndFrozenRows(displayData);

    const data = displayData.slice(
      startFrozenRows.length || 0,
      -endFrozenRows.length || undefined,
    );

    return [...startFrozenRows, ...data, ...endFrozenRows];
  }

  handleDimensionValueFilter = () => {
    each(this.filterParams, ({ filterKey, filteredValues, customFilter }) => {
      const filteredValuesSet = new Set(filteredValues);
      const defaultFilterFunc = (row: DataType) =>
        !filteredValuesSet.has(row[filterKey]);

      const filteredData = filter(this.displayData, (row) => {
        if (customFilter) {
          return customFilter(row) && defaultFilterFunc(row);
        }
        return defaultFilterFunc(row);
      });

      this.displayData = this.getDisplayData(filteredData);
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

      let data = this.displayData;

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
        ) as RawData[];
      }

      if (restData.length) {
        sortedData = [...sortedData, ...restData];
      }

      // For frozen options
      this.displayData = this.getDisplayData(sortedData);
    });
  };

  public getDimensionValues(): string[] {
    return [];
  }

  public getCellData({ query }: GetCellMultiDataParams): Data {
    if (this.displayData.length === 0 && query['rowIndex'] === 0) {
      return;
    }

    const rowData = this.displayData[query['rowIndex']];

    if (!hasIn(query, 'field') || !isObject(rowData)) {
      return rowData;
    }

    return rowData[query.field];
  }

  public getCellMultiData({query}: GetCellMultiDataParams): DataType[] {
    if (!query) {
      return this.displayData;
    }

    const rowData = this.displayData[query['rowIndex']]
      ? [this.displayData[query['rowIndex']]]
      : this.displayData;

    if (!hasIn(query, 'field')) {
      return rowData;
    }

    return rowData.map((item) => item[query.field]);
  }

  public getRowData(cell: CellMeta): RowData {
    return this.getCellData({
      query: {
        rowIndex: cell.rowIndex,
      },
    });
  }
}
