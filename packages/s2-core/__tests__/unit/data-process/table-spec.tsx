/**
 * 明细表核心数据流程
 * 差别：
 * - 明细表不需要计算二维数组数据
 * - 明细表不需要生成 Row Hierarchy（但为了流程一致会生成空结构）
 */
import { get } from 'lodash';
import { TableSheet } from 'src/sheet-type';
import { assembleDataCfg, assembleOptions } from '../../util';
import { getContainer } from '../../util/helpers';

describe('List Table Core Data Process', () => {
  const s2 = new TableSheet(
    getContainer(),
    assembleDataCfg({
      meta: [],
      fields: {
        columns: ['province', 'city', 'type', 'sub_type', 'number'],
      },
    }),
    assembleOptions({}),
  );
  s2.render();

  describe('1、Generate Col Hierarchy', () => {
    const layoutResult = s2.facet.layoutResult;
    const { colsHierarchy } = layoutResult;

    test('should get correct col hierarchy structure', () => {
      // 节点正确
      expect(colsHierarchy.getIndexNodes()).toHaveLength(5);
      expect(colsHierarchy.getLeaves()).toHaveLength(5);
      // 层级正确
      expect(colsHierarchy.getNodes().map((node) => node.label)).toEqual([
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
        expect(node.parent.id).toEqual('root');
      });
    });
  });

  describe('2、Calculate overlapped data cell info', () => {
    const { getCellMeta } = s2.facet.layoutResult;
    test('should get correct data value', () => {
      // 第一行
      expect(getCellMeta(0, 0).data).toEqual({ province: '浙江省' });
      expect(getCellMeta(0, 1).data).toEqual({ city: '杭州市' });
      expect(getCellMeta(0, 2).data).toEqual({ type: '家具' });
      expect(getCellMeta(0, 3).data).toEqual({ sub_type: '桌子' });
      expect(getCellMeta(0, 4).data).toEqual({ number: 7789 });
      // 第三行
      expect(getCellMeta(2, 0).data).toEqual({ province: '浙江省' });
      expect(getCellMeta(2, 1).data).toEqual({ city: '宁波市' });
      expect(getCellMeta(2, 2).data).toEqual({ type: '家具' });
      expect(getCellMeta(2, 3).data).toEqual({ sub_type: '桌子' });
      expect(getCellMeta(2, 4).data).toEqual({ number: 3877 });
    });
  });
});
