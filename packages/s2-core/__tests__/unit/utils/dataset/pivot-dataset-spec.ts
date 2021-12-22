import { assembleDataCfg } from 'tests/util';
import { get } from 'lodash';
import {
  deleteMetaById,
  transformIndexesData,
  transformDimensionsValues,
  getDataPath,
  getDimensionsWithoutPathPre,
  getDimensionsWithParentPath,
} from '@/utils/dataset/pivot-data-set';
import { S2DataConfig } from '@/common/interface';

describe('PivotDataSet util test', () => {
  const dataCfg: S2DataConfig = assembleDataCfg({
    totalData: [],
    meta: [],
  });

  test('for deleteMetaById function', () => {
    const childrenMeta = {
      level: 0,
      children: new Map(),
      childField: 'country',
    };
    const meta = new Map().set('浙江省', {
      level: 0,
      children: new Map().set('杭州市', childrenMeta),
      childField: 'city',
    });

    deleteMetaById(meta, 'root[&]浙江省');
    const result = meta.get('浙江省');
    expect(result.childField).toBeUndefined();
    expect(result.children).toBeEmpty();
  });

  test('for transformIndexesData function', () => {
    const { rows, columns } = dataCfg.fields;
    const sortedDimensionValues = {};
    const rowPivotMeta = new Map();
    const colPivotMeta = new Map();
    const result = transformIndexesData({
      rows,
      columns,
      originData: dataCfg.data,
      totalData: [],
      indexesData: [],
      sortedDimensionValues,
      rowPivotMeta: rowPivotMeta,
      colPivotMeta: colPivotMeta,
    });
    expect(result.indexesData).toHaveLength(2);
    expect(result.paths).toHaveLength(32);
    expect(get(result.indexesData, result.paths[0])).toEqual({
      city: '杭州市',
      number: 7789,
      province: '浙江省',
      sub_type: '桌子',
      type: '家具',
    });
    expect(result.colPivotMeta.has('家具')).toBeTrue();
    expect(result.rowPivotMeta.has('浙江省')).toBeTrue();
    expect(
      getDimensionsWithoutPathPre(result.sortedDimensionValues.province),
    ).toEqual(['浙江省', '四川省']);
  });

  test('for transformDimensionsValues function', () => {
    const rows = ['province', 'city'];
    const sortedDimensionValues = {};
    const data = {
      city: '杭州市',
      number: 7789,
      province: '浙江省',
      sub_type: '桌子',
      type: '家具',
    };
    const result = transformDimensionsValues(data, rows, sortedDimensionValues);
    expect(result).toEqual(['浙江省', '杭州市']);
  });

  test('for return type of transformDimensionsValues function', () => {
    const rows = ['row0', 'row1'];
    const sortedDimensionValues = {};
    const data = {
      row0: 0,
      number: 7789,
      row1: 1,
      sub_type: '桌子',
      type: '家具',
    };
    const result = transformDimensionsValues(data, rows, sortedDimensionValues);
    expect(result).toEqual(['0', '1']);
  });

  test('for getDataPath function', () => {
    const rowDimensionValues = ['浙江省', '杭州市'];
    const colDimensionValues = ['家具', '桌子'];
    const rows = ['province', 'city'];
    const columns = ['type', 'sub_type'];
    const rowPivotMeta = new Map();
    const colPivotMeta = new Map();

    const result = getDataPath({
      rowDimensionValues,
      colDimensionValues,
      rowPivotMeta,
      colPivotMeta,
      isFirstCreate: true,
      careUndefined: false,
      rowFields: rows,
      colFields: columns,
    });
    expect(result).toEqual([0, 0, 0, 0]);
  });

  test('for getDimensionsWithoutPathPre function', () => {
    const dimensions = ['芜湖市[&]家具[&]椅子', '芜湖市[&]家具', '芜湖市'];
    expect(getDimensionsWithoutPathPre(dimensions)).toEqual([
      '椅子',
      '家具',
      '芜湖市',
    ]);
  });

  test('for getDimensionsWithParentPath function', () => {
    const field = 'city';
    const defaultDimensions = ['province', 'city'];
    const dimensions = [
      {
        province: '辽宁省',
        city: '芜湖市',
        category: '家具',
        subCategory: '椅子',
        price: '',
      },
    ];
    const result = getDimensionsWithParentPath(
      field,
      defaultDimensions,
      dimensions,
    );
    expect(result).toEqual(['辽宁省[&]芜湖市']);
  });
});
