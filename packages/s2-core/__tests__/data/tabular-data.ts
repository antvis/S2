import { S2DataConfig, S2Options } from '@/common/interface';

export const mockTabularOptions = {
  width: 1000,
  height: 600,
  hierarchyType: 'grid',
  style: {
    cellCfg: {
      lineHeight: 30,
      width: 400,
      height: 300,
      minorMeasureRowIndex: 3,
      firstDerivedMeasureRowIndex: 2,
    },
  },
} as S2Options;

export const mockTabularDataCfg = {
  fields: {
    rows: ['COLUMNDIMENSION-scene'],
    columns: ['DIMENSION-sex', 'DIMENSION-age'],
    values: ['value'],
  },
  meta: [
    { field: 'DIMENSION-sex', name: 'sex' },
    {
      field: 'DIMENSION-age',
      name: 'age',
    },
    { field: 'COLUMNDIMENSION-scene', name: 'scene' },
    { field: 'value', name: '' },
  ],
  data: [
    {
      'DIMENSION-sex': '男',
      'DIMENSION-age': 16,
      'COLUMNDIMENSION-scene': '账单',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 66666,
      'MEASURE-最近7天登端天数-COMPARE-VALUE': 0.001,
      'MEASURE-最近7天登端天数-COMPARE-MINUS': 1,
      value: {
        label: '账单男16',
        values: [
          ['最近7天登端天数', 1, 3423423, -323],
          ['自然月新登用户数', 1, -3423423, 323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
    {
      'DIMENSION-sex': '男',
      'DIMENSION-age': 17,
      'COLUMNDIMENSION-scene': '账单',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 66666,
      'MEASURE-最近7天登端天数-COMPARE-VALUE': 0.001,
      'MEASURE-最近7天登端天数-COMPARE-MINUS': 1,
      value: {
        label: '账单男17',
        values: [
          ['最近7天登端天数', 1323, -3423423, 323],
          ['自然月新登用户数', 1232, 3423423, -323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
    {
      'DIMENSION-sex': '男',
      'DIMENSION-age': 16,
      'COLUMNDIMENSION-scene': '花呗',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 2,
      'MEASURE-最近7天登端天数-COMPARE-VALUE': 0.002,
      'MEASURE-最近7天登端天数-COMPARE-MINUS': -20,
      value: {
        label: '花呗男16',
        values: [
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
    {
      'DIMENSION-sex': '男',
      'DIMENSION-age': 17,
      'COLUMNDIMENSION-scene': '花呗',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 2,
      'MEASURE-最近7天登端天数-COMPARE-VALUE': 0.002,
      'MEASURE-最近7天登端天数-COMPARE-MINUS': -20,
      value: {
        label: '花呗男17',
        values: [
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
    {
      'DIMENSION-sex': '女',
      'DIMENSION-age': 16,
      'COLUMNDIMENSION-scene': '账单',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 1888883,
      'MEASURE-最近7天登端天数-COMPARE-VALUE': 0.0001,
      'MEASURE-最近7天登端天数-COMPARE-MINUS': -50,
      value: {
        label: '账单女16',
        values: [
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
    {
      'DIMENSION-sex': '女',
      'DIMENSION-age': 16,
      'COLUMNDIMENSION-scene': '花呗',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 1888883,
      'MEASURE-最近7天登端天数-COMPARE-VALUE': 0.0001,
      'MEASURE-最近7天登端天数-COMPARE-MINUS': -50,
      value: {
        label: '花呗女16',
        values: [
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
    {
      'DIMENSION-sex': '女',
      'DIMENSION-age': 16,
      'COLUMNDIMENSION-scene': '余额',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 1,
      value: {
        label: '余额女16',
        values: [
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
    {
      'DIMENSION-sex': '女',
      'DIMENSION-age': 17,
      'COLUMNDIMENSION-scene': '花呗',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 1888883,
      'MEASURE-最近7天登端天数-COMPARE-VALUE': 0.0001,
      'MEASURE-最近7天登端天数-COMPARE-MINUS': -50,
      value: {
        label: '花呗女16',
        values: [
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
    {
      'DIMENSION-sex': '女',
      'DIMENSION-age': 17,
      'COLUMNDIMENSION-scene': '余额',
      'DATE-日期': '2021-04-11',
      'MEASURE-最近7天登端天数': 1,
      value: {
        label: '余额女16',
        values: [
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
          ['最近7天登端天数', 1, 3423423, 323],
          ['自然月新登用户数', 1, 3423423, 323],
        ],
      },
    },
  ],
} as S2DataConfig;
