import {
  CustomTreePivotDataSet,
  type S2DataConfig,
  EXTRA_FIELD,
} from '@antv/s2';
import { size } from 'lodash';

export class StrategyDataSet extends CustomTreePivotDataSet {
  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const updatedDataCfg = super.processDataCfg(dataCfg);
    // 多指标数值挂行头，单指标挂列头
    const valueInCols = size(updatedDataCfg?.fields?.values) <= 1;

    return {
      ...updatedDataCfg,
      fields: {
        ...updatedDataCfg.fields,
        rows: [...dataCfg.fields.rows, EXTRA_FIELD],
        valueInCols,
      },
    };
  }
}
