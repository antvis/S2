import {
  CustomTreePivotDataSet,
  type S2DataConfig,
  EXTRA_FIELD,
} from '@antv/s2';

export class StrategyDataSet extends CustomTreePivotDataSet {
  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const updatedDataCfg = super.processDataCfg(dataCfg);

    return {
      ...updatedDataCfg,
      fields: {
        ...updatedDataCfg.fields,
        rows: [...dataCfg.fields.rows, EXTRA_FIELD],
        valueInCols: false,
      },
    };
  }
}
