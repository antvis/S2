import { pick } from 'lodash';
import type { Node, S2CellType, SpreadSheet, ViewMeta } from '../../src';
import { createPivotSheet, createTableSheet } from '../util/helpers';

describe('Facet Layout API Tests', () => {
  let s2: SpreadSheet;

  const mapNode = (node: Node | ViewMeta) =>
    pick(node, ['field', 'id', 'value']);
  const mapNodes = (nodes: Node[]) => nodes.map(mapNode);
  const mapCells = (cells: S2CellType<ViewMeta>[]) =>
    cells.map((cell) => {
      const node = cell?.getMeta();

      return mapNode(node);
    });

  describe('PivotSheet', () => {
    beforeEach(async () => {
      s2 = createPivotSheet({
        width: 300,
        height: 300,
        seriesNumber: {
          enable: false,
        },
      });
      await s2.render();
    });

    afterEach(() => {
      s2.destroy();
    });

    describe('Cell', () => {
      test('#getHeaderNodes()', () => {
        expect(mapNodes(s2.facet.getHeaderNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "province",
              "id": "province",
              "value": "province",
            },
            Object {
              "field": "city",
              "id": "city",
              "value": "city",
            },
            Object {
              "field": "type",
              "id": "type",
              "value": "type",
            },
            Object {
              "field": "province",
              "id": "root[&]浙江",
              "value": "浙江",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
              "value": "义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
              "value": "杭州",
            },
            Object {
              "field": "type",
              "id": "root[&]笔",
              "value": "笔",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]price",
              "value": "price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
              "value": "cost",
            },
          ]
        `);
        expect(mapNodes(s2.facet.getHeaderNodes(['root[&]浙江[&]义乌'])))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
              "value": "义乌",
            },
          ]
        `);
      });

      test('#getHeaderNodes() for seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapNodes(s2.facet.getHeaderNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "",
              "id": "",
              "value": "序号",
            },
            Object {
              "field": "province",
              "id": "province",
              "value": "province",
            },
            Object {
              "field": "city",
              "id": "city",
              "value": "city",
            },
            Object {
              "field": "type",
              "id": "type",
              "value": "type",
            },
            Object {
              "field": "",
              "id": "",
              "value": "1",
            },
            Object {
              "field": "province",
              "id": "root[&]浙江",
              "value": "浙江",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
              "value": "义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
              "value": "杭州",
            },
            Object {
              "field": "type",
              "id": "root[&]笔",
              "value": "笔",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]price",
              "value": "price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
              "value": "cost",
            },
          ]
        `);
      });

      test('#getHeaderCells()', () => {
        expect(mapCells(s2.facet.getHeaderCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "province",
              "id": "province",
              "value": "province",
            },
            Object {
              "field": "city",
              "id": "city",
              "value": "city",
            },
            Object {
              "field": "type",
              "id": "type",
              "value": "type",
            },
            Object {
              "field": "province",
              "id": "root[&]浙江",
              "value": "浙江",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
              "value": "义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
              "value": "杭州",
            },
            Object {
              "field": "type",
              "id": "root[&]笔",
              "value": "笔",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]price",
              "value": "price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
              "value": "cost",
            },
          ]
        `);
        expect(mapCells(s2.facet.getHeaderCells(['root[&]浙江[&]义乌'])))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
              "value": "义乌",
            },
          ]
        `);
      });

      test('#getCells()', () => {
        expect(mapCells(s2.facet.getCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "province",
              "id": "province",
              "value": "province",
            },
            Object {
              "field": "city",
              "id": "city",
              "value": "city",
            },
            Object {
              "field": "type",
              "id": "type",
              "value": "type",
            },
            Object {
              "field": "province",
              "id": "root[&]浙江",
              "value": "浙江",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
              "value": "义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
              "value": "杭州",
            },
            Object {
              "field": "type",
              "id": "root[&]笔",
              "value": "笔",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]price",
              "value": "price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
              "value": "cost",
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
              "value": "义乌",
            },
          ]
        `);
      });

      test('#getCellById()', () => {
        expect(mapCells([s2.facet.getCellById('root[&]浙江[&]义乌')!]))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
              "value": "义乌",
            },
          ]
        `);
      });

      test('#getCellsByField()', () => {
        expect(mapCells(s2.facet.getCellsByField('type')))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "type",
              "value": "type",
            },
            Object {
              "field": "type",
              "id": "root[&]笔",
              "value": "笔",
            },
          ]
        `);
      });

      test('#getCellChildrenNodes()', () => {
        const rowCell = s2.facet.getRowCells()[0];

        expect(mapNodes(s2.facet.getCellChildrenNodes(rowCell)))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
              "value": "义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
              "value": "杭州",
            },
          ]
        `);
      });
    });

    describe('CornerCell', () => {
      test('#getCornerNodes()', () => {
        expect(mapNodes(s2.facet.getCornerNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "province",
              "id": "province",
              "value": "province",
            },
            Object {
              "field": "city",
              "id": "city",
              "value": "city",
            },
            Object {
              "field": "type",
              "id": "type",
              "value": "type",
            },
          ]
        `);
      });

      test('#getCornerNodes() for seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapNodes(s2.facet.getCornerNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "",
              "id": "",
              "value": "序号",
            },
            Object {
              "field": "province",
              "id": "province",
              "value": "province",
            },
            Object {
              "field": "city",
              "id": "city",
              "value": "city",
            },
            Object {
              "field": "type",
              "id": "type",
              "value": "type",
            },
          ]
        `);
      });

      test('#getCornerCell()s', () => {
        expect(mapCells(s2.facet.getCornerCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "province",
              "id": "province",
              "value": "province",
            },
            Object {
              "field": "city",
              "id": "city",
              "value": "city",
            },
            Object {
              "field": "type",
              "id": "type",
              "value": "type",
            },
          ]
        `);
      });

      test('#getCornerCells() for seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapCells(s2.facet.getCornerCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "",
              "id": "",
              "value": "序号",
            },
            Object {
              "field": "province",
              "id": "province",
              "value": "province",
            },
            Object {
              "field": "city",
              "id": "city",
              "value": "city",
            },
            Object {
              "field": "type",
              "id": "type",
              "value": "type",
            },
          ]
        `);
      });
    });

    describe('SeriesNumberCell', () => {
      test('#getSeriesNumberNodes()', () => {
        expect(mapNodes(s2.facet.getSeriesNumberNodes())).toMatchInlineSnapshot(
          `Array []`,
        );
      });

      test('#getSeriesNumberNodes() for seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapNodes(s2.facet.getSeriesNumberNodes()))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "",
              "id": "",
              "value": "1",
            },
          ]
        `);
      });

      test('#getSeriesNumberCells()', () => {
        expect(mapCells(s2.facet.getSeriesNumberCells())).toMatchInlineSnapshot(
          `Array []`,
        );
      });

      test('#getSeriesNumberCells() for seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapCells(s2.facet.getSeriesNumberCells()))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "",
              "id": "",
              "value": "1",
            },
          ]
        `);
      });
    });

    describe('MergedCell', () => {
      test('#getMergedCells()', async () => {
        s2.setOptions({
          mergedCellsInfo: [
            [
              { colIndex: 0, rowIndex: 0, showText: true },
              { colIndex: 1, rowIndex: 1 },
            ],
          ],
        });
        await s2.render(false);

        expect(mapCells(s2.facet.getMergedCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "id": "root[&]浙江[&]义乌-root[&]笔[&]price",
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
              "value": "浙江",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
              "value": "义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
              "value": "杭州",
            },
          ]
        `);

        expect(mapNodes(s2.facet.getRowNodes(1))).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
              "value": "义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
              "value": "杭州",
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
              "value": "义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
              "value": "杭州",
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
              "value": "义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
              "value": "杭州",
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
            "value": "杭州",
          }
        `);
      });

      test('#getRowCells()', () => {
        expect(mapCells(s2.facet.getRowCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "province",
              "id": "root[&]浙江",
              "value": "浙江",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
              "value": "义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
              "value": "杭州",
            },
          ]
        `);
      });

      test('#getRowLeafCells()', () => {
        expect(mapCells(s2.facet.getRowLeafCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "city",
              "id": "root[&]浙江[&]义乌",
              "value": "义乌",
            },
            Object {
              "field": "city",
              "id": "root[&]浙江[&]杭州",
              "value": "杭州",
            },
          ]
        `);
      });

      describe('Row Total Cell', () => {
        beforeEach(async () => {
          s2 = createPivotSheet(
            {
              width: 300,
              height: 300,
              seriesNumber: {
                enable: false,
              },
              totals: {
                row: {
                  showGrandTotals: true,
                  showSubTotals: true,
                  reverseGrandTotalsLayout: true,
                  reverseSubTotalsLayout: true,
                },
              },
            },
            { useSimpleData: false, useTotalData: true },
          );
          await s2.render();
        });

        test('#getRowTotalsNodes()', () => {
          expect(mapNodes(s2.facet.getRowTotalsNodes())).toMatchInlineSnapshot(`
            Array [
              Object {
                "field": "province",
                "id": "root[&]总计",
                "value": "总计",
              },
            ]
          `);
        });

        test('#getRowGrandTotalsNodes()', () => {
          expect(mapNodes(s2.facet.getRowGrandTotalsNodes()))
            .toMatchInlineSnapshot(`
            Array [
              Object {
                "field": "province",
                "id": "root[&]总计",
                "value": "总计",
              },
            ]
          `);
        });

        test('#getRowSubTotalsNodes()', () => {
          expect(
            mapNodes(s2.facet.getRowSubTotalsNodes()),
          ).toMatchInlineSnapshot(`Array []`);
        });
      });
    });

    describe('ColCell', () => {
      test('#getColNodes()', () => {
        expect(mapNodes(s2.facet.getColNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]笔",
              "value": "笔",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]price",
              "value": "price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
              "value": "cost",
            },
          ]
        `);
        expect(mapNodes(s2.facet.getColNodes(1))).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]price",
              "value": "price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
              "value": "cost",
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
              "value": "price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
              "value": "cost",
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
            "value": "cost",
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
              "value": "笔",
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
              "value": "price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
              "value": "cost",
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
              "value": "笔",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]price",
              "value": "price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
              "value": "cost",
            },
          ]
        `);
      });

      test('#getColLeafCells()', () => {
        expect(mapCells(s2.facet.getColLeafCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]price",
              "value": "price",
            },
            Object {
              "field": "$$extra$$",
              "id": "root[&]笔[&]cost",
              "value": "cost",
            },
          ]
        `);
      });

      describe('Col Total Cell', () => {
        beforeEach(async () => {
          s2 = createPivotSheet(
            {
              width: 300,
              height: 300,
              seriesNumber: {
                enable: false,
              },
              totals: {
                col: {
                  showGrandTotals: true,
                  showSubTotals: true,
                  reverseGrandTotalsLayout: true,
                  reverseSubTotalsLayout: true,
                },
              },
            },
            { useSimpleData: false, useTotalData: true },
          );
          await s2.render();
        });

        test('#getColTotalsNodes()', () => {
          expect(mapNodes(s2.facet.getColTotalsNodes())).toMatchInlineSnapshot(`
            Array [
              Object {
                "field": "type",
                "id": "root[&]总计",
                "value": "总计",
              },
            ]
          `);
        });

        test('#getColGrandTotalsNodes()', () => {
          expect(mapNodes(s2.facet.getColGrandTotalsNodes()))
            .toMatchInlineSnapshot(`
            Array [
              Object {
                "field": "type",
                "id": "root[&]总计",
                "value": "总计",
              },
            ]
          `);
        });

        test('#getColSubTotalsNodes()', () => {
          expect(
            mapNodes(s2.facet.getColSubTotalsNodes()),
          ).toMatchInlineSnapshot(`Array []`);
        });
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

      test('#getDataCells() for show seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

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
    beforeEach(async () => {
      s2 = createTableSheet({
        width: 300,
        height: 300,
        seriesNumber: {
          enable: false,
        },
      });
      await s2.render();
    });

    afterEach(() => {
      s2.destroy();
    });

    describe('Cell', () => {
      test('#getHeaderNodes()', () => {
        expect(mapNodes(s2.facet.getHeaderNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]type",
              "value": "type",
            },
          ]
        `);
        expect(
          mapNodes(s2.facet.getHeaderNodes(['root[&]浙江[&]义乌'])),
        ).toMatchInlineSnapshot(`Array []`);
      });

      test('#getHeaderNodes() for show seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapNodes(s2.facet.getHeaderNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "",
              "id": "",
              "value": "序号",
            },
            Object {
              "field": "$$series_number$$",
              "id": "root[&]序号",
              "value": "序号",
            },
            Object {
              "field": "type",
              "id": "root[&]type",
              "value": "type",
            },
          ]
        `);
      });

      test('#getHeaderCells()', () => {
        expect(mapCells(s2.facet.getHeaderCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]type",
              "value": "type",
            },
          ]
        `);
        expect(
          mapCells(s2.facet.getHeaderCells(['root[&]浙江[&]义乌'])),
        ).toMatchInlineSnapshot(`Array []`);
      });

      test('#getHeaderCells() for show seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapCells(s2.facet.getHeaderCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "",
              "id": "",
              "value": "序号",
            },
            Object {
              "id": "0-root[&]序号",
            },
            Object {
              "id": "1-root[&]序号",
            },
            Object {
              "id": "2-root[&]序号",
            },
            Object {
              "field": "$$series_number$$",
              "id": "root[&]序号",
              "value": "序号",
            },
            Object {
              "field": "type",
              "id": "root[&]type",
              "value": "type",
            },
          ]
        `);
      });

      test('#getCells()', () => {
        expect(mapCells(s2.facet.getCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]type",
              "value": "type",
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

      test('#getCells() for show seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapCells(s2.facet.getCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "",
              "id": "",
              "value": "序号",
            },
            Object {
              "id": "0-root[&]序号",
            },
            Object {
              "id": "1-root[&]序号",
            },
            Object {
              "id": "2-root[&]序号",
            },
            Object {
              "field": "$$series_number$$",
              "id": "root[&]序号",
              "value": "序号",
            },
            Object {
              "field": "type",
              "id": "root[&]type",
              "value": "type",
            },
            Object {
              "id": "0-root[&]序号",
            },
            Object {
              "id": "1-root[&]序号",
            },
            Object {
              "id": "2-root[&]序号",
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
      });

      test('#getCellById()', () => {
        expect(mapCells([s2.facet.getCellById('root[&]浙江[&]义乌')!]))
          .toMatchInlineSnapshot(`
          Array [
            Object {},
          ]
        `);
      });

      test('#getCellsByField()', () => {
        expect(mapCells(s2.facet.getCellsByField('type')))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]type",
              "value": "type",
            },
          ]
        `);
      });
    });

    describe('SeriesNumberCell', () => {
      beforeEach(async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);
      });

      test('#getSeriesNumberNodes()', () => {
        expect(mapNodes(s2.facet.getSeriesNumberNodes())).toMatchInlineSnapshot(
          `Array []`,
        );
      });

      test('#getSeriesNumberCells()', () => {
        expect(mapCells(s2.facet.getSeriesNumberCells()))
          .toMatchInlineSnapshot(`
          Array [
            Object {
              "id": "0-root[&]序号",
            },
            Object {
              "id": "1-root[&]序号",
            },
            Object {
              "id": "2-root[&]序号",
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
              "value": "type",
            },
          ]
        `);
        expect(mapNodes(s2.facet.getColNodes(1))).toMatchInlineSnapshot(
          `Array []`,
        );
      });

      test('#getColNodes() for show seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapNodes(s2.facet.getColNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "$$series_number$$",
              "id": "root[&]序号",
              "value": "序号",
            },
            Object {
              "field": "type",
              "id": "root[&]type",
              "value": "type",
            },
          ]
        `);
      });

      test('#getColLeafNodes()', () => {
        expect(mapNodes(s2.facet.getColLeafNodes())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]type",
              "value": "type",
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
              "value": "type",
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
              "value": "type",
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
              "value": "type",
            },
          ]
        `);
      });

      test('#getColLeafCells()', () => {
        expect(mapCells(s2.facet.getColLeafCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "field": "type",
              "id": "root[&]type",
              "value": "type",
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

      test('#getDataCells() for show seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapCells(s2.facet.getDataCells())).toMatchInlineSnapshot(`
          Array [
            Object {
              "id": "0-root[&]序号",
            },
            Object {
              "id": "1-root[&]序号",
            },
            Object {
              "id": "2-root[&]序号",
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
      });
    });
  });
});
