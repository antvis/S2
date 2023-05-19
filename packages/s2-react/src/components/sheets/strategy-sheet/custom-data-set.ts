import { isObject, uniq, forIn, forEach } from 'lodash';
import {
  CustomTreePivotDataSet,
  type S2DataConfig,
  EXTRA_FIELD,
  VALUE_FIELD,
  type Meta,
  i18n,
} from '@antv/s2';

export class StrategyDataSet extends CustomTreePivotDataSet {
  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    dataCfg.fields.valueInCols = false;
    const { data, meta, ...restCfg } = dataCfg;
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

    const newMeta: Meta[] = this.processMeta(meta, i18n('数值'));

    return {
      data: uniq(transformedData),
      meta: newMeta,
      ...restCfg,
      fields: {
        ...dataCfg.fields,
        rows: [EXTRA_FIELD],
      },
    };
  }
}
