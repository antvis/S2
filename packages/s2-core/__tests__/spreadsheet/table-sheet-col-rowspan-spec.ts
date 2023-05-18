/*
 * @description spec for issue #2150
 * https://github.com/antvis/S2/issues/2150
 * 明细表-列分组增加 rowSpan 配置项, 用来支持自定义合并单元格
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
