import { isObject, uniq, forIn, forEach } from 'lodash';
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
    const transformedData = [];
    forEach(data, (dataItem) => {
      let isPushed = false;
      forIn(dataItem, (value, key) => {
        if (isObject(value)) {
          transformedData.push({
            ...dataItem,
            [EXTRA_FIELD]: key,
            [VALUE_FIELD]: value,
          });
          isPushed = true;
        }
      });
      if (!isPushed) {
        transformedData.push(dataItem);
      }
    });
    return {
      data: uniq(transformedData),
      ...restCfg,
    };
  }
}
