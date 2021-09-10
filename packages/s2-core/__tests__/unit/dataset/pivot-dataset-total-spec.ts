/**
 * pivot mode base data-set test.
 */
 import { EXTRA_FIELD, VALUE_FIELD } from 'src/common/constant';
 import { S2DataConfig } from 'src/common/interface';
 import { SpreadSheet } from 'src/sheet-type';
 import { PivotDataSet } from 'src/data-set/pivot-data-set';
 import { DATA_TOTAL_CFG } from '../../data/standard-config';
 import { get } from 'lodash';
 
 jest.mock('src/sheet-type');
 jest.mock('src/facet/layout/node');
 const MockSpreadSheet = SpreadSheet as any as jest.Mock<SpreadSheet>;
 
 describe('Pivot Dataset Test', () => {
   let dataSet: PivotDataSet;
   let dataCfg: S2DataConfig;
 
   beforeEach(() => {
     MockSpreadSheet.mockClear();
     dataSet = new PivotDataSet(new MockSpreadSheet());
 
     dataCfg = DATA_TOTAL_CFG;
     dataSet.setDataCfg(dataCfg);
   });
 
   describe('test base dataset structure', () => {
     test('should get correct row pivot meta', () => {
       const rowPivotMeta = dataSet.rowPivotMeta;
       
       expect([...rowPivotMeta.keys()]).toEqual([
         '浙江省',
         '四川省',
         undefined // 行总计，根据数据结构来的
       ]);
       expect([...rowPivotMeta.get('浙江省').children.keys()]).toEqual([
         '杭州市',
         '绍兴市',
         '宁波市',
         '舟山市',
         undefined // 行小计，来源测试数据
       ]);
       expect([...rowPivotMeta.get('四川省').children.keys()]).toEqual([
         '成都市',
         '绵阳市',
         '南充市',
         '乐山市',
         undefined
       ]);
     });
 
     test('should get correct col pivot meta', () => {
       const colPivotMeta = dataSet.colPivotMeta;
       expect([...colPivotMeta.keys()]).toEqual(['家具', '办公用品', undefined]);
 
       expect([...colPivotMeta.get('家具').children.keys()]).toEqual(['桌子', '沙发', undefined]);
 
       expect([...colPivotMeta.get('办公用品').children.keys()]).toEqual(['笔', '纸张', undefined]);
     });
 
     test('should get correct indexesData', () => {
       const indexesData = dataSet.indexesData;
       expect(get(indexesData, '0.0.undefined.undefined.0')).toEqual({
         province: '浙江省',
         city: '杭州市',
         price: 1454,
         [EXTRA_FIELD]: 'price',
         [VALUE_FIELD]: 1454,
       });
       expect(get(indexesData, '0.0.1.undefined.0')).toEqual({
         province: '浙江省',
         city: '杭州市',
         category: '办公用品',
         price: 254,
         [EXTRA_FIELD]: 'price',
         [VALUE_FIELD]: 254,
       });
       expect(get(indexesData, '1.undefined.1.undefined.0')).toEqual({
        province: '四川省',
        category: '办公用品',
        price: 254,
        [EXTRA_FIELD]: 'price',
        [VALUE_FIELD]: 254,
      });
       expect(get(indexesData, 'undefined.undefined.undefined.undefined.0')).toEqual({
         price: 2454,
         [EXTRA_FIELD]: 'price',
         [VALUE_FIELD]: 2454,
       });
     });
 
     test('should get correct sorted dimension value', () => {
       const sortedDimensionValues = dataSet.sortedDimensionValues;
       expect([...sortedDimensionValues.keys()]).toEqual(['province', 'city', 'category', 'subCategory', EXTRA_FIELD]);
       expect([...sortedDimensionValues.get('province')]).toEqual(['浙江省', '四川省', undefined]);
       expect([...sortedDimensionValues.get('city')]).toEqual(['杭州市', '绍兴市', '宁波市', '舟山市', '成都市', '绵阳市', '南充市', '乐山市', undefined ]);
       expect([...sortedDimensionValues.get('category')]).toEqual(['家具', '办公用品', undefined]);
       expect([...sortedDimensionValues.get('subCategory')]).toEqual(['桌子', '沙发', '笔', '纸张', undefined]);
       expect([...sortedDimensionValues.get(EXTRA_FIELD)]).toEqual(['price']);
     });
   });
 
   describe('test for query data', () => {
     test('getCellData function', () => {
       expect(dataSet.getCellData({ 
         query: {
          province: '浙江省',
          category: '家具',
          subCategory: '桌子',
          [EXTRA_FIELD]: 'price'
         }
       })).toEqual(expect.objectContaining({
         [VALUE_FIELD]: 1254
       }));
 
       expect(dataSet.getCellData({ 
         query: {
          category: '家具',
          subCategory: '桌子',
          [EXTRA_FIELD]: 'price'
         }
       })).toEqual(expect.objectContaining({
         [VALUE_FIELD]: 2254
       }));

       expect(dataSet.getCellData({ 
        query: {
          province: '浙江省',
          city: '杭州市',
          category: '家具',
          [EXTRA_FIELD]: 'price'
        }
       })).toEqual(expect.objectContaining({
        [VALUE_FIELD]: 254
       }));

       expect(dataSet.getCellData({ 
        query: {
          province: '浙江省',
          city: '杭州市',
          [EXTRA_FIELD]: 'price'
        }
       })).toEqual(expect.objectContaining({
        [VALUE_FIELD]: 1454
       }));

       expect(dataSet.getCellData({ 
        query: {
         category: '家具',
         [EXTRA_FIELD]: 'price'
        }
       })).toEqual(expect.objectContaining({
          [VALUE_FIELD]: 2254
       }));

       expect(dataSet.getCellData({ 
        query: {
         [EXTRA_FIELD]: 'price'
        }
       })).toEqual(expect.objectContaining({
          [VALUE_FIELD]: 2454
       }));
     });
 
     test('getMultiData function', () => {
       const specialQuery = {
         province: '浙江省',
         city: '杭州市',
         category: '家具',
         subCategory: '桌子',
         [EXTRA_FIELD]: 'price'
       };
       expect(dataSet.getMultiData(specialQuery)).toHaveLength(1);
       expect(dataSet.getMultiData(specialQuery)[0]).toEqual(expect.objectContaining({
         [VALUE_FIELD]: 254
       }));

       expect(dataSet.getMultiData({
         province: '浙江省',
         category: '家具',
         subCategory: '桌子',
         [EXTRA_FIELD]: 'price'
       })).toHaveLength(5);
 
       expect(dataSet.getMultiData({
         category: '家具',
         subCategory: '桌子',
         [EXTRA_FIELD]: 'price'
       })).toHaveLength(11);
 
       expect(dataSet.getMultiData({
         category: '家具',
         [EXTRA_FIELD]: 'price'
       })).toHaveLength(33);
 
       expect(dataSet.getMultiData({
         [EXTRA_FIELD]: 'price'
       })).toHaveLength(77);
     });
 
     test('getDimensionValues function', () => {
       // without query
       expect(dataSet.getDimensionValues('province')).toEqual(['浙江省', '四川省']);
       expect(dataSet.getDimensionValues('city')).toEqual(['杭州市', '绍兴市', '宁波市', '舟山市', '成都市', '绵阳市', '南充市', '乐山市']);
       expect(dataSet.getDimensionValues('category')).toEqual(['家具', '办公用品']);
       expect(dataSet.getDimensionValues('subCategory')).toEqual(['桌子', '沙发', '笔', '纸张']);
       expect(dataSet.getDimensionValues(EXTRA_FIELD)).toEqual(['price']);
       expect(dataSet.getDimensionValues('empty')).toEqual([]);
 
       // with query
       expect(dataSet.getDimensionValues('city', { 'province': '四川省'})).toEqual(['成都市', '绵阳市', '南充市', '乐山市']);
       expect(dataSet.getDimensionValues('subCategory', { 'category': '家具'})).toEqual(['桌子', '沙发']);
       expect(dataSet.getDimensionValues('subCategory', { 'category': 'empty'})).toEqual([]);
     });
   });
 });