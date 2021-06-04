import { BaseDataSet, BaseParams } from './base-data-set';
import { processIrregularData } from '../utils/get-irregular-data';
import { S2DataConfig } from '../common/interface';
import { isEmpty, each, isArray } from 'lodash';
import { EXTRA_FIELD, VALUE_FIELD } from '../common/constant';

export class StrategyDataSet extends BaseDataSet<BaseParams> {
  constructor(params: BaseParams) {
    super(params);
  }

  protected preProcess(dataCfg: S2DataConfig): S2DataConfig {
    const newDataCfg = processIrregularData(dataCfg);
    const { data = [], meta, fields, sortParams = [] } = newDataCfg;
    const { columns, rows, values } = fields;
    let newRows = rows;
    let newColumns = columns;
    const newData = [];
    if (isEmpty(rows)) {
      // 没行度量的情况，行是有value来决定
      if (isArray(values)) {
        // 决策模式下 只存在数值挂在行头，且是树形结构
        newData.push(...data);
      } else {
        newRows = values.fields;
        newColumns = [...columns];
        // eslint-disable-next-line no-restricted-syntax
        for (const datum of data) {
          if (!isEmpty(values.data)) {
            each(values.data, (value) => {
              newData.push({
                ...datum,
                ...value,
              });
            });
          } else {
            newData.push({
              ...datum,
            });
          }
        }
      }
    } else {
      newRows = [...rows, EXTRA_FIELD];
      // 有行度量的情况，行自动解析，将值度量置于行下方
      // eslint-disable-next-line no-restricted-syntax
      for (const datum of data) {
        if (!isEmpty(values)) {
          each(values, (value: string) => {
            newData.push({
              ...datum,
              [EXTRA_FIELD]: value,
              [VALUE_FIELD]: datum[value],
            });
          });
        } else {
          newData.push({
            ...datum,
          });
        }
      }
    }
    // 返回新的结构
    return {
      data: newData,
      meta,
      fields: {
        ...fields,
        rows: newRows,
        columns: newColumns,
      },
      sortParams,
    };
  }
}
