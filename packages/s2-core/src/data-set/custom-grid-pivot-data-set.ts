import { EXTRA_FIELD, i18n } from '../common';
import type { S2DataConfig } from '../common/interface';
import { PivotDataSet } from './pivot-data-set';

export class CustomGridPivotDataSet extends PivotDataSet {
  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const valueInCols = !this.spreadsheet.isCustomRowFields();
    const originalRows = dataCfg.fields.rows || [];
    const rows = valueInCols ? originalRows : [...originalRows, EXTRA_FIELD];
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
