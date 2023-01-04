import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet, SpreadSheet } from '@/sheet-type';

describe('SpreadSheet Collapse/Expand Tests', () => {
  let container: HTMLElement;
  let s2: SpreadSheet;

  const mapNodes = (spreadsheet: SpreadSheet) =>
    spreadsheet.getRowLeafNodes().map((node) => node.id);

  beforeEach(() => {
    container = getContainer();
    s2 = new PivotSheet(
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
            expandDepth: undefined,
          },
        },
      },
    );
    s2.render();
  });

  afterEach(() => {
    // s2.destroy();
  });

  describe('Tree Mode', () => {
    test('should init rows with expandDepth config', () => {
      s2.setOptions({
        style: {
          rowCell: {
            expandDepth: 0,
          },
        },
      });
      s2.render();

      const rowLeafNodes = s2.getRowLeafNodes();

      expect(rowLeafNodes).toHaveLength(3);
      expect(mapNodes(s2)).toMatchInlineSnapshot(`
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

      expect(mapNodes(s2)).toMatchInlineSnapshot(`
              Array [
                "root[&]浙江",
                "root[&]浙江[&]义乌",
                "root[&]浙江[&]义乌[&]笔",
                "root[&]浙江[&]杭州",
                "root[&]浙江[&]杭州[&]笔",
              ]
          `);
    });

    test('should collapse all row nodes', () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseAll: true,
          },
        },
      });

      s2.render(false);

      expect(mapNodes(s2)).toMatchInlineSnapshot(`
              Array [
                "root[&]浙江",
              ]
          `);
    });

    test('should collapse by field', () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapsedFields: ['province'],
          },
        },
      });

      s2.render(false);

      expect(mapNodes(s2)).toMatchInlineSnapshot(`
              Array [
                "root[&]浙江",
              ]
          `);
    });

    test('should collapse by field id', () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapsedFields: ['root[&]浙江[&]义务'],
          },
        },
      });

      s2.render(false);

      expect(mapNodes(s2)).toMatchInlineSnapshot(`
              Array [
                "root[&]浙江",
                "root[&]浙江[&]义乌",
                "root[&]浙江[&]杭州",
                "root[&]浙江[&]杭州[&]笔",
              ]
          `);
    });

    test('should collapse use collapsedFields first', () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseAll: true,
            collapsedFields: ['city'],
          },
        },
      });

      s2.render(false);

      expect(mapNodes(s2)).toMatchInlineSnapshot(`
              Array [
                "root[&]浙江",
                "root[&]浙江[&]义乌",
                "root[&]浙江[&]杭州",
              ]
          `);
    });

    test('should collapse use expandDepth first', () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseAll: true,
            expandDepth: 1,
          },
        },
      });
      s2.render(false);

      expect(mapNodes(s2)).toMatchInlineSnapshot(`
              Array [
                "root[&]浙江",
                "root[&]浙江[&]义乌",
                "root[&]浙江[&]义乌[&]笔",
                "root[&]浙江[&]杭州",
                "root[&]浙江[&]杭州[&]笔",
              ]
          `);
    });

    test('should collapse use collapsedFields first when contain collapseAll and expandDepth config', () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseAll: true,
            collapsedFields: ['root[&]浙江[&]杭州'],
            expandDepth: -1,
          },
        },
      });
      s2.render(false);

      expect(mapNodes(s2)).toMatchInlineSnapshot(`
              Array [
                "root[&]浙江",
                "root[&]浙江[&]义乌",
                "root[&]浙江[&]义乌[&]笔",
                "root[&]浙江[&]杭州",
              ]
          `);
    });

    test('should not collapse all nodes if collapseAll is true and collapsedFields is empty', () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseAll: true,
            collapsedFields: [],
          },
        },
      });
      s2.render(false);

      expect(mapNodes(s2)).toMatchInlineSnapshot(`
        Array [
          "root[&]浙江",
          "root[&]浙江[&]义乌",
          "root[&]浙江[&]义乌[&]笔",
          "root[&]浙江[&]杭州",
          "root[&]浙江[&]杭州[&]笔",
        ]
      `);
    });

    test('should collapse all nodes if collapseAll is true and collapsedFields is undefined', () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseAll: true,
            collapsedFields: undefined,
          },
        },
      });
      s2.render(false);

      expect(mapNodes(s2)).toMatchInlineSnapshot(`
        Array [
          "root[&]浙江",
        ]
      `);
    });
  });
});
