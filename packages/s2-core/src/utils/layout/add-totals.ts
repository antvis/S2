import _ from 'lodash';
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
  if (isFirstField) {
    // check to see if grand total is added
    if (totalsConfig?.showGrandTotals) {
      action = totalsConfig.reverseLayout ? 'unshift' : 'push';
      totalValue = new TotalClass(totalsConfig.label, false, true);
    }
  } else if (
    /**
     * 是否需要展示小计项
     * 1. showSubTotals 属性为真
     * 2. 子维度个数 > 1 或 showSubTotals.always 不为 false（undefined 认为是 true）
     */
    totalsConfig?.showSubTotals &&
    (_.size(fieldValues) > 1 ||
      _.get(totalsConfig, 'showSubTotals.always') !== false) &&
    currentField !== EXTRA_FIELD
  ) {
    action = totalsConfig.reverseSubLayout ? 'unshift' : 'push';
    totalValue = new TotalClass(totalsConfig.subLabel, true);
  }

  fieldValues[action]?.(totalValue);
};
