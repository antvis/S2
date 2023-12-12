import {
  CustomTreePivotDataSet,
  EMPTY_EXTRA_FIELD_PLACEHOLDER,
  i18n,
  type DataType,
  type Meta,
  type S2DataConfig,
} from '@antv/s2';
import { isEmpty, isObject, keys } from 'lodash';

export class StrategyDataSet extends CustomTreePivotDataSet {
  getExistValuesByDataItem(data: DataType, values: string[]) {
    const result = keys(data).filter((key) => isObject(data[key]));

    if (isEmpty(result)) {
      result.push(EMPTY_EXTRA_FIELD_PLACEHOLDER);
    }

    return result;
  }

  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const { meta } = dataCfg;
    const updatedDataCfg = super.processDataCfg(dataCfg);

    const newMeta: Meta[] = this.processMeta(meta, i18n('数值'));

    return {
      ...updatedDataCfg,
      meta: newMeta,
    };
  }
}
