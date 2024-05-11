import { each, filter, hasIn, isFunction, isObject, orderBy } from 'lodash';
import { getEmptyPlaceholder, isAscSort, isDescSort } from '..';
import type { CellMeta } from '../common';
import type { S2DataConfig } from '../common/interface';
import type { RowData } from '../common/interface/basic';
import { BaseDataSet } from './base-data-set';
import type { CellDataParams, DataType, Query } from './interface';

export class TableDataSet extends BaseDataSet {
  // data that goes into canvas (aka sorted & filtered)
  protected declare displayData: DataType[];

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
    const { frozenRowCount } = this.spreadsheet.options || {};
    if (!frozenRowCount) {
      return [];
    }

    return displayData.slice(0, frozenRowCount);
  }

  /**
   * 返回底部冻结行
   * @returns
   */
  protected getEndFrozenRows(displayData: DataType[]): DataType[] {
    const { frozenTrailingRowCount } = this.spreadsheet.options || {};
    if (!frozenTrailingRowCount) {
      return [];
    }

    return displayData.slice(-frozenTrailingRowCount);
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

      const restData = [];
      if (query) {
        const scopedData = [];
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
        }) as DataType[];
      } else if (sortBy && !isFunction(sortBy)) {
        const reversedSortBy = [...sortBy].reverse();
        sortedData = data.sort((a, b) => {
          const idxA = reversedSortBy.indexOf(a[sortFieldId]);
          const idxB = reversedSortBy.indexOf(b[sortFieldId]);

          return idxB - idxA;
        });
      } else if (isAscSort(sortMethod) || isDescSort(sortMethod)) {
        const placeholder = getEmptyPlaceholder(
          this.spreadsheet,
          this.spreadsheet.options?.placeholder,
        );
        const customSortBy = isFunction(sortBy) ? sortBy : null;
        const customSort = (record: DataType) => {
          // 空值占位符按最小值处理 https://github.com/antvis/S2/issues/2707
          if (record[sortFieldId] === placeholder) {
            return Number.MIN_VALUE;
          }

          return record[sortFieldId];
        };

        sortedData = orderBy(
          data,
          [customSortBy || customSort],
          [sortMethod.toLocaleLowerCase() as boolean | 'asc' | 'desc'],
        );
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

  public getCellData({ query }: CellDataParams): DataType {
    if (this.displayData.length === 0 && query.rowIndex === 0) {
      return;
    }

    const rowData = this.displayData[query.rowIndex];

    if (!hasIn(query, 'field') || !isObject(rowData)) {
      return rowData;
    }
    return rowData[query.field];
  }

  public getMultiData(query: Query): DataType[] {
    if (!query) {
      return this.displayData;
    }

    const rowData = this.displayData[query.rowIndex]
      ? [this.displayData[query.rowIndex]]
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
