import {
  CustomTreePivotDataSet,
  type S2DataConfig,
  EXTRA_FIELD,
  EMPTY_EXTRA_FIELD_PLACEHOLDER,
  type RawData,
  type Meta,
  i18n,
} from '@antv/s2';
import { isEmpty, isObject, keys, size } from 'lodash';

export class StrategySheetDataSet extends CustomTreePivotDataSet {
  getExistValuesByDataItem(data: RawData) {
    const result = keys(data).filter((key) => isObject(data[key]));

    if (isEmpty(result)) {
      result.push(EMPTY_EXTRA_FIELD_PLACEHOLDER);
    }

    return result;
  }

  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const updatedDataCfg = super.processDataCfg(dataCfg);
    // 多指标数值挂行头，单指标挂列头
    const valueInCols = size(updatedDataCfg?.fields?.values) <= 1;

    const newMeta: Meta[] = this.processMeta(dataCfg.meta, i18n('数值'));

    return {
      ...updatedDataCfg,
      meta: newMeta,
      fields: {
        ...updatedDataCfg.fields,
        rows: [...(dataCfg.fields.rows || []), EXTRA_FIELD],
        valueInCols,
      },
    };
  }
}
