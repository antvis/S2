/**
 * 交叉表核心数据流程（保证基本数据正确）
 * */
import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant';
import { PivotDataSet } from '@/data-set/pivot-data-set';
import { SpreadSheet } from '@/sheet-type';
import { flattenDeep, get, size, uniq } from 'lodash';
import STANDARD_SPREADSHEET_DATA from '../../../data/standard-spreadsheet-data.json';
import { getContainer } from '../../../util/helpers';

describe('Cross Table Core Data Process', () => {
  const options = { width: 1200, height: 800 };
  const dataCfg = {
    fields: {
      rows: ['province', 'city'],
      columns: ['category', 'subCategory'],
      values: ['price'],
    },
    data: STANDARD_SPREADSHEET_DATA.data,
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
      expect([...rowPivotMeta.get('浙江省').children.keys()]).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
      ]);
      expect([...rowPivotMeta.get('四川省').children.keys()]).toEqual([
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
      ]);
    });

    test('should get correct indexes data', () => {
      const indexesData = ds.indexesData;
      expect(flattenDeep(indexesData)).toHaveLength(
        STANDARD_SPREADSHEET_DATA.data.length,
      );
      expect(get(indexesData, '0.0.0.0.0')).toEqual({
        province: '浙江省',
        city: '杭州市',
        category: '家具',
        subCategory: '桌子',
        price: 254,
        [VALUE_FIELD]: 254,
        [EXTRA_FIELD]: 'price',
      }); // 左上角
      expect(get(indexesData, '0.0.1.1.0')).toEqual({
        province: '浙江省',
        city: '杭州市',
        category: '办公用品',
        subCategory: '纸张',
        price: 514,
        [VALUE_FIELD]: 514,
        [EXTRA_FIELD]: 'price',
      }); // 右上角
      expect(get(indexesData, '1.3.0.0.0')).toEqual({
        province: '四川省',
        city: '乐山市',
        category: '家具',
        subCategory: '桌子',
        price: 326,
        [VALUE_FIELD]: 326,
        [EXTRA_FIELD]: 'price',
      }); // 左下角
      expect(get(indexesData, '1.3.1.1.0')).toEqual({
        province: '四川省',
        city: '乐山市',
        category: '办公用品',
        subCategory: '纸张',
        price: 116,
        [VALUE_FIELD]: 116,
        [EXTRA_FIELD]: 'price',
      }); // 右下角
      expect(get(indexesData, '0.3.1.0.0')).toEqual({
        province: '浙江省',
        city: '舟山市',
        category: '办公用品',
        subCategory: '笔',
        price: 396,
        [VALUE_FIELD]: 396,
        [EXTRA_FIELD]: 'price',
      }); // 中间
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
      expect(rowsHierarchy.getLeaves().map((node) => node.label)).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
      ]);
      // 层级正确
      expect(rowsHierarchy.getNodes().map((node) => node.label)).toEqual([
        '浙江省',
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
        '四川省',
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
      ]);
      expect(rowsHierarchy.getNodes(0).map((node) => node.label)).toEqual([
        '浙江省',
        '四川省',
      ]);
      expect(rowsHierarchy.getNodes(1).map((node) => node.label)).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
      ]);
      // 父子关系正确
      const leavesNodes = rowsHierarchy.getLeaves();
      const firstLeafNode = leavesNodes[0];
      expect(firstLeafNode.label).toEqual('杭州市');
      expect(firstLeafNode.parent.label).toEqual('浙江省');
      expect(firstLeafNode.parent.children?.map((node) => node.label)).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
      ]);
      const lastLeafNode = leavesNodes[leavesNodes.length - 1];
      expect(lastLeafNode.label).toEqual('乐山市');
      expect(lastLeafNode.parent.label).toEqual('四川省');
      expect(lastLeafNode.parent.children?.map((node) => node.label)).toEqual([
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
      ]);
    });
    test('should get correct col hierarchy structure', () => {
      // 节点正确
      expect(colsHierarchy.getIndexNodes()).toHaveLength(4);
      expect(colsHierarchy.getNodes()).toHaveLength(10); // 价格在列头 家具[&]桌子[&]price
      // 叶子节点正确
      expect(colsHierarchy.getLeaves().map((node) => node.label)).toEqual([
        'price',
        'price',
        'price',
        'price',
      ]);
      // 层级正确
      expect(colsHierarchy.getNodes().map((node) => node.label)).toEqual([
        '家具',
        '桌子',
        'price',
        '沙发',
        'price',
        '办公用品',
        '笔',
        'price',
        '纸张',
        'price',
      ]);
      expect(colsHierarchy.getNodes(0).map((node) => node.label)).toEqual([
        '家具',
        '办公用品',
      ]);
      expect(colsHierarchy.getNodes(1).map((node) => node.label)).toEqual([
        '桌子',
        '沙发',
        '笔',
        '纸张',
      ]);
      expect(colsHierarchy.getNodes(2).map((node) => node.label)).toEqual([
        'price',
        'price',
        'price',
        'price',
      ]);
      // 父子关系正确
      const leavesNodes = colsHierarchy.getLeaves();
      const firstLeafNode = leavesNodes[0];
      expect(firstLeafNode.label).toEqual('price');
      expect(firstLeafNode.parent.label).toEqual('桌子');
      expect(firstLeafNode.parent.parent?.label).toEqual('家具');
      expect(
        firstLeafNode.parent.parent?.children?.map((node) => node.label),
      ).toEqual(['桌子', '沙发']);
      const lastLeafNode = leavesNodes[leavesNodes.length - 1];
      expect(lastLeafNode.label).toEqual('price');
      expect(lastLeafNode.parent.label).toEqual('纸张');
      expect(lastLeafNode.parent.parent?.label).toEqual('办公用品');
      expect(
        lastLeafNode.parent.parent?.children?.map((node) => node.label),
      ).toEqual(['笔', '纸张']);
    });
  });

  describe('3、Calculate row & col coordinates', () => {
    const { width, style } = ss.options;
    const { fields } = ss.dataCfg;
    const {
      rowsHierarchy,
      colsHierarchy,
      rowLeafNodes,
      colLeafNodes,
      getCellMeta,
    } = ss.facet.layoutResult;
    const { cellCfg, rowCfg, colCfg } = get(ss, 'facet.cfg');
    test('should calc correct row & cell width', () => {
      expect(cellCfg.width).toEqual(
        Math.max(
          style.cellCfg.width,
          width / (size(fields.rows) + size(colLeafNodes)),
        ),
      );
      expect(rowCfg.width).toEqual(
        Math.max(
          style.cellCfg.width,
          width / (size(fields.rows) + size(colLeafNodes)),
        ),
      );
    });
    test('should calc correct row node size and coordinate', () => {
      // all sample width.
      expect(rowsHierarchy.sampleNodesForAllLevels[0]?.width).toEqual(
        rowCfg.width,
      );
      expect(rowsHierarchy.sampleNodesForAllLevels[1]?.width).toEqual(
        rowCfg.width,
      );
      // all width
      expect(uniq(rowsHierarchy.getNodes().map((node) => node.width))).toEqual([
        rowCfg.width,
      ]);
      // leaf node
      rowLeafNodes.forEach((node, index) => {
        expect(node.height).toEqual(
          cellCfg.height + cellCfg.padding?.top + cellCfg.padding?.bottom,
        );
        expect(node.y).toEqual(node.height * index);
        expect(node.x).toEqual(rowCfg.width);
      });
      // level = 0
      const provinceNodes = rowsHierarchy.getNodes(0);
      provinceNodes.forEach((node) => {
        expect(node.height).toEqual(
          node.children
            .map((value) => value.height)
            .reduce((sum, current) => sum + current),
        );
        expect(node.y).toEqual(node.children[0].y);
      });
    });

    test('should calc correct col node size and coordinate', () => {
      // sample height
      expect(colsHierarchy.sampleNodesForAllLevels[0]?.height).toEqual(
        colCfg.height,
      );
      expect(colsHierarchy.sampleNodesForAllLevels[1]?.height).toEqual(
        colCfg.height,
      );
      expect(colsHierarchy.sampleNodesForAllLevels[2]?.height).toEqual(
        colCfg.height,
      );
      // all height
      expect(uniq(colsHierarchy.getNodes().map((node) => node.height))).toEqual(
        [colCfg.height],
      );
      // leaf node
      colLeafNodes.forEach((node, index) => {
        expect(node.width).toEqual(cellCfg.width);
        expect(node.x).toEqual(node.width * index);
        expect(node.y).toEqual(node.level * colCfg.height);
      });
      // level = 0;
      const categoryNodes = colsHierarchy.getNodes(0);
      categoryNodes.forEach((node) => {
        expect(node.width).toEqual(
          node.children
            .map((value) => value.width)
            .reduce((sum, current) => sum + current),
        );
        expect(node.x).toEqual(node.children[0].x);
      });
      // level = 1;
      const category1Nodes = colsHierarchy.getNodes(1);
      category1Nodes.forEach((node) => {
        expect(node.width).toEqual(
          node.children
            .map((value) => value.width)
            .reduce((sum, current) => sum + current),
        );
        expect(node.x).toEqual(node.children[0].x);
      });
    });
  });

  describe('4、Calculate data cell info', () => {
    const { getCellMeta } = ss.facet.layoutResult;
    test('should get correct data value', () => {
      // 左上角
      expect(getCellMeta(0, 0).data[VALUE_FIELD]).toBe(254);
      expect(getCellMeta(1, 0).data[VALUE_FIELD]).toBe(156);
      expect(getCellMeta(0, 1).data[VALUE_FIELD]).toBe(554);
      expect(getCellMeta(1, 1).data[VALUE_FIELD]).toBe(956);
      // 右下角
      expect(getCellMeta(7, 3).data[VALUE_FIELD]).toBe(116);
      expect(getCellMeta(7, 2).data[VALUE_FIELD]).toBe(396);
      expect(getCellMeta(6, 3).data[VALUE_FIELD]).toBe(293);
      expect(getCellMeta(6, 2).data[VALUE_FIELD]).toBe(253);
      // 右上角
      expect(getCellMeta(0, 3).data[VALUE_FIELD]).toBe(514);
      expect(getCellMeta(0, 2).data[VALUE_FIELD]).toBe(854);
      expect(getCellMeta(1, 3).data[VALUE_FIELD]).toBe(956);
      expect(getCellMeta(1, 2).data[VALUE_FIELD]).toBe(126);
      // 左下角
      expect(getCellMeta(7, 0).data[VALUE_FIELD]).toBe(326);
      expect(getCellMeta(7, 1).data[VALUE_FIELD]).toBe(126);
      expect(getCellMeta(6, 0).data[VALUE_FIELD]).toBe(273);
      expect(getCellMeta(6, 1).data[VALUE_FIELD]).toBe(273);
    });
  });
});
