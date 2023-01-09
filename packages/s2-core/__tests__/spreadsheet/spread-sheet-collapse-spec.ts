import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';
import type { RowCellCollapsedParams } from '../../src/common/interface';
import { S2Event } from './../../src/common/constant/events/basic';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import type { Node } from '@/facet/layout/node';

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
    s2.destroy();
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
            collapseFields: {
              province: true,
            },
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
            collapseFields: {
              'root[&]浙江[&]义乌': true,
            },
          },
        },
      });

      s2.render();

      expect(mapNodes(s2)).toMatchInlineSnapshot(`
              Array [
                "root[&]浙江",
                "root[&]浙江[&]义乌",
                "root[&]浙江[&]杭州",
                "root[&]浙江[&]杭州[&]笔",
              ]
          `);
    });

    test('should collapse use collapseFields first', () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseAll: false,
            collapseFields: {
              city: true,
            },
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

    test('should collapse use collapseFields first when contain collapseAll and expandDepth config', () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseAll: false,
            collapseFields: {
              'root[&]浙江[&]杭州': true,
            },
            expandDepth: null,
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

    test('should collapse use collapseFields by node id first', () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseFields: {
              province: false,
              'root[&]浙江': true,
            },
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

    test('should collapse all nodes if collapseAll is true and collapseFields is undefined', () => {
      s2.setOptions({
        style: {
          rowCell: {
            collapseAll: true,
            collapseFields: undefined,
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

    test('should emit collapse event', () => {
      const onCollapsed = jest.fn();

      s2.on(S2Event.ROW_CELL_COLLAPSED, onCollapsed);

      const node = { id: 'testId' } as unknown as Node;
      const treeRowType: RowCellCollapsedParams = {
        isCollapsed: false,
        node,
      };

      const params: RowCellCollapsedParams = {
        isCollapsed: false,
        collapseFields: {
          [node.id]: false,
        },
        node,
      };

      s2.emit(S2Event.ROW_CELL_COLLAPSED__PRIVATE, treeRowType);

      expect(onCollapsed).toHaveBeenCalledWith(params);
    });

    test('should emit collapse all event', () => {
      const onCollapsed = jest.fn();

      s2.on(S2Event.ROW_CELL_ALL_COLLAPSED, onCollapsed);

      s2.emit(S2Event.ROW_CELL_ALL_COLLAPSED__PRIVATE, false);

      expect(onCollapsed).toHaveBeenCalledWith(true);
    });
  });
});
