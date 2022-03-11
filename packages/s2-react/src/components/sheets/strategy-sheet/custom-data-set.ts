import { isObject, map, uniq, forIn } from 'lodash';
import {
  CustomTreePivotDataSet,
  S2DataConfig,
  EXTRA_FIELD,
  VALUE_FIELD,
} from '@antv/s2';

export class StrategyDataSet extends CustomTreePivotDataSet {
  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    dataCfg.fields.rows = [EXTRA_FIELD];
    dataCfg.fields.valueInCols = false;
    const { data, ...restCfg } = dataCfg;
    let transformedData = [];

    transformedData = map(data, (dataItem) => {
      let extraField: string;
      let valueField: object;
      forIn(dataItem, (value, key) => {
        if (isObject(value)) {
          extraField = key;
          valueField = value;
        }
      });
      if (extraField || valueField) {
        return {
          ...dataItem,
          [EXTRA_FIELD]: extraField,
          [VALUE_FIELD]: valueField,
        };
      }
      return dataItem;
    });

    return {
      data: uniq(transformedData),
      ...restCfg,
    };
  }
}
