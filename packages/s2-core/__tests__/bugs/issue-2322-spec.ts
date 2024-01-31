/**
 * @description spec for issue #2322
 * https://github.com/antvis/S2/issues/2322
 * 明细表: 多列筛选后清空其中一列筛选，导致其他筛选也清空
 */
import { getContainer, sleep } from 'tests/util/helpers';
import dataCfg from '../data/data-issue-2322.json';
import { S2Event } from '@/common';
import type { S2Options } from '@/common/interface';
import { TableSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 800,
  height: 480,
  seriesNumber: {
    enable: true,
  },
  frozen: {
    colCount: 1,
  },
};

describe('Table Sheet Filter Test', () => {
  test('should filter correctly when part of the filter is cleaned', async () => {
    const s2 = new TableSheet(getContainer(), dataCfg, s2Options);

    await s2.render();

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

    await sleep(200);

    // 应过滤掉 city = 杭州 的值，共4行
    expect(s2.dataSet.getDisplayDataSet()).toHaveLength(
      s2.dataSet.originData.length - 4,
    );
  });
});
