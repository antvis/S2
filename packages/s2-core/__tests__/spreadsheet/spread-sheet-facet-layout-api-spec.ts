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
        expect(mapNodes(s2.facet.getHeaderNodes())).toMatchSnapshot();
        expect(
          mapNodes(s2.facet.getHeaderNodes(['root[&]浙江[&]义乌'])),
        ).toMatchSnapshot();
      });

      test('#getHeaderNodes() for seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapNodes(s2.facet.getHeaderNodes())).toMatchSnapshot();
      });

      test('#getHeaderCells()', () => {
        expect(mapCells(s2.facet.getHeaderCells())).toMatchSnapshot();
        expect(
          mapCells(s2.facet.getHeaderCells(['root[&]浙江[&]义乌'])),
        ).toMatchSnapshot();
      });

      test('#getCells()', () => {
        expect(mapCells(s2.facet.getCells())).toMatchSnapshot();
        expect(
          mapCells(s2.facet.getCells(['root[&]浙江[&]义乌'])),
        ).toMatchSnapshot();
      });

      test('#getCellById()', () => {
        expect(
          mapCells([s2.facet.getCellById('root[&]浙江[&]义乌')!]),
        ).toMatchSnapshot();
      });

      test('#getCellsByField()', () => {
        expect(mapCells(s2.facet.getCellsByField('type'))).toMatchSnapshot();
      });

      test('#getCellChildrenNodes()', () => {
        const rowCell = s2.facet.getRowCells()[0];

        expect(
          mapNodes(s2.facet.getCellChildrenNodes(rowCell)),
        ).toMatchSnapshot();
      });
    });

    describe('CornerCell', () => {
      test('#getCornerNodes()', () => {
        expect(mapNodes(s2.facet.getCornerNodes())).toMatchSnapshot();
      });

      test('#getCornerNodes() for seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapNodes(s2.facet.getCornerNodes())).toMatchSnapshot();
      });

      test('#getCornerCells()', () => {
        expect(mapCells(s2.facet.getCornerCells())).toMatchSnapshot();
      });

      test('#getCornerCells() for seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapCells(s2.facet.getCornerCells())).toMatchSnapshot();
      });
    });

    describe('SeriesNumberCell', () => {
      test('#getSeriesNumberNodes()', () => {
        expect(mapNodes(s2.facet.getSeriesNumberNodes())).toMatchSnapshot(
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

        expect(mapNodes(s2.facet.getSeriesNumberNodes())).toMatchSnapshot();
      });

      test('#getSeriesNumberCells()', () => {
        expect(mapCells(s2.facet.getSeriesNumberCells())).toBeEmpty();
      });

      test('#getSeriesNumberCells() for seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapCells(s2.facet.getSeriesNumberCells())).toMatchSnapshot();
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

        expect(mapCells(s2.facet.getMergedCells())).toMatchSnapshot();
      });
    });

    describe('RowCell', () => {
      test('#getRowNodes()', () => {
        expect(mapNodes(s2.facet.getRowNodes())).toMatchSnapshot();
        expect(mapNodes(s2.facet.getRowNodes(1))).toMatchSnapshot();
      });

      test('#getRowLeafNodes()', () => {
        expect(mapNodes(s2.facet.getRowLeafNodes())).toMatchSnapshot();
      });

      test('#getRowNodesByField()', () => {
        expect(mapNodes(s2.facet.getRowNodesByField('city'))).toMatchSnapshot();
      });

      test('#getRowNodeById()', () => {
        expect(
          mapNode(s2.facet.getRowNodeById('root[&]浙江[&]杭州')!),
        ).toMatchSnapshot();
      });

      test('#getRowCells()', () => {
        expect(mapCells(s2.facet.getRowCells())).toMatchSnapshot();
      });

      test('#getRowLeafCells()', () => {
        expect(mapCells(s2.facet.getRowLeafCells())).toMatchSnapshot();
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
          expect(mapNodes(s2.facet.getRowTotalsNodes())).toMatchSnapshot();
        });

        test('#getRowGrandTotalsNodes()', () => {
          expect(mapNodes(s2.facet.getRowGrandTotalsNodes())).toMatchSnapshot();
        });

        test('#getRowSubTotalsNodes()', () => {
          expect(mapNodes(s2.facet.getRowSubTotalsNodes())).toBeEmpty();
        });
      });
    });

    describe('ColCell', () => {
      test('#getColNodes()', () => {
        expect(mapNodes(s2.facet.getColNodes())).toMatchSnapshot();
        expect(mapNodes(s2.facet.getColNodes(1))).toMatchSnapshot();
      });

      test('#getColLeafNodes()', () => {
        expect(mapNodes(s2.facet.getColLeafNodes())).toMatchSnapshot();
      });

      test('#getColNodeById()', () => {
        expect(
          mapNode(s2.facet.getColNodeById('root[&]笔[&]cost')!),
        ).toMatchSnapshot();
      });

      test('#getColNodesByField()', () => {
        expect(mapNodes(s2.facet.getColNodesByField('type'))).toMatchSnapshot();
      });

      test('#getInitColLeafNodes()', () => {
        expect(mapNodes(s2.facet.getInitColLeafNodes())).toMatchSnapshot();
      });

      test('#getColCells()', () => {
        expect(mapCells(s2.facet.getColCells())).toMatchSnapshot();
      });

      test('#getColLeafCells()', () => {
        expect(mapCells(s2.facet.getColLeafCells())).toMatchSnapshot();
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
          expect(mapNodes(s2.facet.getColTotalsNodes())).toMatchSnapshot();
        });

        test('#getColGrandTotalsNodes()', () => {
          expect(mapNodes(s2.facet.getColGrandTotalsNodes())).toMatchSnapshot();
        });

        test('#getColSubTotalsNodes()', () => {
          expect(mapNodes(s2.facet.getColSubTotalsNodes())).toBeEmpty();
        });
      });
    });

    describe('DataCell', () => {
      test('#getDataCells()', () => {
        expect(mapCells(s2.facet.getDataCells())).toMatchSnapshot();
      });

      test('#getDataCells() for show seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapCells(s2.facet.getDataCells())).toMatchSnapshot();
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
        expect(mapNodes(s2.facet.getHeaderNodes())).toMatchSnapshot();
        expect(
          mapNodes(s2.facet.getHeaderNodes(['root[&]浙江[&]义乌'])),
        ).toBeEmpty();
      });

      test('#getHeaderNodes() for show seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapNodes(s2.facet.getHeaderNodes())).toMatchSnapshot();
      });

      test('#getHeaderCells()', () => {
        expect(mapCells(s2.facet.getHeaderCells())).toMatchSnapshot();
        expect(
          mapCells(s2.facet.getHeaderCells(['root[&]浙江[&]义乌'])),
        ).toBeEmpty();
      });

      test('#getHeaderCells() for show seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapCells(s2.facet.getHeaderCells())).toMatchSnapshot();
      });

      test('#getCells()', () => {
        expect(mapCells(s2.facet.getCells())).toMatchSnapshot();
        expect(mapCells(s2.facet.getCells(['root[&]浙江[&]义乌']))).toBeEmpty();
      });

      test('#getCells() for show seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapCells(s2.facet.getCells())).toMatchSnapshot();
      });

      test('#getCellById()', () => {
        expect(
          mapCells([s2.facet.getCellById('root[&]浙江[&]义乌')!]),
        ).toMatchSnapshot();
      });

      test('#getCellsByField()', () => {
        expect(mapCells(s2.facet.getCellsByField('type'))).toMatchSnapshot();
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
        expect(mapNodes(s2.facet.getSeriesNumberNodes())).toBeEmpty();
      });

      test('#getSeriesNumberCells()', () => {
        expect(mapCells(s2.facet.getSeriesNumberCells())).toMatchSnapshot();
      });
    });

    describe('ColCell', () => {
      test('#getColNodes()', () => {
        expect(mapNodes(s2.facet.getColNodes())).toMatchSnapshot();
        expect(mapNodes(s2.facet.getColNodes(1))).toBeEmpty();
      });

      test('#getColNodes() for show seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapNodes(s2.facet.getColNodes())).toMatchSnapshot();
      });

      test('#getColLeafNodes()', () => {
        expect(mapNodes(s2.facet.getColLeafNodes())).toMatchSnapshot();
      });

      test('#getColNodeById()', () => {
        expect(
          mapNode(s2.facet.getColNodeById('root[&]笔[&]cost')!),
        ).toBeEmpty();
      });

      test('#getColNodesByField()', () => {
        expect(mapNodes(s2.facet.getColNodesByField('type'))).toMatchSnapshot();
      });

      test('#getInitColLeafNodes()', () => {
        expect(mapNodes(s2.facet.getInitColLeafNodes())).toMatchSnapshot();
      });

      test('#getColCells()', () => {
        expect(mapCells(s2.facet.getColCells())).toMatchSnapshot();
      });

      test('#getColLeafCells()', () => {
        expect(mapCells(s2.facet.getColLeafCells())).toMatchSnapshot();
      });
    });

    describe('DataCell', () => {
      test('#getDataCells()', () => {
        expect(mapCells(s2.facet.getDataCells())).toMatchSnapshot();
      });

      test('#getDataCells() for show seriesNumber enable', async () => {
        s2.setOptions({
          seriesNumber: {
            enable: true,
          },
        });
        await s2.render(false);

        expect(mapCells(s2.facet.getDataCells())).toMatchSnapshot();
      });
    });
  });
});
