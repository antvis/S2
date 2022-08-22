import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet } from '@/sheet-type';

describe('SpreadSheet Collapse/Expand Tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = getContainer();
  });

  test('should init rows with expandToRowLevel config', () => {
    const s2 = new PivotSheet(
      container,
      {
        ...mockDataConfig,
        fields: {
          rows: ['province', 'city', 'type'],
          columns: [],
          values: ['price', 'cost'],
          valueInCols: true,
        },
      },
      {
        width: 600,
        height: 200,
        hierarchyType: 'tree',
        style: {
          expandToRowLevel: 0,
        },
      },
    );
    s2.render();

    const { rowLeafNodes } = s2.facet.layoutResult;

    expect(rowLeafNodes).toHaveLength(3);
    expect(rowLeafNodes[0].id).toEqual('root[&]浙江');
    expect(rowLeafNodes[1].id).toEqual('root[&]浙江[&]义乌');
    expect(rowLeafNodes[2].id).toEqual('root[&]浙江[&]杭州');
  });
});
