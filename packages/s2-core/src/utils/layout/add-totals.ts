import { TotalParams } from '@/facet/layout/interface';
import { TotalClass } from '@/facet/layout/total-class';
import { EXTRA_FIELD } from '@/common/constant';

export const addTotals = (params: TotalParams) => {
  const { isFirstField, currentField, fieldValues, spreadsheet, lastField } =
    params;
  const totalsConfig = spreadsheet.getTotalsConfig(
    isFirstField ? currentField : lastField,
  );
  let action: 'unshift' | 'push';
  let totalValue: TotalClass;
  if (totalsConfig?.showGrandTotals && isFirstField) {
    // check to see if grand total is added
    action = totalsConfig.reverseLayout ? 'unshift' : 'push';
    totalValue = new TotalClass(totalsConfig.label, false, true);
  } else if (totalsConfig?.showSubTotals && currentField !== EXTRA_FIELD) {
    action = totalsConfig.reverseSubLayout ? 'unshift' : 'push';
    totalValue = new TotalClass(totalsConfig.subLabel, true);
  }

  fieldValues[action]?.(totalValue);
};
