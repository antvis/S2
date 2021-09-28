import { size } from 'lodash';
import { TotalParams } from '@/facet/layout/interface';
import { TotalClass } from '@/facet/layout/total-class';
import { EXTRA_FIELD } from '@/common/constant';

export const addTotals = (params: TotalParams) => {
  const { isFirstField, currentField, fieldValues, spreadsheet, lastField } =
    params;
  const totalsConfig = spreadsheet.getTotalsConfig(
    isFirstField ? currentField : lastField,
  );
  let func: 'unshift' | 'push';
  let value;
  if (isFirstField) {
    // check to see if grand total is added
    if (totalsConfig.showGrandTotals) {
      func = totalsConfig.reverseLayout ? 'unshift' : 'push';
      value = new TotalClass(totalsConfig.label, false, true);
    }
  } else if (totalsConfig?.showSubTotals && size(fieldValues) > 1) {
    if (currentField !== EXTRA_FIELD) {
      func = totalsConfig.reverseSubLayout ? 'unshift' : 'push';
      value = new TotalClass(totalsConfig.subLabel, true);
    }
  }
  fieldValues[func]?.(value);
};
