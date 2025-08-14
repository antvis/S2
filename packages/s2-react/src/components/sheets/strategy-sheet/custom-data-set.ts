import {
  CustomGridPivotDataSet,
  EMPTY_EXTRA_FIELD_PLACEHOLDER,
  EXTRA_FIELD,
  i18n,
  type Meta,
  type RawData,
  type S2DataConfig,
} from '@antv/s2';
import { isEmpty, isObject, keys } from 'lodash';

export class StrategySheetDataSet extends CustomGridPivotDataSet {
  getExistValuesByDataItem(data: RawData) {
    const result = keys(data).filter((key) => isObject(data[key]));

    if (isEmpty(result)) {
      result.push(EMPTY_EXTRA_FIELD_PLACEHOLDER);
    }

    return result;
  }

  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const updatedDataCfg = super.processDataCfg(dataCfg);

    const newMeta: Meta[] = this.processMeta(dataCfg.meta, i18n('数值'));

    return {
      ...updatedDataCfg,
      meta: newMeta,
      fields: {
        ...updatedDataCfg.fields,
        rows: [...(dataCfg.fields.rows || []), EXTRA_FIELD],
      },
    };
  }
}
