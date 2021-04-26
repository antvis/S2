import { size, map, get, isArray } from 'lodash';
import { Pivot } from './pivot';
import { EXTRA_FIELD, VALUE_FIELD } from '../common/constant';

interface LineData {
  [k: string]: string | number;
}

export class DetailPivot extends Pivot {
  private dimValues: Map<string, [string, number, LineData][]>;

  public getDimValues(field: string, query?: any): string[] {
    console.info(query);
    const vals = this.dimValues.get(field);
    return (
      vals &&
      vals.map((value) => {
        return value[0];
      })
    );
  }

  // TODO specific query and return value type
  public getRecords(query?: any): Record<string, any>[] {
    // 明细表中是通过行号和列维度名字来确定
    // ['rowIndex']: i,
    // ['colField']: col.key,
    if (size(query) && this.dimValues) {
      // 该列维度下所有的值
      const values = this.dimValues.get(query.colField);
      // 第几行的值
      const value = values && values[query.rowIndex];
      const item = get(value, '2', []);
      return [
        {
          ...item,
          [EXTRA_FIELD]: query.colField,
          [VALUE_FIELD]: value && value[0],
        },
      ];
    }
    if (!size(query)) {
      // 请求全部数据，用于条状图条件格式
      return this.config.data || [];
    }
    return [];
  }

  protected training() {
    const data = this.config.data;
    const { rows, cols, values } = this.config;
    if (!isArray(values)) {
      // 在明细表的场景下，不可能不为数值
      return;
    }
    this.data = data;
    /*
    sortParams默认是一个数组，在此估计只需要读index=0的即可
    sortFieldId: string;  -- 维度
    sortMethod?: 'ASC' | 'DESC';  -- 维度升序还是降序
     */
    this.dimValues = new Map();
    const allDims = rows.concat(cols).concat(values);
    this.processAllDims(allDims, data);
    // 明细表只有两个排序规则，以单个维度的升或者降序
    // const SortParams = [ // for test
    //   {
    //     sortFieldId: rows[1],
    //     sortMethod: 'ASC',
    //   } as SortParam,
    // ];

    // if (sortParams && sortParams.length === 1) {
    //   const { sortFieldId, sortMethod = 'ASC' } = sortParams[0];
    //   if (allDims.indexOf(sortFieldId) !== -1) { // 存在排序的维度
    //     // 找到排序的方式，默认是 ASC
    //     const opt = sortMethod === 'ASC' ? 1 : -1;
    //     const fieldValues = this.dimValues.get(sortFieldId);
    //     if (fieldValues) {
    //       // 当维度是存在于值维度里面的，排序方式按照值来排序
    //       if (values.indexOf(sortFieldId) !== -1) {
    //         fieldValues.sort((a: [string, number], b: [string, number]) => {
    //           return (parseFloat(a[0]) - parseFloat(b[0])) * opt;
    //         });
    //       } else {
    //         // 其他场景用中文来排序字符串
    //         fieldValues.sort((a: [string, number], b: [string, number]) => {
    //           return a[0] && b[0] ? a[0].toString().localeCompare(b[0].toString(), 'zh') * opt : opt;
    //         });
    //       }
    //     }
    //     // 数据顺序的重排
    //     const newData = [];
    //     fieldValues && fieldValues.forEach((value) => {
    //       for (const d of data) {
    //         // 对应的行能匹配上, COLUMN_FIELD承载了原始数据对应的index行号
    //         if (value && value[1] === get(d, EXTRA_FIELD, -1)) {
    //           newData.push(d);
    //           break;
    //         }
    //       }
    //     });
    //     this.data = newData;
    //     // 重新计算dimValues
    //     this.processAllDims(allDims, newData);
    //   }
    // }
  }

  private processAllDims(allDims, data) {
    this.dimValues.clear();
    let index = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const line of data) {
      // eslint-disable-next-line no-loop-func
      map(allDims, (dim) => {
        const dimValue = line[dim];
        if (!this.dimValues.has(dim)) {
          this.dimValues.set(dim, []);
        }
        const vals = this.dimValues.get(dim);
        // 添加所有维度值
        vals.push([dimValue, index, line]);
        return dimValue;
      });
      index += 1;
    }
  }
}
