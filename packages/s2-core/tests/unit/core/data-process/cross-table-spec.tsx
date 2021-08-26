/** 
 * 交叉表核心数据流程（保证基本数据正确）
 **/
import { flattenDeep, get } from 'lodash';
import { SpreadSheet } from 'src/sheet-type';
import { EXTRA_FIELD, VALUE_FIELD } from 'src/common/constant';
import { PivotDataSet } from 'src/data-set/pivot-data-set';
import STANDARD_SPREADSHEET_DATA from '../../../data/standard-spreadsheet-data';
import { getContainer } from '../../../util/helpers';

describe('Cross Table Core Data Process', () => {
  const options = { width: 800, height: 600 };
  const dataCfg = {
    fields: { rows: ['province', 'city'], columns: ['category', 'subCategory'], values: ['price'] },
    data: STANDARD_SPREADSHEET_DATA,
  };
  const ss = new SpreadSheet(getContainer(), dataCfg, options);
  ss.render();

  describe('1、Transform indexes data', () => {
    const ds = ss.dataSet as PivotDataSet;
    test('should get correct pivot meta', () => {
      const rowPivotMeta = ds.rowPivotMeta;
      const colPivotMeta = ds.colPivotMeta;
      expect([...rowPivotMeta.keys()]).toEqual(['浙江省', '四川省']);
      expect([...colPivotMeta.keys()]).toEqual(['家具', '办公用品']);
      expect([...rowPivotMeta.get('浙江省').children.keys()]).toEqual(['杭州市','绍兴市','宁波市','舟山市']);
      expect([...rowPivotMeta.get('四川省').children.keys()]).toEqual(['成都市','绵阳市','南充市','乐山市']);
    });

    test('should get correct indexes data', () => {
      const indexesData = ds.indexesData;
      expect(flattenDeep(indexesData)).toHaveLength(STANDARD_SPREADSHEET_DATA.length);
      expect(get(indexesData, '0.0.0.0.0')).toEqual({ province: '浙江省', city: '杭州市', category: '家具', subCategory: '桌子', price: 254, [VALUE_FIELD]: 254, [EXTRA_FIELD]: 'price' }); // 左上角
      expect(get(indexesData, '0.0.1.1.0')).toEqual({ province: '浙江省', city: '杭州市', category: '办公用品', subCategory: '纸张', price: 514, [VALUE_FIELD]: 514, [EXTRA_FIELD]: 'price' }); // 右上角
      expect(get(indexesData, '1.3.0.0.0')).toEqual({ province: '四川省', city: '乐山市', category: '家具', subCategory: '桌子', price: 326, [VALUE_FIELD]: 326, [EXTRA_FIELD]: 'price' }); // 左下角
      expect(get(indexesData, '1.3.1.1.0')).toEqual({ province: '四川省', city: '乐山市', category: '办公用品', subCategory: '纸张', price: 116, [VALUE_FIELD]: 116, [EXTRA_FIELD]: 'price' }); // 右下角
      expect(get(indexesData, '0.3.1.0.0')).toEqual({ province: '浙江省', city: '舟山市', category: '办公用品', subCategory: '笔', price: 396, [VALUE_FIELD]: 396, [EXTRA_FIELD]: 'price' }); // 中间
    });
  });

  describe('2、Generate hierarchy', () => {
    const layoutResult = ss.facet.layoutResult;
    const { rowsHierarchy, colsHierarchy } = layoutResult;
    
    test('should get correct row hierarchy structure', () => {
      // 节点正确
      expect(rowsHierarchy.getIndexNodes()).toHaveLength(8);
      expect(rowsHierarchy.getNodes()).toHaveLength(10);
      // 叶子节点正确
      expect(rowsHierarchy.getLeaves().map(node => node.label)).toEqual(['杭州市', '绍兴市', '宁波市', '舟山市', '成都市', '绵阳市', '南充市', '乐山市']);
      // 层级正确
      expect(rowsHierarchy.getNodes().map(node => node.label)).toEqual(['浙江省', '杭州市', '绍兴市', '宁波市', '舟山市', '四川省', '成都市', '绵阳市', '南充市', '乐山市']);
      expect(rowsHierarchy.getNodes(0).map(node => node.label)).toEqual(['浙江省', '四川省']);
      expect(rowsHierarchy.getNodes(1).map(node => node.label)).toEqual(['杭州市', '绍兴市', '宁波市', '舟山市', '成都市', '绵阳市', '南充市', '乐山市']);
      // 父子关系正确
      const leavesNodes = rowsHierarchy.getLeaves();
      const firstLeafNode = leavesNodes[0];
      expect(firstLeafNode.label).toEqual('杭州市');
      expect(firstLeafNode.parent.label).toEqual('浙江省');
      expect(firstLeafNode.parent.children?.map(node => node.label)).toEqual(['杭州市', '绍兴市', '宁波市', '舟山市']);
      const lastLeafNode = leavesNodes[leavesNodes.length - 1];
      expect(lastLeafNode.label).toEqual('乐山市');
      expect(lastLeafNode.parent.label).toEqual('四川省');
      expect(lastLeafNode.parent.children?.map(node => node.label)).toEqual(['成都市', '绵阳市', '南充市', '乐山市']);
    });
    test('should get correct col hierarchy structure', () => {
      // 节点正确
      expect(colsHierarchy.getIndexNodes()).toHaveLength(4);
      expect(colsHierarchy.getNodes()).toHaveLength(10); // 价格在列头 家具[&]桌子[&]price 
      // 叶子节点正确
      expect(colsHierarchy.getLeaves().map(node => node.label)).toEqual(['price', 'price', 'price', 'price'])
      // 层级正确
      expect(colsHierarchy.getNodes().map(node => node.label)).toEqual(['家具', '桌子', 'price', '沙发',  'price', '办公用品', '笔', 'price', '纸张', 'price']);
      expect(colsHierarchy.getNodes(0).map(node => node.label)).toEqual(['家具', '办公用品']);
      expect(colsHierarchy.getNodes(1).map(node => node.label)).toEqual(['桌子', '沙发', '笔', '纸张']);
      expect(colsHierarchy.getNodes(2).map(node => node.label)).toEqual(['price', 'price', 'price', 'price']);
      // 父子关系正确
      const leavesNodes = colsHierarchy.getLeaves();
      const firstLeafNode = leavesNodes[0];
      expect(firstLeafNode.label).toEqual('price');
      expect(firstLeafNode.parent.label).toEqual('桌子');
      expect(firstLeafNode.parent.parent?.label).toEqual('家具');
      expect(firstLeafNode.parent.parent?.children?.map(node => node.label)).toEqual(['桌子', '沙发']);
      const lastLeafNode = leavesNodes[leavesNodes.length - 1];
      expect(lastLeafNode.label).toEqual('price');
      expect(lastLeafNode.parent.label).toEqual('纸张');
      expect(lastLeafNode.parent.parent?.label).toEqual('办公用品');
      expect(lastLeafNode.parent.parent?.children?.map(node => node.label)).toEqual(['笔', '纸张']);
    });
  });

  describe('3、Calculate row & col coordinates', () => {
    test('1', () => {});
  });

  describe('4、Calculate overlapped data cell info', () => {
    test('1', () => {});
  });
  
});
