/**
 * table mode data-set test.
 */
import { assembleDataCfg } from 'tests/util';
import type { S2DataConfig } from '@/common/interface';
import { SpreadSheet, TableSheet } from '@/sheet-type';
import { TableDataSet } from '@/data-set/table-data-set';

jest.mock('@/sheet-type');
jest.mock('@/facet/layout/node');
const MockTableSheet = TableSheet as any as jest.Mock<TableSheet>;

describe('Table Mode Dataset Test', () => {
  let s2: SpreadSheet;
  let dataSet: TableDataSet;

  const mockNumberFormatter = jest.fn().mockReturnValue('number');
  const mockSubTypeFormatter = jest.fn().mockReturnValue('sub_type');
  const mockTypeFormatter = jest.fn().mockReturnValue('type');
  const mockCityFormatter = jest.fn().mockReturnValue('city');
  const mockProvinceFormatter = jest.fn().mockReturnValue('province');

  const dataCfg: S2DataConfig = {
    ...assembleDataCfg({}),
    fields: {
      columns: ['province', 'city', 'type', 'sub_type', 'number'],
    },
    meta: [
      {
        field: 'province',
        name: '省份',
        description: '省份描述',
        formatter: mockProvinceFormatter,
      },
      {
        field: 'city',
        name: '城市',
        description: '城市描述',
        formatter: mockCityFormatter,
      },
      {
        field: 'type',
        name: '类型',
        description: '类型描述',
        formatter: mockTypeFormatter,
      },
      {
        field: 'sub_type',
        name: '子类型',
        description: '子类型描述',
        formatter: mockSubTypeFormatter,
      },
      {
        field: 'number',
        name: '数量',
        description: '数量描述',
        formatter: mockNumberFormatter,
      },
    ],
  };

  beforeEach(() => {
    MockTableSheet.mockClear();

    s2 = new MockTableSheet();
    dataSet = new TableDataSet(s2);

    dataSet.setDataCfg(dataCfg);
  });

  afterEach(() => {});

  describe('meta config test', () => {
    test.each`
      field         | name        | description     | formatter
      ${'province'} | ${'省份'}   | ${'省份描述'}   | ${mockProvinceFormatter}
      ${'city'}     | ${'城市'}   | ${'城市描述'}   | ${mockCityFormatter}
      ${'type'}     | ${'类型'}   | ${'类型描述'}   | ${mockTypeFormatter}
      ${'sub_type'} | ${'子类型'} | ${'子类型描述'} | ${mockSubTypeFormatter}
      ${'number'}   | ${'数量'}   | ${'数量描述'}   | ${mockProvinceFormatter}
    `(
      'should return correct filed meta when field=$field',
      ({ field, name, description }) => {
        expect(dataSet.getFieldName(field)).toStrictEqual(name);
        expect(dataSet.getFieldDescription(field)).toStrictEqual(description);
        expect(dataSet.getFieldFormatter(field)(null)).toStrictEqual(field);
      },
    );
  });

  describe('test base dataset structure', () => {
    test('should get correct field data', () => {
      expect(dataSet.fields.rows).toEqual(undefined);
      expect(dataSet.fields.columns).toEqual([
        'province',
        'city',
        'type',
        'sub_type',
        'number',
      ]);
      expect(dataSet.fields.values).toEqual(undefined);
    });

    test('should get correct meta data', () => {
      expect(dataSet.meta).toEqual(expect.objectContaining([]));
    });

    test('should get correctly empty dataset result', () => {
      expect(dataSet.isEmpty()).toBeFalsy();
    });
  });

  describe('test for query data', () => {
    test('#getCellData', () => {
      expect(
        dataSet.getCellData({
          query: { rowIndex: 0 },
        }),
      ).toEqual({
        city: '杭州市',
        number: 7789,
        province: '浙江省',
        sub_type: '桌子',
        type: '家具',
      });

      expect(
        dataSet.getCellData({
          query: {
            rowIndex: 0,
            field: 'city',
          },
        }),
      ).toEqual('杭州市');

      expect(
        dataSet.getCellData({
          query: {
            rowIndex: 2,
            field: 'number',
          },
        }),
      ).toEqual(3877);

      expect(
        dataSet.getCellData({
          query: {
            rowIndex: 5,
            field: 'sub_type',
          },
        }),
      ).toEqual('沙发');
    });

    test('#getMultiData by empty query', () => {
      expect(dataSet.getCellMultiData({})).toMatchSnapshot();
    });

    test('#getMultiData by rowIndex query', () => {
      expect(
        dataSet.getCellMultiData({
          query: {
            rowIndex: 0,
          },
        }),
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "city": "杭州市",
            "number": 7789,
            "province": "浙江省",
            "sub_type": "桌子",
            "type": "家具",
          },
        ]
      `);

      expect(
        dataSet.getCellMultiData({
          query: {
            rowIndex: -1,
          },
        }),
      ).toMatchSnapshot();
    });

    test('#getMultiData by field query', () => {
      expect(
        dataSet.getCellMultiData({
          query: {
            field: 'city',
          },
        }),
      ).toMatchSnapshot();

      expect(
        dataSet.getCellMultiData({
          query: {
            field: 'number',
          },
        }),
      ).toMatchSnapshot();

      expect(
        dataSet.getCellMultiData({
          query: {
            field: 'sub_type',
          },
        }),
      ).toMatchSnapshot();
    });

    test('#getMultiData by field and rowIndex query', () => {
      expect(
        dataSet.getCellMultiData({
          query: {
            field: 'city',
            rowIndex: 0,
          },
        }),
      ).toEqual(['杭州市']);

      expect(
        dataSet.getCellMultiData({
          query: {
            field: 'number',
            rowIndex: 2,
          },
        }),
      ).toEqual([3877]);

      expect(
        dataSet.getCellMultiData({
          query: {
            field: 'sub_type',
            rowIndex: 3,
          },
        }),
      ).toEqual(['桌子']);
    });
  });
});
