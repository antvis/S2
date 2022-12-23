import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet } from '@/sheet-type';

describe('SpreadSheet Collapse/Expand Tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = getContainer();
  });

  test('should init rows with expandDepth config', () => {
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
          rowCell: {
            expandDepth: 0,
          },
        },
      },
    );
    s2.render();

    const { rowLeafNodes } = s2.facet.layoutResult;

    expect(rowLeafNodes).toHaveLength(3);
    expect(rowLeafNodes.map((node) => node.id)).toMatchInlineSnapshot(`
      Array [
        "root[&]浙江",
        "root[&]浙江[&]义乌",
        "root[&]浙江[&]杭州",
      ]
    `);

    s2.setOptions({
      style: {
        rowCell: {
          expandDepth: 1,
        },
      },
    });
    s2.render();

    expect(s2.facet.layoutResult.rowLeafNodes.map((node) => node.id))
      .toMatchInlineSnapshot(`
      Array [
        "root[&]浙江",
        "root[&]浙江[&]义乌",
        "root[&]浙江[&]义乌[&]笔",
        "root[&]浙江[&]杭州",
        "root[&]浙江[&]杭州[&]笔",
      ]
    `);
  });
});
