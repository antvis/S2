import { PivotDataSet } from '@/data-set/pivot-data-set';
import { CellDataParams, DataType } from '@/data-set/interface';
import { S2DataConfig } from '@/common/interface';
import _ from 'lodash';
import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant';

export class CustomTreePivotDataSet extends PivotDataSet {
  getCellData(params: CellDataParams): DataType {
    const { query } = params;
    const { columns, rows } = this.fields;
    const rowDimensionValues = this.getQueryDimValues(rows, query);
    const colDimensionValues = this.getQueryDimValues(columns, query);
    const path = this.getDataPath({ rowDimensionValues, colDimensionValues });
    const data = _.get(this.indexesData, path);
    return data;
  }

  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    // 自定义行头有如下几个特点
    // 1、rows配置必须是空，需要额外添加 $$extra$$ 定位数据（标记指标的id）
    // 2、要有配置 fields.rowCustomTree(行头结构)
    // 3、values 不需要参与计算，默认就在行头结构中
    dataCfg.fields.rows = [EXTRA_FIELD];
    dataCfg.fields.valueInCols = false;
    const { columns } = dataCfg.fields;
    // 将源数据中的value值，映射为 $$extra$$,$$value$$
    // {
    // province: '四川',    province: '四川',
    // city: '成都',   =>   city: '成都',
    // price='11'           price='11'
    //                      $$extra$$=price
    //                      $$value$$=11
    // 此时 province, city 均配置在columns里面
    // }
    dataCfg.data = dataCfg.data.map((datum) => {
      // 正常数据omit后只会唯一存在 value key
      const keys = _.keys(_.omit(datum, columns));
      if (_.size(keys) > 1) {
        throw new Error(`Data type ${datum} is wrong in custom tree mode`);
      }
      const valueKey = keys?.[0] || '';
      return {
        ...datum,
        [EXTRA_FIELD]: valueKey,
        [VALUE_FIELD]: datum[valueKey],
      };
    });
    return dataCfg;
  }
}
