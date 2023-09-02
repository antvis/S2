/**
 * @description spec for issue #2322
 * https://github.com/antvis/S2/issues/2322
 * 明细表: 多列筛选后清空其中一列筛选，导致其他筛选也清空
 */
import { getContainer } from 'tests/util/helpers';
import dataCfg from '../data/data-issue-2322.json';
import { TableSheet } from '@/sheet-type';
import type { S2Options } from '@/common/interface';
import { S2Event } from '@/common';

const s2Options: S2Options = {
  width: 300,
  height: 480,
  showSeriesNumber: true,
  frozenColCount: 1,
};

describe('Table Sheet Filter Test', () => {
  test('should filter correctly when part of the filter is cleaned', () => {
    const s2 = new TableSheet(getContainer(), dataCfg, s2Options);
    s2.render();

    // 为两个不同的列设定过滤
    s2.emit(S2Event.RANGE_FILTER, {
      filterKey: 'province',
      filteredValues: ['吉林'],
    });
    s2.emit(S2Event.RANGE_FILTER, {
      filterKey: 'city',
      filteredValues: ['杭州'],
    });

    // 删除一列过滤
    s2.emit(S2Event.RANGE_FILTER, {
      filterKey: 'province',
      filteredValues: [],
    });

    // 应过滤掉 city = 杭州 的值，共4行
    expect(s2.dataSet.getDisplayDataSet().length).toBe(
      s2.dataSet.originData.length - 4,
    );
  });
});
