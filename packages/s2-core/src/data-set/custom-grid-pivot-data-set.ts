import { EXTRA_FIELD, i18n } from '../common';
import type { S2DataConfig } from '../common/interface';
import { CustomTreePivotDataSet } from './custom-tree-pivot-data-set';

export class CustomGridPivotDataSet extends CustomTreePivotDataSet {
  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const valueInCols = !this.spreadsheet.isCustomRowFields();
    const rows = valueInCols
      ? [EXTRA_FIELD]
      : [...(dataCfg.fields.rows || []), EXTRA_FIELD];
    const meta = this.processMeta(dataCfg.meta!, i18n('数值'));

    return {
      ...dataCfg,
      meta,
      fields: {
        ...dataCfg.fields,
        rows,
        valueInCols,
      },
    };
  }
}
