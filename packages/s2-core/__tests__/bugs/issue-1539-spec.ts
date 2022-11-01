/**
 * @description spec for issue #1539
 * https://github.com/antvis/S2/issues/1539
 * 明细表，开启序号时，左侧边框丢失
 *
 */
import { getContainer } from 'tests/util/helpers';
import dataCfg from '../data/simple-table-data.json';
import { TableSheet } from '@/sheet-type';
import type { S2Options } from '@/common/interface';

const s2Options: S2Options = {
  width: 600,
  height: 400,
};

describe('Table Left Border Tests', () => {
  test('should draw left border without series number', () => {
    const s2 = new TableSheet(getContainer(), dataCfg, s2Options);
    s2.render();

    // 左侧边框由 centerFrame进行绘制
    const leftBorderLine = s2.facet.centerFrame.getChildren()[1];

    expect(leftBorderLine.attr('x1')).toBeLessThanOrEqual(1);
    expect(leftBorderLine.attr('x2')).toBeLessThanOrEqual(1);
  });

  test('should draw left border with series number', () => {
    const s2 = new TableSheet(getContainer(), dataCfg, {
      ...s2Options,
      showSeriesNumber: true,
    });
    s2.render();

    const leftBorderLine = s2.facet.centerFrame.getChildren()[1];

    expect(leftBorderLine.attr('x1')).toBeLessThanOrEqual(1);
    expect(leftBorderLine.attr('x2')).toBeLessThanOrEqual(1);
  });
});
