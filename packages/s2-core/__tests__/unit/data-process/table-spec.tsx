/**
 * 明细表核心数据流程
 * 差别：
 * - 明细表不需要计算二维数组数据
 * - 明细表不需要生成 Row Hierarchy（但为了流程一致会生成空结构）
 */
import { assembleDataCfg, assembleOptions } from '../../util';
import { getContainer } from '../../util/helpers';
import { ROOT_NODE_ID } from '../../../src';
import { SpreadSheet, TableSheet } from '@/sheet-type';

describe('List Table Core Data Process', () => {
  let s2: SpreadSheet;

  beforeAll(async () => {
    s2 = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({}),
    );

    await s2.render();
  });

  describe('1、Generate Col Hierarchy', () => {
    test('should get correct col hierarchy structure', () => {
      const { colsHierarchy } = s2.facet.getLayoutResult();

      // 节点正确
      expect(colsHierarchy.getIndexNodes()).toHaveLength(5);
      expect(colsHierarchy.getLeaves()).toHaveLength(5);
      // 层级正确
      expect(colsHierarchy.getNodes().map((node) => node.value)).toEqual([
        'province',
        'city',
        'type',
        'sub_type',
        'number',
      ]);
      // 父子关系正确
      const nodes = colsHierarchy.getNodes();

      nodes.forEach((node) => {
        expect(node.children).toEqual([]);
        expect(node.parent!.id).toEqual(ROOT_NODE_ID);
      });
    });
  });

  describe('2、Calculate overlapped data cell info', () => {
    test('should get correct data value', () => {
      // 第一行
      expect(s2.facet.getCellMeta(0, 0)!.data).toEqual({ province: '浙江省' });
      expect(s2.facet.getCellMeta(0, 1)!.data).toEqual({ city: '杭州市' });
      expect(s2.facet.getCellMeta(0, 2)!.data).toEqual({ type: '家具' });
      expect(s2.facet.getCellMeta(0, 3)!.data).toEqual({ sub_type: '桌子' });
      expect(s2.facet.getCellMeta(0, 4)!.data).toEqual({ number: 7789 });
      // 第三行
      expect(s2.facet.getCellMeta(2, 0)!.data).toEqual({ province: '浙江省' });
      expect(s2.facet.getCellMeta(2, 1)!.data).toEqual({ city: '宁波市' });
      expect(s2.facet.getCellMeta(2, 2)!.data).toEqual({ type: '家具' });
      expect(s2.facet.getCellMeta(2, 3)!.data).toEqual({ sub_type: '桌子' });
      expect(s2.facet.getCellMeta(2, 4)!.data).toEqual({ number: 3877 });
    });
  });
});
