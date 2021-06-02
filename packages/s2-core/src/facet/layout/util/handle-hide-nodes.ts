import { each, get } from 'lodash';
import TotalClass from '../total-class';
import { EXTRA_FIELD } from '../../../common/constant/index';
import { SpreadsheetFacetCfg } from '../../../common/interface';

export function handleHideNodes(
  fieldValues: Array<string | TotalClass>,
  field: string,
  cfg: SpreadsheetFacetCfg,
) {
  each(fieldValues, (value) => {
    const hideMeasureColumn = get(cfg, 'colCfg.hideMeasureColumn', false);
    if (hideMeasureColumn && field === EXTRA_FIELD) {
      fieldValues.splice(fieldValues.indexOf(value), 1);
    }
  });
}
