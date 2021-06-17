import { EXTRA_FIELD, VALUE_FIELD } from 'src/common/constant';
import { S2DataConfig } from 'src/common/interface';
import { SpreadSheet } from 'src/sheet-type';
import { PivotDataSet } from 'src/data-set/pivot-data-set';
import _ from 'lodash';

jest.mock('src/sheet-type');
const MockSpreadSheet = SpreadSheet as any as jest.Mock<SpreadSheet>;

describe('Pivot Dataset Test', () => {
  let dataSet: PivotDataSet;
  let dataCfg: S2DataConfig;

  beforeEach(() => {
    MockSpreadSheet.mockClear();
    dataSet = new PivotDataSet(new MockSpreadSheet());
  });

  describe('Test For Value In Cols', () => {
    beforeEach(() => {
      dataCfg = {
        fields: {
          rows: ['province', 'city'],
          columns: ['category'],
          values: ['price'],
          valueInCols: true,
        },
        meta: [
          {
            field: 'price',
            name: '单价',
          },
        ],
        data: [
          {
            province: '辽宁省',
            city: '达州市',
            category: '电脑',
            price: 1,
          },
          {
            province: '辽宁省',
            city: '芜湖市',
            category: '手机',
            price: 2,
          },
          {
            province: '辽宁省',
            city: '芜湖市',
            category: '家具',
            price: 3,
          },
          {
            province: '四川省',
            city: '成都市',
            category: '家具',
            price: 4,
          },
          {
            province: '四川省',
            city: '成都市',
            category: '电脑',
            price: 5,
          },
          {
            province: '四川省',
            city: '简阳市',
            category: '家具',
            price: 6,
          },
        ],
        sortParams: [],
      };
    });

    test('should get correct field data', () => {
      dataSet.setDataCfg(dataCfg);

      expect(dataSet.fields.rows).toEqual(['province', 'city']);
      expect(dataSet.fields.columns).toEqual(['category', EXTRA_FIELD]);
    });
    test('should get correct row pivot meta', () => {
      dataSet.setDataCfg(dataCfg);

      /**
       * 辽宁省
       *   达州市
       *   芜湖市
       */
      const rowPivotMeta = dataSet.rowPivotMeta;

      expect([...rowPivotMeta.keys()]).toEqual(['辽宁省', '四川省']);

      expect(rowPivotMeta.get('辽宁省').level).toEqual(0);
      expect([...rowPivotMeta.get('辽宁省').children.keys()]).toEqual([
        '达州市',
        '芜湖市',
      ]);

      expect(rowPivotMeta.get('四川省').level).toEqual(1);
      expect([...rowPivotMeta.get('四川省').children.keys()]).toEqual([
        '成都市',
        '简阳市',
      ]);
    });

    test('should get correct col pivot meta', () => {
      dataSet.setDataCfg(dataCfg);

      /**
       * 电脑
       *   price
       * 手机
       *   price
       * 家具
       *   price
       */
      const colPivotMeta = dataSet.colPivotMeta;

      expect([...colPivotMeta.keys()]).toEqual(['电脑', '手机', '家具']);

      expect(colPivotMeta.get('电脑').level).toEqual(0);
      expect([...colPivotMeta.get('电脑').children.keys()]).toEqual(['price']);

      expect(colPivotMeta.get('手机').level).toEqual(1);
      expect([...colPivotMeta.get('手机').children.keys()]).toEqual(['price']);

      expect(colPivotMeta.get('家具').level).toEqual(2);
      expect([...colPivotMeta.get('家具').children.keys()]).toEqual(['price']);
    });

    test('should get correct indexesData', () => {
      dataSet.setDataCfg(dataCfg);

      const indexesData = dataSet.indexesData;

      // 辽宁
      expect(_.get(indexesData, '0.0.0.0')).toEqual({
        province: '辽宁省',
        city: '达州市',
        category: '电脑',
        price: 1,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 1,
      });

      expect(_.get(indexesData, '0.1.1.0')).toEqual({
        province: '辽宁省',
        city: '芜湖市',
        category: '手机',
        price: 2,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 2,
      });

      expect(_.get(indexesData, '0.1.2.0')).toEqual({
        province: '辽宁省',
        city: '芜湖市',
        category: '家具',
        price: 3,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 3,
      });

      // 四川
      expect(_.get(indexesData, '1.0.2.0')).toEqual({
        province: '四川省',
        city: '成都市',
        category: '家具',
        price: 4,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 4,
      });

      expect(_.get(indexesData, '1.0.0.0')).toEqual({
        province: '四川省',
        city: '成都市',
        category: '电脑',
        price: 5,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 5,
      });

      expect(_.get(indexesData, '1.1.2.0')).toEqual({
        province: '四川省',
        city: '简阳市',
        category: '家具',
        price: 6,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 6,
      });
    });
  });

  describe('Test For Value In Rows', () => {
    beforeEach(() => {
      dataCfg = {
        fields: {
          rows: ['province', 'city'],
          columns: ['category'],
          values: ['price'],
          valueInCols: false,
        },
        meta: [
          {
            field: 'price',
            name: '单价',
          },
        ],
        data: [
          {
            province: '辽宁省',
            city: '达州市',
            category: '电脑',
            price: 1,
          },
          {
            province: '辽宁省',
            city: '芜湖市',
            category: '手机',
            price: 2,
          },
          {
            province: '辽宁省',
            city: '芜湖市',
            category: '家具',
            price: 3,
          },
          {
            province: '四川省',
            city: '成都市',
            category: '家具',
            price: 4,
          },
          {
            province: '四川省',
            city: '成都市',
            category: '电脑',
            price: 5,
          },
          {
            province: '四川省',
            city: '简阳市',
            category: '家具',
            price: 6,
          },
        ],
        sortParams: [],
      };
    });

    test('should get correct field data', () => {
      dataSet.setDataCfg(dataCfg);

      expect(dataSet.fields.rows).toEqual(['province', 'city', EXTRA_FIELD]);
      expect(dataSet.fields.columns).toEqual(['category']);
    });
    test('should get correct row pivot meta', () => {
      dataSet.setDataCfg(dataCfg);

      /**
       * 辽宁省
       *   达州市
       *     price
       *   芜湖市
       *    price
       */
      const rowPivotMeta = dataSet.rowPivotMeta;

      expect([...rowPivotMeta.keys()]).toEqual(['辽宁省', '四川省']);

      expect(rowPivotMeta.get('辽宁省').level).toEqual(0);
      expect([...rowPivotMeta.get('辽宁省').children.keys()]).toEqual([
        '达州市',
        '芜湖市',
      ]);

      expect([
        ...rowPivotMeta.get('辽宁省').children.get('达州市').children.keys(),
      ]).toEqual(['price']);
    });

    test('should get correct col pivot meta', () => {
      dataSet.setDataCfg(dataCfg);

      /**
       * 电脑
       * 手机
       * 家具
       */
      const colPivotMeta = dataSet.colPivotMeta;

      expect([...colPivotMeta.keys()]).toEqual(['电脑', '手机', '家具']);

      expect(colPivotMeta.get('电脑').level).toEqual(0);
      expect(colPivotMeta.get('电脑').children.size).toEqual(0);

      expect(colPivotMeta.get('手机').level).toEqual(1);
      expect(colPivotMeta.get('手机').children.size).toEqual(0);

      expect(colPivotMeta.get('家具').level).toEqual(2);
      expect(colPivotMeta.get('家具').children.size).toEqual(0);
    });

    test('should get correct indexesData', () => {
      dataSet.setDataCfg(dataCfg);

      const indexesData = dataSet.indexesData;

      // 辽宁
      expect(_.get(indexesData, '0.0.0.0')).toEqual({
        province: '辽宁省',
        city: '达州市',
        category: '电脑',
        price: 1,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 1,
      });

      expect(_.get(indexesData, '0.1.0.1')).toEqual({
        province: '辽宁省',
        city: '芜湖市',
        category: '手机',
        price: 2,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 2,
      });

      expect(_.get(indexesData, '0.1.0.2')).toEqual({
        province: '辽宁省',
        city: '芜湖市',
        category: '家具',
        price: 3,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 3,
      });

      // 四川
      expect(_.get(indexesData, '1.0.0.2')).toEqual({
        province: '四川省',
        city: '成都市',
        category: '家具',
        price: 4,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 4,
      });

      expect(_.get(indexesData, '1.0.0.0')).toEqual({
        province: '四川省',
        city: '成都市',
        category: '电脑',
        price: 5,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 5,
      });

      expect(_.get(indexesData, '1.1.0.2')).toEqual({
        province: '四川省',
        city: '简阳市',
        category: '家具',
        price: 6,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 6,
      });
    });
  });

  describe('Test For Query Date Cells', () => {
    beforeEach(() => {
      dataCfg = {
        fields: {
          rows: ['province', 'city'],
          columns: ['category'],
          values: ['price'],
          valueInCols: true,
        },
        meta: [
          {
            field: 'price',
            name: '单价',
          },
        ],
        data: [
          {
            province: '辽宁省',
            price: 10,
          },
          {
            province: '辽宁省',
            category: '电脑',
            price: 1,
          },
          {
            province: '辽宁省',
            category: '手机',
            price: 1,
          },

          {
            province: '辽宁省',
            city: '达州市',
            category: '电脑',
            price: 1,
          },
          {
            province: '辽宁省',
            city: '芜湖市',
            category: '手机',
            price: 2,
          },
          {
            province: '辽宁省',
            city: '芜湖市',
            category: '家具',
            price: 3,
          },
          {
            province: '四川省',
            city: '成都市',
            category: '家具',
            price: 4,
          },
          {
            province: '四川省',
            city: '成都市',
            category: '电脑',
            price: 5,
          },
          {
            province: '四川省',
            city: '简阳市',
            category: '家具',
            price: 6,
          },
        ],
        sortParams: [],
      };
    });

    test('should get correct data cell', () => {
      dataSet.setDataCfg(dataCfg);
      // find exact single data cell
      const result1 = dataSet.getCellData({
        province: '辽宁省',
        city: '达州市',
        category: '电脑',
        [EXTRA_FIELD]: 'price',
      });
      expect(result1).toEqual({
        province: '辽宁省',
        city: '达州市',
        category: '电脑',
        price: 1,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 1,
      });

      // find total price of province
      const result2 = dataSet.getCellData({
        province: '辽宁省',
      });
      expect(result2[0]).toEqual({
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 10,
        price: 10,
        province: '辽宁省',
      });
    });

    test('should get correct multi data cells', () => {
      dataSet.setDataCfg(dataCfg);

      // get all indexesData
      const result1 = dataSet.getMultiData({});
      expect(result1).toBeArrayOfSize(9);

      // find all data cells belong to same province
      const result2 = dataSet.getMultiData({
        province: '辽宁省',
      });
      expect(result2).toBeArrayOfSize(6);

      // find all data cells belong to same province and city
      const result3 = dataSet.getMultiData({
        province: '四川省',
        city: '成都市',
      });

      expect(result3[0]).toContainEntries([
        ['city', '成都市'],
        ['category', '电脑'],
      ]);
      expect(result3[1]).toContainEntries([
        ['city', '成都市'],
        ['category', '家具'],
      ]);

      // can't find any data
      const result4 = dataSet.getMultiData({
        province: '四川省',
        category: '家具',
      });

      expect(result4).toBeArrayOfSize(0);
    });

    test('should get correct multi data cells with total values', () => {
      dataSet.setDataCfg(dataCfg);

      // find grand total price
      const result1 = dataSet.getMultiData(
        {
          [EXTRA_FIELD]: 'price',
        },
        true,
      );
      expect(result1[0]).toEqual({
        province: '辽宁省',
        price: 10,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 10,
      });
    });

    test('should get correct dimension values', () => {
      dataSet.setDataCfg(dataCfg);

      // get all provinces
      const result1 = dataSet.getDimensionValues('province');
      expect(result1).toEqual(['辽宁省', '四川省']);

      // find all cites in this province
      const result2 = dataSet.getDimensionValues('province', {
        province: '辽宁省',
      });
      expect(result2).toEqual(['达州市', '芜湖市']);

      // get children under city
      const result3 = dataSet.getDimensionValues('province', {
        province: '辽宁省',
        city: '达州市',
      });
      expect(result3).toBeEmpty();

      // get all categories
      const result4 = dataSet.getDimensionValues('category');
      expect(result4).toEqual(['电脑', '手机', '家具']);

      // get children under category
      const result5 = dataSet.getDimensionValues(EXTRA_FIELD, {
        category: '家具',
      });
      expect(result5).toEqual(['price']);
    });
  });

  describe('Test For Derived Data', () => {
    beforeEach(() => {
      dataCfg = {
        fields: {
          rows: ['province', 'city'],
          columns: ['category'],
          values: ['price'],
          valueInCols: true,
          derivedValues: [
            {
              valueField: 'price',
              derivedValueField: ['price1'],
            },
          ],
        },
        meta: [
          {
            field: 'price',
            name: '单价',
          },
        ],
        data: [
          {
            province: '辽宁省',
            city: '达州市',
            category: '电脑',
            price: 1,
            price1: 11,
          },
          {
            province: '辽宁省',
            city: '芜湖市',
            category: '手机',
            price: 2,
            price1: 22,
          },
          {
            province: '辽宁省',
            city: '芜湖市',
            category: '家具',
            price: 3,
            price1: 33,
          },
          {
            province: '四川省',
            city: '成都市',
            category: '家具',
            price: 4,
            price1: 44,
          },
          {
            province: '四川省',
            city: '成都市',
            category: '电脑',
            price: 5,
            price1: 55,
          },
          {
            province: '四川省',
            city: '简阳市',
            category: '家具',
            price: 6,
            price1: 66,
          },
        ],

        sortParams: [],
      };
    });

    test('should get correct transformed data', () => {
      dataSet.setDataCfg(dataCfg);

      expect(dataSet.originData).toBeArrayOfSize(6 * 2);
    });

    test('should get correct col pivot meta', () => {
      dataSet.setDataCfg(dataCfg);

      /**
       * 电脑
       *   price
       *   price1
       *   price2
       * 手机
       *   price
       *   price1
       *   price2
       * 家具
       *   price
       *   price1
       *   price2
       */
      const colPivotMeta = dataSet.colPivotMeta;

      expect([...colPivotMeta.keys()]).toEqual(['电脑', '手机', '家具']);

      expect(colPivotMeta.get('电脑').level).toEqual(0);
      expect([...colPivotMeta.get('电脑').children.keys()]).toEqual([
        'price',
        'price1',
      ]);

      expect(colPivotMeta.get('手机').level).toEqual(1);
      expect([...colPivotMeta.get('手机').children.keys()]).toEqual([
        'price',
        'price1',
      ]);

      expect(colPivotMeta.get('家具').level).toEqual(2);
      expect([...colPivotMeta.get('家具').children.keys()]).toEqual([
        'price',
        'price1',
      ]);
    });

    test('should get correct indexesData', () => {
      dataSet.setDataCfg(dataCfg);

      const indexesData = dataSet.indexesData;

      // 辽宁 -> 达州 -> 电脑
      expect(_.get(indexesData, '0.0.0.0')).toEqual({
        province: '辽宁省',
        city: '达州市',
        category: '电脑',
        price: 1,
        price1: 11,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 1,
      });

      expect(_.get(indexesData, '0.0.0.1')).toEqual({
        province: '辽宁省',
        city: '达州市',
        category: '电脑',
        price: 1,
        price1: 11,
        [EXTRA_FIELD]: 'price1',
        [VALUE_FIELD]: 11,
      });
    });
  });
});
