import {
  CustomTreePivotDataSet,
  i18n,
  type Meta,
  type S2DataConfig,
} from '@antv/s2';

export class StrategyDataSet extends CustomTreePivotDataSet {
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
