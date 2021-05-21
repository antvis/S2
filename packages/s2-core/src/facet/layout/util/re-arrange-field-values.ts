import {
  isArray,
  last,
  find,
  every,
  get,
  isEmpty,
  includes,
  map,
  merge,
} from 'lodash';
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
  if (!isArray(values)) {
    return;
  }
  // find first measure value's sort params
  const measureSort = find(dataSet.sortParams, (o) =>
    includes(values, o.sortFieldId),
  );

  if (measureSort && last(dataSet.fields.rows) !== field) {
    // The most inner field values handle in pivot#_sort#495L
    const { sortMethod, query: colQuery } = measureSort;
    const j = sortMethod === 'ASC' ? 1 : -1;
    const data = map(fieldValues, (value) => {
      const query = merge({}, rowQuery, { [field]: value }, colQuery);
      const rowTotalsConfig = dataSet.getTotalsConfig(field);
      if (rowTotalsConfig.showSubTotals) {
        return dataSet.getData(query);
      }
      // 不展示小计，强制空缺
      return [];
    });
    if (!isEmpty(data) && !every(data, (d) => isEmpty(d))) {
      const sortDatas = data.sort(
        (a, b) =>
          (get(a, [0, VALUE_FIELD], 0) - get(b, [0, VALUE_FIELD], 0)) * j,
      );
      const sortFiledValues = map(sortDatas, (value) => {
        return get(value, [0, field], '');
      });
      fieldValues.splice(0, fieldValues.length);
      fieldValues.push(...sortFiledValues);
    }
  }
}
