import { forEach, get, has, intersection, isEmpty, keys, uniq } from 'lodash';
import { EXTRA_FIELD, VALUE_FIELD } from '../common/constant';
import type { S2DataConfig } from '../common/interface';
import {
  getDataPath,
  getQueryDimValues,
} from '../utils/dataset/pivot-data-set';
import { CustomTreePivotDataSet } from './custom-tree-pivot-data-set';
import type { CellDataParams, DataType } from './interface';

export class CustomGridPivotDataSet extends CustomTreePivotDataSet {
  getCellData(params: CellDataParams): DataType {
    const { query } = params;
    const { columns, rows } = this.fields;
    const rowDimensionValues = getQueryDimValues(rows, query);
    const colDimensionValues = getQueryDimValues(columns, query);
    const path = getDataPath({
      rowDimensionValues,
      colDimensionValues,
      rowPivotMeta: this.rowPivotMeta,
      colPivotMeta: this.colPivotMeta,
      isFirstCreate: true,
      careUndefined: true,
      rowFields: rows,
      colFields: columns,
    });
    const data = get(this.indexesData, path);
    return data;
  }

  // setDataCfg(dataCfg: S2DataConfig) {
  //   super.setDataCfg(dataCfg);
  //   this.sortedDimensionValues = {};
  //   this.rowPivotMeta = new Map();
  //   this.colPivotMeta = new Map();

  //   const { rows, columns } = this.fields;
  //   const { indexesData } = transformIndexesData({
  //     rows,
  //     columns,
  //     originData: this.originData,
  //     totalData: [], // 自定义目录树没有 totalData 概念
  //     indexesData: this.indexesData,
  //     sortedDimensionValues: this.sortedDimensionValues,
  //     rowPivotMeta: this.rowPivotMeta,
  //     colPivotMeta: this.colPivotMeta,
  //   });
  //   this.indexesData = indexesData;

  //   this.handleDimensionValuesSort();
  // }

  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    dataCfg.fields.rows = [...dataCfg.fields.rows, EXTRA_FIELD];
    dataCfg.fields.valueInCols = false;
    const { data, ...restCfg } = dataCfg;
    const { values } = dataCfg.fields;

    const transformedData = [];
    forEach(data, (dataItem) => {
      if (isEmpty(intersection(keys(dataItem), values))) {
        transformedData.push(dataItem);
      } else {
        forEach(values, (value) => {
          if (has(dataItem, value)) {
            transformedData.push({
              ...dataItem,
              [EXTRA_FIELD]: value,
              [VALUE_FIELD]: dataItem[value],
            });
          }
        });
      }
    });

    return {
      data: uniq(transformedData),
      ...restCfg,
    };
  }
}
