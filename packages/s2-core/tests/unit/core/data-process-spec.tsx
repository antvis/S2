/** 核心数据流程 */
import { flattenDeep, get } from 'lodash';
import { EXTRA_FIELD, VALUE_FIELD } from 'src/common/constant';
import { S2DataConfig, S2Options } from 'src/common/interface';
import { SpreadSheet } from 'src/sheet-type';
import { PivotDataSet } from 'src/data-set/pivot-data-set';
import STANDARD_SPREADSHEET_DATA from '../../data/standard-spreadsheet-data';

jest.mock('src/sheet-type');
const MockSpreadSheet = SpreadSheet as any as jest.Mock<SpreadSheet>;

describe('Pivot Dataset Test', () => {
  let dataSet: PivotDataSet;
  let dataCfg: S2DataConfig;
  beforeEach(() => {
    MockSpreadSheet.mockClear();
    dataSet = new PivotDataSet(new MockSpreadSheet());
  });

  describe('1、Transform indexes data', () => {
    beforeEach(() => {
      dataCfg = {
        fields: { rows: ['province', 'city'], columns: ['category', 'subCategory'], values: ['price'] },
        data: STANDARD_SPREADSHEET_DATA,
      };
    });
    test('should get correct indexes data', () => {
      dataSet.setDataCfg(dataCfg);
      const indexesData = dataSet.indexesData;

      expect(flattenDeep(indexesData)).toHaveLength(STANDARD_SPREADSHEET_DATA.length);
      // 由于是直接调用 dataSet.setDataCfg，没有经过 saveDataCfg 处理, valueInCols 为 false
      expect(get(indexesData, '0.0.0.0.0')).toEqual({ province: '浙江省', city: '杭州市', category: '家具', subCategory: '桌子', price: 254, [VALUE_FIELD]: 254, [EXTRA_FIELD]: 'price' }); // 左上角
      expect(get(indexesData, '0.0.0.1.1')).toEqual({ province: '浙江省', city: '杭州市', category: '办公用品', subCategory: '纸张', price: 514, [VALUE_FIELD]: 514, [EXTRA_FIELD]: 'price' }); // 右上角
      expect(get(indexesData, '1.3.0.0.0')).toEqual({ province: '四川省', city: '乐山市', category: '家具', subCategory: '桌子', price: 326, [VALUE_FIELD]: 326, [EXTRA_FIELD]: 'price' }); // 左下角
      expect(get(indexesData, '1.3.0.1.1')).toEqual({ province: '四川省', city: '乐山市', category: '办公用品', subCategory: '纸张', price: 116, [VALUE_FIELD]: 116, [EXTRA_FIELD]: 'price' }); // 右下角
      expect(get(indexesData, '0.3.0.1.0')).toEqual({ province: '浙江省', city: '舟山市', category: '办公用品', subCategory: '笔', price: 396, [VALUE_FIELD]: 396, [EXTRA_FIELD]: 'price' }); // 中间
    });

    // test('should get correct pivot meta', () => {
    //   dataSet.setDataCfg(dataCfg);
    //   debugger;
    // });
  });
  
});
