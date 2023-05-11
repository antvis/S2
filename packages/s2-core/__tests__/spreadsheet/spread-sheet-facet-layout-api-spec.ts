import { pick } from 'lodash';
import type { Node, S2CellType, SpreadSheet, ViewMeta } from '../../src';
import { createPivotSheet, createTableSheet } from '../util/helpers';

describe('Facet Layout API Tests', () => {
  let s2: SpreadSheet;

  const mapNode = (node: Node | ViewMeta) => pick(node, ['field', 'id']);
  const mapNodes = (nodes: Node[]) => nodes.map(mapNode);
  const mapCells = (cells: S2CellType<ViewMeta>[]) =>
    cells.map((cell) => {
      const node = cell?.getMeta();

      return mapNode(node);
    });

  describe('PivotSheet', () => {
    beforeEach(() => {
      s2 = createPivotSheet({
        width: 300,
        height: 300,
      });
      s2.render();
    });

    afterEach(() => {
      s2.destroy();
    });

    describe('Cell', () => {
      test('#getHeaderNodes', () => {
        expect(mapNodes(s2.facet.getHeaderNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "province",
              "id": "",
            },
            Object {
              "field": "city",
              "id": "",
            },
            Object {
              "field": "type",
              "id": "",
            },
            Object {
              "field": "province",
              "id": "root[&]浙江",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
            },
            Object {
              "field": "type",
              "id": "root[&]笔",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
            },
          ]
        `);
        expect(mapNodes(s2.facet.getHeaderNodes(['root[&]浙江[&]义乌'])))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
            },
          ]
        `);
      });

      test('#getHeaderCells', () => {
        expect(mapCells(s2.facet.getHeaderCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "province",
              "id": "",
            },
            Object {
              "field": "city",
              "id": "",
            },
            Object {
              "field": "type",
              "id": "",
            },
            Object {
              "field": "province",
              "id": "root[&]浙江",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
            },
            Object {
              "field": "type",
              "id": "root[&]笔",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
            },
          ]
        `);
        expect(mapCells(s2.facet.getHeaderCells(['root[&]浙江[&]义乌'])))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
            },
          ]
        `);
      });

      test('#getCells', () => {
        expect(mapCells(s2.facet.getCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "province",
              "id": "",
            },
            Object {
              "field": "city",
              "id": "",
            },
            Object {
              "field": "type",
              "id": "",
            },
            Object {
              "field": "province",
              "id": "root[&]浙江",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
            },
            Object {
              "field": "type",
              "id": "root[&]笔",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
            },
            Object {
              "id": "root[&]浙江[&]义乌-root[&]笔[&]price",
            },
            Object {
              "id": "root[&]浙江[&]杭州-root[&]笔[&]price",
            },
            Object {
              "id": "root[&]浙江[&]义乌-root[&]笔[&]cost",
            },
            Object {
              "id": "root[&]浙江[&]杭州-root[&]笔[&]cost",
            },
          ]
        `);
        expect(mapCells(s2.facet.getCells(['root[&]浙江[&]义乌'])))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
            },
          ]
        `);
      });

      test('#getCellById', () => {
        expect(mapCells([s2.facet.getCellById('root[&]浙江[&]义乌')!]))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
            },
          ]
        `);
      });

      test('#getCellsByField', () => {
        expect(mapCells(s2.facet.getCellsByField('type')))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "",
            },
            Object {
              "field": "type",
              "id": "root[&]笔",
            },
          ]
        `);
      });
    });

    describe('Corner', () => {
      test('#getCornerNodes', () => {
        expect(mapNodes(s2.facet.getCornerNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "province",
              "id": "",
            },
            Object {
              "field": "city",
              "id": "",
            },
            Object {
              "field": "type",
              "id": "",
            },
          ]
        `);
      });

      test('#getHeaderCells', () => {
        expect(mapCells(s2.facet.getCornerCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "province",
              "id": "",
            },
            Object {
              "field": "city",
              "id": "",
            },
            Object {
              "field": "type",
              "id": "",
            },
          ]
        `);
      });
    });

    describe('RowCell', () => {
      test('#getRowNodes()', () => {
        expect(mapNodes(s2.facet.getRowNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "province",
              "id": "root[&]浙江",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
            },
          ]
        `);

        expect(mapNodes(s2.facet.getRowNodes(1))).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
            },
          ]
        `);
      });

      test('#getRowLeafNodes()', () => {
        expect(mapNodes(s2.facet.getRowLeafNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
            },
          ]
        `);
      });

      test('#getRowNodesByField()', () => {
        expect(mapNodes(s2.facet.getRowNodesByField('city')))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
            },
          ]
        `);
      });

      test('#getRowNodeById()', () => {
        expect(mapNode(s2.facet.getRowNodeById('root[&]浙江[&]杭州')!))
          .toMatchInlineSnapshot(`
          Object {
            "field": "city",
            "id": "root[&]浙江[&]杭州",
          }
        `);
      });

      test('#getRowCells()', () => {
        expect(mapCells(s2.facet.getRowCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "province",
              "id": "root[&]浙江",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
            },
          ]
        `);
      });
    });

    describe('ColCell', () => {
      test('#getColNodes()', () => {
        expect(mapNodes(s2.facet.getColNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]笔",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
            },
          ]
        `);
        expect(mapNodes(s2.facet.getColNodes(1))).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
            },
          ]
        `);
      });

      test('#getColLeafNodes()', () => {
        expect(mapNodes(s2.facet.getColLeafNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
            },
          ]
        `);
      });

      test('#getColNodeById()', () => {
        expect(mapNode(s2.facet.getColNodeById('root[&]笔[&]cost')!))
          .toMatchInlineSnapshot(`
          Object {
            "field": "$$extra$$",
            "id": "root[&]笔[&]cost",
          }
        `);
      });

      test('#getColNodesByField()', () => {
        expect(mapNodes(s2.facet.getColNodesByField('type')))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]笔",
            },
          ]
        `);
      });

      test('#getInitColLeafNodes()', () => {
        expect(mapNodes(s2.facet.getInitColLeafNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
            },
          ]
        `);
      });

      test('#getColCells()', () => {
        expect(mapCells(s2.facet.getColCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]笔",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
            },
          ]
        `);
      });
    });

    describe('DataCell', () => {
      test('#getDataCells()', () => {
        expect(mapCells(s2.facet.getDataCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "id": "root[&]浙江[&]义乌-root[&]笔[&]price",
            },
            Object {
              "id": "root[&]浙江[&]杭州-root[&]笔[&]price",
            },
            Object {
              "id": "root[&]浙江[&]义乌-root[&]笔[&]cost",
            },
            Object {
              "id": "root[&]浙江[&]杭州-root[&]笔[&]cost",
            },
          ]
        `);
      });
    });
  });

  describe('TableSheet', () => {
    beforeEach(() => {
      s2 = createTableSheet({
        width: 300,
        height: 300,
      });
      s2.render();
    });

    afterEach(() => {
      s2.destroy();
    });

    describe('Cell', () => {
      test('#getHeaderNodes', () => {
        expect(mapNodes(s2.facet.getHeaderNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]type",
            },
          ]
        `);
        expect(
          mapNodes(s2.facet.getHeaderNodes(['root[&]浙江[&]义乌'])),
        ).toMatchInlineSnapshot(`Array []`);
      });

      test('#getHeaderCells', () => {
        expect(mapCells(s2.facet.getHeaderCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]type",
            },
          ]
        `);
        expect(
          mapCells(s2.facet.getHeaderCells(['root[&]浙江[&]义乌'])),
        ).toMatchInlineSnapshot(`Array []`);
      });

      test('#getCells', () => {
        expect(mapCells(s2.facet.getCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]type",
            },
            Object {
              "id": "0-root[&]type",
            },
            Object {
              "id": "1-root[&]type",
            },
            Object {
              "id": "2-root[&]type",
            },
          ]
        `);
        expect(
          mapCells(s2.facet.getCells(['root[&]浙江[&]义乌'])),
        ).toMatchInlineSnapshot(`Array []`);
      });

      test('#getCellById', () => {
        expect(mapCells([s2.facet.getCellById('root[&]浙江[&]义乌')!]))
          .toMatchInlineSnapshot(`
          Array [
            Object {},
          ]
        `);
      });

      test('#getCellsByField', () => {
        expect(mapCells(s2.facet.getCellsByField('type')))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]type",
            },
          ]
        `);
      });
    });

    describe('ColCell', () => {
      test('#getColNodes()', () => {
        expect(mapNodes(s2.facet.getColNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]type",
            },
          ]
        `);
        expect(mapNodes(s2.facet.getColNodes(1))).toMatchInlineSnapshot(
          `Array []`,
        );
      });

      test('#getColLeafNodes()', () => {
        expect(mapNodes(s2.facet.getColLeafNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]type",
            },
          ]
        `);
      });

      test('#getColNodeById()', () => {
        expect(
          mapNode(s2.facet.getColNodeById('root[&]笔[&]cost')!),
        ).toMatchInlineSnapshot(`Object {}`);
      });

      test('#getColNodesByField()', () => {
        expect(mapNodes(s2.facet.getColNodesByField('type')))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]type",
            },
          ]
        `);
      });

      test('#getInitColLeafNodes()', () => {
        expect(mapNodes(s2.facet.getInitColLeafNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]type",
            },
          ]
        `);
      });

      test('#getColCells()', () => {
        expect(mapCells(s2.facet.getColCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]type",
            },
          ]
        `);
      });
    });

    describe('DataCell', () => {
      test('#getDataCells()', () => {
        expect(mapCells(s2.facet.getDataCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "id": "0-root[&]type",
            },
            Object {
              "id": "1-root[&]type",
            },
            Object {
              "id": "2-root[&]type",
            },
          ]
        `);
      });
    });
  });
});
