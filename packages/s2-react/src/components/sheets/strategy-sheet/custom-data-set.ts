import {
  CustomTreePivotDataSet,
<<<<<<< HEAD
  type S2DataConfig,
  EXTRA_FIELD,
} from '@antv/s2';
import { size } from 'lodash';

export class StrategySheetDataSet extends CustomTreePivotDataSet {
  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const updatedDataCfg = super.processDataCfg(dataCfg);
    // 多指标数值挂行头，单指标挂列头
    const valueInCols = size(updatedDataCfg?.fields?.values) <= 1;

    return {
      ...updatedDataCfg,
      fields: {
        ...updatedDataCfg.fields,
        rows: [...(dataCfg.fields.rows || []), EXTRA_FIELD],
        valueInCols,
      },
=======
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
>>>>>>> origin/master
    };
  }
}
