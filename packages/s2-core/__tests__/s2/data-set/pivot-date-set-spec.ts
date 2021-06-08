/**
 * Create By Bruce Too
 * On 2021/6/2
 */
import { data6 } from '../../datasets/data-accuracy';
import _ from 'lodash';
import { auto, PivotDataSet, VALUE_FIELD } from '../../../src';

describe('Test Pivot Date Set', () => {
  const pivotDataSet = new PivotDataSet();
  const getDataCfg = () => {
    return {
      fields: {
        rows: ['province', 'city'],
        columns: ['category', 'subCategory'],
        values: ['price', 'account'],
        valueInCols: true,
      },
      meta: [
        {
          field: 'price',
          name: '单价',
          formatter: (v) => auto(v),
        },
        {
          field: 'account',
          name: '账号',
          formatter: (v) => auto(v),
        },
      ],
      data: data6,
      sortParams: [],
    };
  };
  pivotDataSet.setDataCfg(getDataCfg());

  it('get data cell', () => {
    // price grand total
    const query1 = { $$extra$$: 'price' };
    const result1 = pivotDataSet.getCellData(query1);
    expect(_.get(result1, `${VALUE_FIELD}`)).toEqual(1);

    // category' price sub total
    const query2 = { category: '家具', $$extra$$: 'price' };
    const result2 = pivotDataSet.getCellData(query2);
    expect(_.get(result2, `${VALUE_FIELD}`)).toEqual(5);

    // provinces' price sub total
    const query3 = { province: '辽宁省', $$extra$$: 'price' };
    const result3 = pivotDataSet.getCellData(query3);
    expect(_.get(result3, `${VALUE_FIELD}`)).toEqual(2);

    // detail cell
    const query4 = {
      province: '辽宁省',
      city: '芜湖市',
      category: '家具',
      subCategory: '桌子',
      $$extra$$: 'price',
    };
    const result4 = pivotDataSet.getCellData(query4);
    expect(_.get(result4, `${VALUE_FIELD}`)).toEqual(12);
  });

  it('get multi data', () => {
    const sortValues = (values: number[]) => values.sort((a, b) => a - b);

    // path = [undefined, undefined, 1, 1, 0]
    const query1 = {
      category: '家具',
      subCategory: '桌子',
      $$extra$$: 'price',
    };
    const result1 = pivotDataSet.getMultiData(query1);
    console.log('query1', result1);
    expect(sortValues(result1.map((v) => v[VALUE_FIELD]))).toEqual([
      9,
      10,
      11,
      12,
    ]);

    // path = [1, undefined, 1, undefined, 0]
    const query2 = { category: '家具', province: '辽宁省', $$extra$$: 'price' };
    const result2 = pivotDataSet.getMultiData(query2);
    console.log('query2', result2);
    expect(sortValues(result2.map((v) => v[VALUE_FIELD]))).toEqual([
      6,
      7,
      8,
      10,
      11,
      12,
      14,
      15,
      16,
    ]);

    // path = [1, 1, undefined, undefined, 0]
    const query3 = { city: '达州市', province: '辽宁省', $$extra$$: 'price' };
    const result3 = pivotDataSet.getMultiData(query3);
    console.log('query3', result3);
    expect(sortValues(result3.map((v) => v[VALUE_FIELD]))).toEqual([
      3,
      7,
      11,
      15,
    ]);

    // path = [1, 1, undefined, undefined, undefined]
    const query4 = { city: '达州市', province: '辽宁省' };
    const result4 = pivotDataSet.getMultiData(query4);
    expect(sortValues(result4.map((v) => v[VALUE_FIELD]))).toEqual([
      3,
      7,
      11,
      15,
      33,
      77,
      111,
      155,
    ]);

    // path = [undefined, undefined, undefined, undefined, 0]
    const query5 = { $$extra$$: 'price' };
    const result5 = pivotDataSet.getMultiData(query5);
    expect(sortValues(result5.map((v) => v[VALUE_FIELD]))).toEqual([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
    ]);

    // mark as grand total node query
    const query6 = { $$extra$$: 'price' };
    const result6 = pivotDataSet.getMultiData(query6, true);
    expect(sortValues(result6.map((v) => v[VALUE_FIELD]))).toEqual([
      1,
      2,
      3,
      4,
    ]);

    // mark as sub total node query
    const query7 = { category: '家具', $$extra$$: 'price' };
    const result7 = pivotDataSet.getMultiData(query7, true);
    expect(sortValues(result7.map((v) => v[VALUE_FIELD]))).toEqual([
      5,
      6,
      7,
      8,
    ]);
  });
});
