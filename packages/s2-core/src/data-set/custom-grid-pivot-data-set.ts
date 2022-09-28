import { forEach, has, intersection, isEmpty, keys, uniq } from 'lodash';
import { EXTRA_FIELD, VALUE_FIELD } from '../common/constant';
import type { S2DataConfig } from '../common/interface';
import { CustomTreePivotDataSet } from './custom-tree-pivot-data-set';

export class CustomGridPivotDataSet extends CustomTreePivotDataSet {
  processDataCfg(dataCfg: S2DataConfig): S2DataConfig {
    dataCfg.fields.rows = [...dataCfg.fields.rows, EXTRA_FIELD];
    dataCfg.fields.valueInCols = false;

    const { data, ...restCfg } = dataCfg;
    const { values } = dataCfg.fields;

    const transformedData = [];
    forEach(data, (dataItem) => {
      if (isEmpty(intersection(keys(dataItem), values))) {
        transformedData.push(dataItem);
      } else {
        forEach(values, (value) => {
          if (has(dataItem, value)) {
            transformedData.push({
              ...dataItem,
              [EXTRA_FIELD]: value,
              [VALUE_FIELD]: dataItem[value],
            });
          }
        });
      }
    });

    return {
      data: uniq(transformedData),
      ...restCfg,
    };
  }
}
