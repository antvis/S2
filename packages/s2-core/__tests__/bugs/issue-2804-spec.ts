/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * 透视表树状模式当某一组数据只有一条数据时, 叶子节点判断错误, 也渲染了展开/收起图标.
 * @description spec for issue #2804
 * https://github.com/antvis/S2/issues/2804
 */
import { S2Options } from '../../src';
import * as mockDataConfig from '../data/data-issue-2804.json';
import { getContainer } from '../util/helpers';
import { PivotSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 800,
  height: 600,
  hierarchyType: 'tree',
};

describe('Tree Leaf Node Status Tests', () => {
  test('should get correctly tree icon and leaf node status', () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

    s2.render();

    const [a1, a2] = s2.getRowNodes();

    expect(a1.isLeaf).toBeTruthy();
    expect(a1.isTotals).toBeFalsy();
    expect(a2.isLeaf).toBeFalsy();
    expect(a2.isTotals).toBeTruthy();
    expect(a1.belongsCell.treeIcon).not.toBeDefined();
    expect(a2.belongsCell.treeIcon).toBeDefined();
  });
});
