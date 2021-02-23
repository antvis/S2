/**
 * Create By Bruce Too
 * On 2020-02-25
 */
import { get, isEmpty, mix } from '@antv/util';
import * as _ from 'lodash';
import { VALUE_FIELD } from '../../../common/constant';
import { SpreadDataSet } from '../../../data-set';
import TotalClass from '../total-class';

export function reArrangeFieldValues(
  rowQuery: Record<string, any>,
  field: string,
  fieldValues: (string | TotalClass)[],
  dataSet: SpreadDataSet,
) {
  const { fields } = dataSet;
  const { values } = fields;
  if (!_.isArray(values)) {
    return;
  }
  // find first measure value's sort params
  const measureSort = _.find(dataSet.sortParams, (o) =>
    _.includes(values, o.sortFieldId),
  );

  if (measureSort && _.last(dataSet.fields.rows) !== field) {
    // The most inner field values handle in pivot#_sort#495L
    const { sortFieldId, sortMethod, query: colQuery } = measureSort;
    const j = sortMethod === 'ASC' ? 1 : -1;
    const data = _.map(fieldValues, (value) => {
      const query = mix({}, rowQuery, { [field]: value }, colQuery);
      const rowTotalsConfig = dataSet.pivot.getTotalsConfig(field);
      if (rowTotalsConfig.showSubTotals) {
        return dataSet.getData(query, {
          row: {
            isTotals: true,
            isGrandTotals: false,
            isSubTotals: true,
          },
          col: {
            isTotals: false,
            isGrandTotals: false,
            isSubTotals: false,
          },
        });
      }
      // 不展示小计，强制空缺
      return [];
    });
    if (!isEmpty(data) && !_.every(data, (d) => isEmpty(d))) {
      const sortDatas = data.sort(
        (a, b) =>
          (get(a, [0, VALUE_FIELD], 0) - get(b, [0, VALUE_FIELD], 0)) * j,
      );
      const sortFiledValues = _.map(sortDatas, (value) => {
        return get(value, [0, field], '');
      });
      fieldValues.splice(0, fieldValues.length);
      fieldValues.push(...sortFiledValues);
    }
  }
}
