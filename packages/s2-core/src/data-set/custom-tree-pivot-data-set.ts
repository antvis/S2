import { forEach, get, has, intersection, isEmpty, keys, uniq } from 'lodash';
import { EXTRA_FIELD, VALUE_FIELD } from '../common/constant';
import type { S2DataConfig } from '../common/interface';
import {
  getDataPath,
  transformDimensionsValues,
  transformIndexesData,
} from '../utils/dataset/pivot-data-set';
import type { CellDataParams, DataType } from './interface';
import { PivotDataSet } from './pivot-data-set';

export class CustomTreePivotDataSet extends PivotDataSet {
  getCellData(params: CellDataParams): DataType {
    const { query } = params;
    const { columns, rows } = this.fields;
    const rowDimensionValues = transformDimensionsValues(query, rows);
    const colDimensionValues = transformDimensionsValues(query, columns);
    const path = getDataPath({
      rowDimensionValues,
      colDimensionValues,
      rowPivotMeta: this.rowPivotMeta,
      colPivotMeta: this.colPivotMeta,
    });
    const data = get(this.indexesData, path);
    return data;
  }

  setDataCfg(dataCfg: S2DataConfig) {
    super.setDataCfg(dataCfg);
    this.sortedDimensionValues = {};
    this.rowPivotMeta = new Map();
    this.colPivotMeta = new Map();

    const { rows, columns, values } = this.fields;
    const { indexesData } = transformIndexesData({
      rows,
      columns,
      values,
      originData: this.originData,
      totalData: [], // 自定义目录树没有 totalData 概念
      indexesData: this.indexesData,
      sortedDimensionValues: this.sortedDimensionValues,
      rowPivotMeta: this.rowPivotMeta,
      colPivotMeta: this.colPivotMeta,
    });
    this.indexesData = indexesData;

    this.handleDimensionValuesSort();
  }

  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    // 自定义行头有如下几个特点
    // 1、rows配置必须是空，需要额外添加 $$extra$$ 定位数据（标记指标的id）
    // 2、要有配置 fields.rowCustomTree(行头结构)
    // 3、values 不需要参与计算，默认就在行头结构中
    dataCfg.fields.rows = [EXTRA_FIELD];
    dataCfg.fields.valueInCols = false;
    const { data, ...restCfg } = dataCfg;
    const { values } = dataCfg.fields;
    // 将源数据中的value值，映射为 $$extra$$,$$value$$
    // {
    // province: '四川',    province: '四川',
    // city: '成都',   =>   city: '成都',
    // price='11'           price='11'
    //                      $$extra$$=price
    //                      $$value$$=11
    // 此时 province, city 均配置在columns里面
    // }
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
