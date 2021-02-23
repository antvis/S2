/**
 * Create By Bruce Too
 * On 2020-06-18
 */
import { BaseDataSet, Pivot } from './index';
import { BaseParams } from './base-data-set';
import { processIrregularData } from '../utils/get-irregular-data';
import { DataCfg } from '../common/interface';
import * as _ from 'lodash';
import { EXTRA_FIELD, VALUE_FIELD } from '../common/constant';

export class StrategyDataSet extends BaseDataSet<BaseParams> {
  constructor(params: BaseParams) {
    super(params);
  }

  protected preProcess(dataCfg: DataCfg): DataCfg {
    const newDataCfg = processIrregularData(dataCfg);
    const { data = [], meta, fields, sortParams = [] } = newDataCfg;
    const { columns, rows, values } = fields;
    let newRows = rows;
    let newColumns = columns;
    const newData = [];
    if (_.isEmpty(rows)) {
      // 没行度量的情况，行是有value来决定
      if (_.isArray(values)) {
        // 决策模式下 只存在数值挂在行头，且是树形结构
        newData.push(...data);
      } else {
        newRows = values.fields;
        newColumns = [...columns];
        // eslint-disable-next-line no-restricted-syntax
        for (const datum of data) {
          if (!_.isEmpty(values.data)) {
            _.each(values.data, (value) => {
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
        if (!_.isEmpty(values)) {
          _.each(values, (value: string) => {
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
