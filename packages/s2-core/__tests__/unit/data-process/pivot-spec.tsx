/**
 * 透视表核心数据流程（保证基本数据正确）
 *
 */
import { flattenDeep, get, uniq } from 'lodash';
import { assembleDataCfg, assembleOptions } from '../../util';
import { getContainer } from '../../util/helpers';
import { data } from '../../data/mock-dataset.json';
import type { ViewMeta } from '../../../src/common';
import type { CellData } from '../../../src';
import { VALUE_FIELD } from '@/common/constant';
import type { PivotDataSet } from '@/data-set/pivot-data-set';
import { PivotSheet, SpreadSheet } from '@/sheet-type';

describe('Pivot Table Core Data Process', () => {
  let s2: SpreadSheet;

  beforeAll(async () => {
    s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        data,
      }),
      assembleOptions({}),
    );

    await s2.render();
  });

  describe('1、Transform indexes data', () => {
    test('should get correct pivot meta', () => {
      const ds = s2.dataSet as PivotDataSet;
      const rowPivotMeta = ds.rowPivotMeta;
      const colPivotMeta = ds.colPivotMeta;

      expect([...rowPivotMeta.keys()]).toEqual(['浙江省', '四川省']);
      expect([...colPivotMeta.keys()]).toEqual(['家具', '办公用品']);
      expect([...rowPivotMeta.get('浙江省')!.children.keys()]).toEqual([
        '杭州市',
        '绍兴市',
        '宁波市',
        '舟山市',
      ]);
      expect([...rowPivotMeta.get('四川省')!.children.keys()]).toEqual([
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
      ]);
    });

    test('should get correct indexes data', () => {
      const prefix = 'province[&]city[&]type[&]sub_type';

      const ds = s2.dataSet as PivotDataSet;
      const indexesData = ds.indexesData;

      expect(flattenDeep(indexesData[prefix]).filter(Boolean)).toHaveLength(
        data.length,
      );

      // 左上角
      expect(get(indexesData, [prefix, 1, 1, 1, 1, 1])).toEqual({
        province: '浙江省',
        city: '杭州市',
        type: '家具',
        sub_type: '桌子',
        number: 7789,
      });

      // 右上角
      expect(get(indexesData, [prefix, 1, 1, 2, 2, 1])).toEqual({
        province: '浙江省',
        city: '杭州市',
        type: '办公用品',
        sub_type: '纸张',
        number: 1343,
      });

      // 左下角
      expect(get(indexesData, [prefix, 2, 4, 1, 1, 1])).toEqual({
        province: '四川省',
        city: '乐山市',
        type: '家具',
        sub_type: '桌子',
        number: 2330,
      });

      // 右下角
      expect(get(indexesData, [prefix, 2, 4, 2, 2, 1])).toEqual({
        province: '四川省',
        city: '乐山市',
        type: '办公用品',
        sub_type: '纸张',
        number: 352,
      });

      // 中间
      expect(get(indexesData, [prefix, 1, 4, 2, 1, 1])).toEqual({
        province: '浙江省',
        city: '舟山市',
        type: '办公用品',
        sub_type: '笔',
        number: 1432,
      });
    });
  });

  describe('2、Generate hierarchy', () => {
    test('should get correct row hierarchy structure', () => {
      const layoutResult = s2.facet.getLayoutResult();
      const { rowsHierarchy } = layoutResult;

      // 节点正确
      expect(rowsHierarchy.getIndexNodes()).toHaveLength(8);
      expect(rowsHierarchy.getNodes()).toHaveLength(10);
      // 叶子节点正确
      expect(rowsHierarchy.getLeaves().map((node) => node.value)).toEqual([
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
      expect(rowsHierarchy.getNodes().map((node) => node.value)).toEqual([
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
      expect(rowsHierarchy.getNodes(0).map((node) => node.value)).toEqual([
        '浙江省',
        '四川省',
      ]);
      expect(rowsHierarchy.getNodes(1).map((node) => node.value)).toEqual([
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

      expect(firstLeafNode.value).toEqual('杭州市');
      expect(firstLeafNode.parent!.value).toEqual('浙江省');
      expect(firstLeafNode.parent!.children?.map((node) => node.value)).toEqual(
        ['杭州市', '绍兴市', '宁波市', '舟山市'],
      );
      const lastLeafNode = leavesNodes[leavesNodes.length - 1];

      expect(lastLeafNode.value).toEqual('乐山市');
      expect(lastLeafNode.parent!.value).toEqual('四川省');
      expect(lastLeafNode.parent!.children?.map((node) => node.value)).toEqual([
        '成都市',
        '绵阳市',
        '南充市',
        '乐山市',
      ]);
    });
    test('should get correct col hierarchy structure', () => {
      const layoutResult = s2.facet.getLayoutResult();
      const { colsHierarchy } = layoutResult;

      // 节点正确
      expect(colsHierarchy.getIndexNodes()).toHaveLength(4);
      expect(colsHierarchy.getNodes()).toHaveLength(10); // 价格在列头 家具[&]桌子[&]number
      // 叶子节点正确
      expect(colsHierarchy.getLeaves().map((node) => node.value)).toEqual([
        'number',
        'number',
        'number',
        'number',
      ]);
      // 层级正确
      expect(colsHierarchy.getNodes().map((node) => node.value)).toEqual([
        '家具',
        '桌子',
        'number',
        '沙发',
        'number',
        '办公用品',
        '笔',
        'number',
        '纸张',
        'number',
      ]);
      expect(colsHierarchy.getNodes(0).map((node) => node.value)).toEqual([
        '家具',
        '办公用品',
      ]);
      expect(colsHierarchy.getNodes(1).map((node) => node.value)).toEqual([
        '桌子',
        '沙发',
        '笔',
        '纸张',
      ]);
      expect(colsHierarchy.getNodes(2).map((node) => node.value)).toEqual([
        'number',
        'number',
        'number',
        'number',
      ]);

      // 父子关系正确
      const leavesNodes = colsHierarchy.getLeaves();
      const firstLeafNode = leavesNodes[0];

      expect(firstLeafNode.value).toEqual('number');
      expect(firstLeafNode.parent!.value).toEqual('桌子');
      expect(firstLeafNode.parent!.parent?.value).toEqual('家具');
      expect(
        firstLeafNode.parent!.parent?.children?.map((node) => node.value),
      ).toEqual(['桌子', '沙发']);
      const lastLeafNode = leavesNodes[leavesNodes.length - 1];

      expect(lastLeafNode.value).toEqual('number');
      expect(lastLeafNode.parent!.value).toEqual('纸张');
      expect(lastLeafNode.parent!.parent?.value).toEqual('办公用品');
      expect(
        lastLeafNode.parent!.parent?.children?.map((node) => node.value),
      ).toEqual(['笔', '纸张']);
    });
  });

  describe('3、Calculate row & col coordinates', () => {
    test('should calc correct row & cell width', () => {
      const { rowLeafNodes, colLeafNodes } = s2.facet.getLayoutResult();

      expect(rowLeafNodes[0].width).toEqual(99.66);
      expect(colLeafNodes[0].width).toEqual(99.67);
    });
    test('should calc correct row node size and coordinate', () => {
      const { dataCell } = s2.options.style!;
      const { rowsHierarchy, rowLeafNodes } = s2.facet.getLayoutResult();

      // all sample width.
      expect(rowsHierarchy.sampleNodesForAllLevels[0]?.width).toEqual(99.66);
      expect(rowsHierarchy.sampleNodesForAllLevels[1]?.width).toEqual(99.66);
      // all width
      expect(uniq(rowsHierarchy.getNodes().map((node) => node.width))).toEqual([
        99.66,
      ]);
      // leaf node
      rowLeafNodes.forEach((node, index) => {
        expect(node.height).toEqual(dataCell?.height!);
        expect(node.y).toEqual(node.height * index);
        expect(node.x).toEqual(99.66);
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
      const { colCell } = s2.options.style!;
      const layoutResult = s2.facet.getLayoutResult();
      const { colsHierarchy, colLeafNodes } = layoutResult;

      // sample height
      expect(colsHierarchy.sampleNodesForAllLevels[0]?.height).toEqual(
        colCell?.height,
      );
      expect(colsHierarchy.sampleNodesForAllLevels[1]?.height).toEqual(
        colCell?.height,
      );
      expect(colsHierarchy.sampleNodesForAllLevels[2]?.height).toEqual(
        colCell?.height,
      );
      // all height
      expect(uniq(colsHierarchy.getNodes().map((node) => node.height))).toEqual(
        [colCell?.height],
      );
      // leaf node
      colLeafNodes.forEach((node, index) => {
        const width = Math.floor(node.width);

        expect(width).toEqual(99);
        expect(node.x).toEqual(node.width * index);
        expect(node.y).toEqual(node.level * (colCell!.height as number));
      });
      // level = 0;
      const typeNodes = colsHierarchy.getNodes(0);

      typeNodes.forEach((node) => {
        expect(node.width).toEqual(
          node.children
            .map((value) => value.width)
            .reduce((sum, current) => sum + current),
        );
        expect(node.x).toEqual(node.children[0].x);
      });
      // level = 1;
      const type1Nodes = colsHierarchy.getNodes(1);

      type1Nodes.forEach((node) => {
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
    test('should get correct data value', () => {
      const getData = (meta: ViewMeta | null) =>
        (meta?.data as CellData)?.[VALUE_FIELD];

      // 左上角
      expect(getData(s2.facet.getCellMeta(0, 0))).toBe(7789);
      expect(getData(s2.facet.getCellMeta(1, 0))).toBe(2367);
      expect(getData(s2.facet.getCellMeta(0, 1))).toBe(5343);
      expect(getData(s2.facet.getCellMeta(1, 1))).toBe(632);
      // 右下角
      expect(getData(s2.facet.getCellMeta(7, 3))).toBe(352);
      expect(getData(s2.facet.getCellMeta(7, 2))).toBe(2458);
      expect(getData(s2.facet.getCellMeta(6, 3))).toBe(3551);
      expect(getData(s2.facet.getCellMeta(6, 2))).toBe(2457);
      // 右上角
      expect(getData(s2.facet.getCellMeta(0, 3))).toBe(1343);
      expect(getData(s2.facet.getCellMeta(0, 2))).toBe(945);
      expect(getData(s2.facet.getCellMeta(1, 3))).toBe(1354);
      expect(getData(s2.facet.getCellMeta(1, 2))).toBe(1304);
      // 左下角
      expect(getData(s2.facet.getCellMeta(7, 0))).toBe(2330);
      expect(getData(s2.facet.getCellMeta(7, 1))).toBe(2445);
      expect(getData(s2.facet.getCellMeta(6, 0))).toBe(1943);
      expect(getData(s2.facet.getCellMeta(6, 1))).toBe(2333);
    });
  });
});
