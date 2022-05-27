import { sortData } from 'tests/data/sort-advanced';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet } from '@/sheet-type';
import { EXTRA_FIELD, S2DataConfig, S2Options } from '@/common';

const s2Options: S2Options = {
  width: 400,
  height: 400,
  hierarchyType: 'tree',
};
describe('build row tree hierarchy', () => {
  // https://stackblitz.com/edit/react-ts-aj2r8w?file=data.ts
  test('should get order hierarchy when order is group ascend', () => {
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
    s2.render();
    const rowLeafNodes = s2.facet.layoutResult.rowLeafNodes;
    expect(rowLeafNodes.length).toBe(6);
    expect(rowLeafNodes[0].label).toEqual('浙江');
    expect(rowLeafNodes[1].label).toEqual('杭州');
    expect(rowLeafNodes[2].label).toEqual('舟山');
    expect(rowLeafNodes[3].label).toEqual('吉林');
    expect(rowLeafNodes[4].label).toEqual('丹东');
    expect(rowLeafNodes[5].label).toEqual('白山');
  });
  test('should get order hierarchy when order is group desc', () => {
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
    s2.render();
    const rowLeafNodes = s2.facet.layoutResult.rowLeafNodes;
    expect(rowLeafNodes.length).toBe(6);
    expect(rowLeafNodes[0].label).toEqual('浙江');
    expect(rowLeafNodes[1].label).toEqual('舟山');
    expect(rowLeafNodes[2].label).toEqual('杭州');
    expect(rowLeafNodes[3].label).toEqual('吉林');
    expect(rowLeafNodes[4].label).toEqual('丹东');
    expect(rowLeafNodes[5].label).toEqual('白山');
  });
});
