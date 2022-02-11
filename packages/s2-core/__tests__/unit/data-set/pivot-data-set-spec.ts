/**
 * pivot mode base data-set test.
 */
import { get, keys } from 'lodash';
import { assembleDataCfg } from 'tests/util';
import {
  data as drillDownData,
  totalData as drillDownTotalData,
} from 'tests/data/mock-drill-down-dataset.json';
import { ViewMeta, SortMethod } from '@/common/interface';
import { EXTRA_FIELD, TOTAL_VALUE, VALUE_FIELD } from '@/common/constant';
import { S2DataConfig } from '@/common/interface';
import { PivotSheet } from '@/sheet-type';
import { PivotDataSet } from '@/data-set/pivot-data-set';
import { Store } from '@/common/store';
import { Node } from '@/facet/layout/node';
import { RootInteraction } from '@/interaction/root';
import { getDimensionsWithoutPathPre } from '@/utils/dataset/pivot-data-set';

jest.mock('@/sheet-type');

jest.mock('@/interaction/root');

const MockRootInteraction =
  RootInteraction as unknown as jest.Mock<RootInteraction>;

const MockPivotSheet = PivotSheet as unknown as jest.Mock<PivotSheet>;

describe('Pivot Dataset Test', () => {
  let dataSet: PivotDataSet;
  const dataCfg: S2DataConfig = assembleDataCfg({
    totalData: [],
    meta: [],
  });

  beforeEach(() => {
    MockPivotSheet.mockClear();
    const mockSheet = new MockPivotSheet();
    mockSheet.store = new Store();
    mockSheet.interaction = new MockRootInteraction(mockSheet);
    dataSet = new PivotDataSet(mockSheet);
    dataSet.setDataCfg(dataCfg);
  });

  describe('test base dataset structure', () => {
    test('should get correct field data', () => {
      expect(dataSet.fields.rows).toEqual(['province', 'city']);
      expect(dataSet.fields.columns).toEqual(['type', 'sub_type', EXTRA_FIELD]);
      expect(dataSet.fields.values).toEqual(['number']);
    });

    test('should get correct meta data', () => {
      expect(dataSet.meta[0]).toContainEntries([
        ['field', EXTRA_FIELD],
        ['name', '数值'],
      ]);
    });

    test('should get correct row pivot meta', () => {
      const rowPivotMeta = dataSet.rowPivotMeta;
      expect([...rowPivotMeta.keys()]).toEqual(['浙江省', '四川省']);
      expect(rowPivotMeta.get('浙江省').level).toEqual(0);
      expect([...rowPivotMeta.get('浙江省').children.keys()]).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
      ]);
      expect(rowPivotMeta.get('四川省').level).toEqual(1);
      expect([...rowPivotMeta.get('四川省').children.keys()]).toEqual([
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
      ]);
    });

    test('should get correct col pivot meta', () => {
      const colPivotMeta = dataSet.colPivotMeta;
      expect([...colPivotMeta.keys()]).toEqual(['家具', '办公用品']);

      expect(colPivotMeta.get('家具').level).toEqual(0);
      expect([...colPivotMeta.get('家具').children.keys()]).toEqual([
        '桌子',
        '沙发',
      ]);
      expect([
        ...colPivotMeta.get('家具').children.get('桌子').children.keys(),
      ]).toEqual(['number']);
      expect(colPivotMeta.get('办公用品').level).toEqual(1);
      expect([...colPivotMeta.get('办公用品').children.keys()]).toEqual([
        '笔',
        '纸张',
      ]);
    });

    test('should get correct indexesData', () => {
      const indexesData = dataSet.indexesData;
      expect(get(indexesData, '0.0.0.0.0')).toEqual({
        province: '浙江省',
        city: '杭州市',
        type: '家具',
        sub_type: '桌子',
        number: 7789,
        [EXTRA_FIELD]: 'number',
        [VALUE_FIELD]: 7789,
      });
      expect(get(indexesData, '0.1.1.0.0')).toEqual({
        province: '浙江省',
        city: '绍兴市',
        type: '办公用品',
        sub_type: '笔',
        number: 1304,
        [EXTRA_FIELD]: 'number',
        [VALUE_FIELD]: 1304,
      });
      expect(get(indexesData, '1.0.0.1.0')).toEqual({
        province: '四川省',
        city: '成都市',
        type: '家具',
        sub_type: '沙发',
        number: 2451,
        [EXTRA_FIELD]: 'number',
        [VALUE_FIELD]: 2451,
      });
    });

    test('should get correct sorted dimension value', () => {
      const sortedDimensionValues = dataSet.sortedDimensionValues;
      expect([...keys(sortedDimensionValues)]).toEqual([
        'province',
        'city',
        'type',
        'sub_type',
        EXTRA_FIELD,
      ]);
      expect(
        getDimensionsWithoutPathPre(sortedDimensionValues.province),
      ).toEqual(['浙江省', '四川省']);
      expect(getDimensionsWithoutPathPre(sortedDimensionValues.city)).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
      ]);
      expect(getDimensionsWithoutPathPre(sortedDimensionValues.type)).toEqual([
        '家具',
        '办公用品',
      ]);
      expect(
        getDimensionsWithoutPathPre(sortedDimensionValues.sub_type),
      ).toEqual(['桌子', '沙发', '笔', '纸张']);
      expect(
        getDimensionsWithoutPathPre(sortedDimensionValues[EXTRA_FIELD]),
      ).toEqual(['number', 'number', 'number', 'number']);
    });
  });

  describe('test for query data', () => {
    test('getCellData function', () => {
      expect(
        dataSet.getCellData({
          query: {
            province: '浙江省',
            city: '杭州市',
            type: '家具',
            sub_type: '桌子',
            [EXTRA_FIELD]: 'number',
          },
          isTotals: true,
        }),
      ).toContainEntries([[VALUE_FIELD, 7789]]);
      expect(
        dataSet.getCellData({
          query: {
            province: '四川省',
            city: '乐山市',
            type: '办公用品',
            sub_type: '纸张',
            [EXTRA_FIELD]: 'number',
          },
          isTotals: true,
        }),
      ).toContainEntries([[VALUE_FIELD, 352]]);
    });
    test('getMultiData function', () => {
      const specialQuery = {
        province: '浙江省',
        city: '杭州市',
        type: '家具',
        sub_type: '桌子',
        [EXTRA_FIELD]: 'number',
      };
      expect(dataSet.getMultiData(specialQuery)).toHaveLength(1);
      expect(dataSet.getMultiData(specialQuery)[0]).toContainEntries([
        [VALUE_FIELD, 7789],
      ]);
      expect(
        dataSet.getMultiData({
          province: '浙江省',
          type: '家具',
          sub_type: '桌子',
          [EXTRA_FIELD]: 'number',
        }),
      ).toHaveLength(4);
      expect(
        dataSet.getMultiData({
          type: '家具',
          sub_type: '桌子',
          [EXTRA_FIELD]: 'number',
        }),
      ).toHaveLength(8);
      expect(
        dataSet.getMultiData({
          type: '家具',
          [EXTRA_FIELD]: 'number',
        }),
      ).toHaveLength(16);
      expect(
        dataSet.getMultiData({
          [EXTRA_FIELD]: 'number',
        }),
      ).toHaveLength(32);
    });
    test('getDimensionValues function', () => {
      // without query
      expect(dataSet.getDimensionValues('province')).toEqual([
        '浙江省',
        '四川省',
      ]);
      expect(dataSet.getDimensionValues('city')).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
      ]);
      expect(dataSet.getDimensionValues('type')).toEqual(['家具', '办公用品']);
      expect(dataSet.getDimensionValues('sub_type')).toEqual([
        '桌子',
        '沙发',
        '笔',
        '纸张',
      ]);
      expect(dataSet.getDimensionValues(EXTRA_FIELD)).toEqual([
        'number',
        'number',
        'number',
        'number',
      ]);
      expect(dataSet.getDimensionValues('empty')).toEqual([]);
      // with query
      expect(
        dataSet.getDimensionValues('city', { province: '四川省' }),
      ).toEqual(['成都市', '绵阳市', '南充市', '乐山市']);
      expect(dataSet.getDimensionValues('sub_type', { type: '家具' })).toEqual([
        '桌子',
        '沙发',
      ]);
      expect(dataSet.getDimensionValues('sub_type', { type: 'empty' })).toEqual(
        [],
      );
    });
  });

  describe('test for sort', () => {
    test('sort by method', () => {
      dataCfg.sortParams = [
        { sortFieldId: 'province', sortMethod: 'ASC' },
        { sortFieldId: 'city', sortMethod: 'DESC' },
      ];
      dataSet.setDataCfg(dataCfg);
      expect(dataSet.getDimensionValues('province')).toEqual([
        '四川省',
        '浙江省',
      ]);
      expect(dataSet.getDimensionValues('city')).toEqual([
        '舟山市',
        '绍兴市',
        '宁波市',
        '杭州市',
        '南充市',
        '绵阳市',
        '乐山市',
        '成都市',
      ]);
      const sortMethod = 'none' as SortMethod;
      dataCfg.sortParams = [
        { sortFieldId: 'province', sortMethod },
        { sortFieldId: 'city', sortMethod },
      ];
      dataSet.setDataCfg(dataCfg);
      expect(dataSet.getDimensionValues('province')).toEqual([
        '浙江省',
        '四川省',
      ]);
      expect(dataSet.getDimensionValues('city')).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
      ]);
    });

    test('sort by list', () => {
      dataCfg.sortParams = [
        { sortFieldId: 'province', sortBy: ['四川省'] },
        { sortFieldId: 'city', sortBy: ['宁波市', '绵阳市', '乐山市'] },
      ];
      dataSet.setDataCfg(dataCfg);
      expect(dataSet.getDimensionValues('province')).toEqual([
        '四川省',
        '浙江省',
      ]);
      expect(dataSet.getDimensionValues('city')).toEqual([
        '宁波市',
        '绵阳市',
        '乐山市',
        '杭州市',
        '绍兴市',
        '舟山市',
        '成都市',
        '南充市',
      ]);
    });

    test('sort by measure', () => {
      dataCfg.sortParams = [
        {
          sortFieldId: 'sub_type',
          sortByMeasure: 'number',
          sortMethod: 'ASC',
          query: {
            province: '浙江省',
            city: '杭州市',
          },
        },
      ];
      dataSet.setDataCfg(dataCfg);
      // 有query为组内
      expect(dataSet.getDimensionValues('sub_type', { type: '家具' })).toEqual([
        '沙发',
        '桌子',
      ]);
      // 无query
      expect(dataSet.getDimensionValues('sub_type')).toEqual([
        '笔',
        '纸张',
        '沙发',
        '桌子',
      ]);
    });
  });

  describe('test for part-drill-down', () => {
    const root = new Node({ id: `root`, key: '', value: '', children: [] });
    const provinceNode = new Node({
      id: `root[&]浙江省`,
      key: '',
      value: '',
      field: 'province',
      parent: root,
    });
    const cityNode = new Node({
      id: `root[&]浙江省[&]杭州市`,
      key: '',
      value: '',
      field: 'city',
      parent: provinceNode,
    });

    const districtNode = new Node({
      id: `root[&]浙江省[&]杭州市[&]西湖区`,
      key: '',
      value: '',
      field: 'district',
      parent: cityNode,
    });

    test('transformDrillDownData function', () => {
      dataSet.transformDrillDownData('district', drillDownData, cityNode);
      const metaMap = dataSet.rowPivotMeta.get('浙江省').children.get('杭州市');
      expect(metaMap.childField).toEqual('district');
      expect(metaMap.children.get('西湖区')).not.toBeEmpty();
    });

    test('clearDrillDownData function', () => {
      dataSet.transformDrillDownData('district', drillDownData, cityNode);
      dataSet.clearDrillDownData('root[&]浙江省[&]杭州市');
      const metaMap = dataSet.rowPivotMeta.get('浙江省').children.get('杭州市');
      expect(metaMap.childField).toBeUndefined();
      expect(metaMap.children).toBeEmpty();
    });

    test('transformDrillDownData function with totalData', () => {
      dataSet.transformDrillDownData(
        'district',
        [...drillDownData, ...drillDownTotalData],
        cityNode,
      );

      const cellData = dataSet.getCellData({
        query: {
          province: '浙江省',
          city: '杭州市',
          district: '西湖区',
          [EXTRA_FIELD]: 'number',
        },
        isTotals: true,
        rowNode: districtNode,
      });
      expect(cellData.number).toEqual(110);
    });

    test('clearDrillDownData function with totalData', () => {
      dataSet.transformDrillDownData(
        'district',
        [...drillDownData, ...drillDownTotalData],
        cityNode,
      );
      dataSet.clearDrillDownData('root[&]浙江省[&]杭州市');

      const cellData = dataSet.getCellData({
        query: {
          province: '浙江省',
          city: '杭州市',
          district: '西湖区',
          [EXTRA_FIELD]: 'number',
        },
        isTotals: true,
        rowNode: districtNode,
      });
      expect(cellData).toBeUndefined();
    });
  });

  describe('meta config test', () => {
    let dataConfig: S2DataConfig;

    beforeEach(() => {
      dataConfig = assembleDataCfg({
        meta: [
          {
            field: 'price',
            name: '价格',
            description: '价格描述',
          },
          {
            field: 'cost',
            name: '成本',
            description: '成本描述',
          },
        ],
        fields: {
          values: ['price', 'cost'],
          valueInCols: false,
        },
      });
      dataSet.setDataCfg(dataConfig);
    });

    test('should return correct field name', () => {
      expect(dataSet.getFieldName('price')).toStrictEqual('价格');
      expect(dataSet.getFieldName('cost')).toStrictEqual('成本');
      expect(dataSet.getFieldName('')).toEqual('');
      // 找不到名字返回字段本身
      expect(dataSet.getFieldName('not-found-field')).toEqual(
        'not-found-field',
      );
    });

    test('should return correct field description', () => {
      expect(dataSet.getFieldDescription('price')).toStrictEqual('价格描述');
      expect(dataSet.getFieldDescription('cost')).toStrictEqual('成本描述');
      expect(dataSet.getFieldDescription('')).toBeUndefined();
      expect(dataSet.getFieldDescription('xxxx')).toBeUndefined();
    });
  });

  describe('row formatter test', () => {
    let dataConfig: S2DataConfig;
    const mockPriceFormatter = jest.fn();
    const mockCostFormatter = jest.fn();

    beforeEach(() => {
      dataConfig = assembleDataCfg({
        meta: [
          {
            field: 'price',
            formatter: mockPriceFormatter,
          },
          {
            field: 'cost',
            formatter: mockCostFormatter,
          },
        ],
        fields: {
          values: ['price', 'cost'],
          valueInCols: false,
        },
      });
      dataSet.setDataCfg(dataConfig);
    });

    afterEach(() => {
      mockPriceFormatter.mockReset();
      mockCostFormatter.mockReset();
    });

    test('should return correct total measure formatter when values in rows', () => {
      const priceFormatter = dataSet.getFieldFormatter(TOTAL_VALUE, {
        rowQuery: { [EXTRA_FIELD]: 'price' },
      } as unknown as ViewMeta);
      expect(priceFormatter).toEqual(mockPriceFormatter);

      const costFormatter = dataSet.getFieldFormatter(TOTAL_VALUE, {
        rowQuery: { [EXTRA_FIELD]: 'cost' },
      } as unknown as ViewMeta);
      expect(costFormatter).toEqual(mockCostFormatter);
    });

    test('should return default total measure formatter when values in rows', () => {
      const defaultFormatter = dataSet.getFieldFormatter(TOTAL_VALUE, {
        rowQuery: {},
      } as unknown as ViewMeta);
      expect(defaultFormatter).toEqual(mockPriceFormatter);
    });
  });

  describe('the order of the measure values in rows or cols', () => {
    test('should index of the rows of EXTRA_FIELD is 1 when customValueOrder is 1 and valueInCols is false', () => {
      const mockDataCfg: S2DataConfig = assembleDataCfg(dataCfg, {
        fields: {
          valueInCols: false,
          customValueOrder: 1,
        },
      });
      const newData = dataSet.processDataCfg(mockDataCfg);
      expect(newData.fields.rows).toEqual(['province', EXTRA_FIELD, 'city']);
      expect(newData.fields.columns).toEqual(['type', 'sub_type']);
      expect(newData.fields.values).toEqual(['number']);
    });
    test('should index of the cols of EXTRA_FIELD is 0 when customValueOrder is 0 and valueInCols is true', () => {
      const mockDataCfg: S2DataConfig = assembleDataCfg(dataCfg, {
        fields: {
          valueInCols: true,
          customValueOrder: 0,
        },
      });
      const newData = dataSet.processDataCfg(mockDataCfg);
      expect(newData.fields.rows).toEqual(['province', 'city']);
      expect(newData.fields.columns).toEqual([EXTRA_FIELD, 'type', 'sub_type']);
      expect(newData.fields.values).toEqual(['number']);
    });
    test('should customValueOrder is too big, order feature does not work', () => {
      const mockDataCfg: S2DataConfig = assembleDataCfg(dataCfg, {
        fields: {
          valueInCols: true,
          customValueOrder: 3,
        },
      });
      const newData = dataSet.processDataCfg(mockDataCfg);
      expect(newData.fields.rows).toEqual(['province', 'city']);
      expect(newData.fields.columns).toEqual(['type', 'sub_type', EXTRA_FIELD]);
      expect(newData.fields.values).toEqual(['number']);
    });
    test('should customValueOrder is not number, order feature does not work', () => {
      const mockDataCfg: S2DataConfig = assembleDataCfg(dataCfg, {
        fields: {
          valueInCols: true,
          customValueOrder: undefined,
        },
      });
      const newData = dataSet.processDataCfg(mockDataCfg);
      expect(newData.fields.rows).toEqual(['province', 'city']);
      expect(newData.fields.columns).toEqual(['type', 'sub_type', EXTRA_FIELD]);
      expect(newData.fields.values).toEqual(['number']);
    });
  });
});
