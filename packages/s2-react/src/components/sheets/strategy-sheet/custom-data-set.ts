import {
  CustomGridPivotDataSet,
  type S2DataConfig,
  EXTRA_FIELD,
  type Meta,
  i18n,
} from '@antv/s2';

export class StrategyDataSet extends CustomGridPivotDataSet {
  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const updatedDataCfg = super.processDataCfg(dataCfg);

    const { meta } = updatedDataCfg;

    const extraFieldName =
      this.spreadsheet?.options?.cornerExtraFieldText || i18n('数值');

    const extraFieldMeta: Meta = {
      field: EXTRA_FIELD,
      name: extraFieldName,
    };
    const newMeta: Meta[] = [...meta, extraFieldMeta];

    return {
      ...updatedDataCfg,
      meta: newMeta,
    };
  }
}
