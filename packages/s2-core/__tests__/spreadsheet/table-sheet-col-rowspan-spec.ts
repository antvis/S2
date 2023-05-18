/*
 * @description spec for issue #2199
 * https://github.com/antvis/S2/issues/2199
 * 明细表: 当有冻结列 + 列分组的情况下, 会出现列头文本不居中现象
 */
import { getContainer } from 'tests/util/helpers';
import dataCfg from 'tests/data/simple-table-data-rowspan.json';
import { TableSheet } from '@/sheet-type';
import type { S2Options } from '@/common';

const s2Options: S2Options = {
  width: 600,
  height: 480,
};

describe('TableSheet Sort Tests', () => {
  test('should be rendered based on the rowSpan', () => {
    const s2 = new TableSheet(getContainer(), dataCfg, s2Options);
    s2.render();
    const { height: cellHeightOfLevel0 } = s2.getColumnNodes(0).slice(-1)[0];
    const { height: cellHeightOfLevel1 } = s2.getColumnNodes(1).slice(-1)[0];
    expect(cellHeightOfLevel0 * 2).toBe(cellHeightOfLevel1);
  });
});
