import { sortData } from 'tests/data/sort-advanced';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet } from '@/sheet-type';
import { EXTRA_FIELD } from '@/common';
import type { S2DataConfig, S2Options } from '@/common';

const s2Options: S2Options = {
  width: 400,
  height: 400,
  hierarchyType: 'tree',
  // 测试总计行节点分支
  totals: {
    row: {
      showGrandTotals: true,
    },
  },
};

describe('build row tree hierarchy', () => {
  // https://stackblitz.com/edit/react-ts-aj2r8w?file=data.ts
  test('should get order hierarchy when order is group ascend', async () => {
    const s2DataConfig: S2DataConfig = {
      ...sortData,
      // 城市根据纸张价格进行组内升序
      sortParams: [
        {
          sortFieldId: 'city',
          sortByMeasure: 'price',
          sortMethod: 'asc',
          query: {
            type: '纸张',
            [EXTRA_FIELD]: 'price',
          },
        },
      ],
    };
    const s2 = new PivotSheet(getContainer(), s2DataConfig, s2Options);

    await s2.render();

    const rowLeafNodes = s2.facet.getRowLeafNodes();

    expect(rowLeafNodes.length).toBe(7);
    expect(rowLeafNodes[0].value).toEqual('浙江');
    expect(rowLeafNodes[1].value).toEqual('杭州');
    expect(rowLeafNodes[2].value).toEqual('舟山');
    expect(rowLeafNodes[3].value).toEqual('吉林');
    expect(rowLeafNodes[4].value).toEqual('长春');
    expect(rowLeafNodes[5].value).toEqual('白山');
    expect(rowLeafNodes[6].value).toEqual('总计');
  });
  test('should get order hierarchy when order is group desc', async () => {
    const s2DataConfig: S2DataConfig = {
      ...sortData,
      // 城市根据笔价格进行组内升序
      sortParams: [
        {
          sortFieldId: 'city',
          sortByMeasure: 'price',
          sortMethod: 'desc',
          query: {
            type: '笔',
            [EXTRA_FIELD]: 'price',
          },
        },
      ],
    };
    const s2 = new PivotSheet(getContainer(), s2DataConfig, s2Options);

    await s2.render();
    const rowLeafNodes = s2.facet.getRowLeafNodes();

    expect(rowLeafNodes.length).toBe(7);
    expect(rowLeafNodes[0].value).toEqual('浙江');
    expect(rowLeafNodes[1].value).toEqual('舟山');
    expect(rowLeafNodes[2].value).toEqual('杭州');
    expect(rowLeafNodes[3].value).toEqual('吉林');
    expect(rowLeafNodes[4].value).toEqual('长春');
    expect(rowLeafNodes[5].value).toEqual('白山');
    expect(rowLeafNodes[6].value).toEqual('总计');
  });
});
