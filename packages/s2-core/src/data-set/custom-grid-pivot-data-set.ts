import { EXTRA_FIELD } from '../common/constant';
import type { S2DataConfig } from '../common/interface';
import { CustomTreePivotDataSet } from './custom-tree-pivot-data-set';

export class CustomGridPivotDataSet extends CustomTreePivotDataSet {
  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    const valueInCols = !this.spreadsheet.isCustomRowFields();
    return {
      ...dataCfg,
      fields: {
        ...dataCfg.fields,
        rows: [...dataCfg.fields.rows, EXTRA_FIELD],
        valueInCols,
      },
    };
  }
}
