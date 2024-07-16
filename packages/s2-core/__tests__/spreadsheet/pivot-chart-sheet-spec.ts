/* eslint-disable no-console */
import { getContainer } from 'tests/util/helpers';
import { Aggregation, type S2Options } from '../../src/common/interface';
import { PivotChartSheet } from '../../src/extends';
import { asyncGetAllPlainData } from '../../src/utils/export/utils';
import dataCfg from '../data/mock-dataset.json';

describe('Pivot Chart Tests', () => {
  let container: HTMLElement;

  const s2Options: S2Options = {
    width: 800,
    height: 700,
    seriesNumber: {
      enable: true,
    },
    interaction: {
      hoverFocus: true,
    },
  };

  beforeEach(() => {
    container = getContainer();
  });

  afterEach(() => {
    // s2.destroy();
  });

  describe('different row levels', () => {
    test('should render pivot chart with 1 level row', async () => {
      const s2 = new PivotChartSheet(
        container,
        {
          ...dataCfg,
          fields: {
            rows: ['province'],
            columns: ['type', 'sub_type'],
            values: ['number'],
            valueInCols: true,
          },
        },
        {
          ...s2Options,
          interaction: {
            selectedCellsSpotlight: true,
          },
        },
      );

      await s2.render();
      window.s2 = s2;
      asyncGetAllPlainData({
        sheetInstance: s2,
        split: '\t',
        formatOptions: true,
      }).catch(console.log);
      console.log('1 level', s2.facet.getLayoutResult());
    });

    test('should render pivot chart with 2 level rows', async () => {
      const s2 = new PivotChartSheet(
        container,
        {
          ...dataCfg,
          fields: {
            rows: ['province'],
            columns: ['city', 'type', 'sub_type'],
            values: ['number'],
            valueInCols: false,
          },
          meta: [
            {
              field: 'city',
              formatter: (v) => `${v}---`,
            },
            {
              field: 'sub_type',
              formatter: (v) => `${v}---`,
            },
            {
              field: 'number',
              name: '数量',
              formatter: (v) => `${v}---`,
            },
          ],
          data: dataCfg.data.map((item) => ({ ...item, number1: item.number })),
        },
        {
          ...s2Options,
          frozen: {
            rowHeader: false,
            // trailingColCount: 1,
            // trailingRowCount: 1,
            colCount: 1,
            // rowCount: 1,
          },
          totals: {
            col: {
              showGrandTotals: true,
              showSubTotals: true,
              reverseGrandTotalsLayout: true,
              reverseSubTotalsLayout: true,
              grandTotalsGroupDimensions: ['city', 'type'],

              subTotalsDimensions: ['type'],
              calcGrandTotals: {
                aggregation: Aggregation.SUM,
              },
              calcSubTotals: {
                aggregation: Aggregation.SUM,
              },
            },
          },
        },
      );

      await s2.render();
      console.log('2 level', s2.facet.getLayoutResult());
      window.s2 = s2;
    });

    test('should render pivot chart with 3 level rows', async () => {
      const s2 = new PivotChartSheet(
        container,
        {
          ...dataCfg,
          fields: {
            rows: ['province', 'city'],
            columns: ['type', 'sub_type'],
            values: ['number'],
            valueInCols: false,
          },
          meta: [{ field: 'city', formatter: (v) => `${v}//` }],
          data: dataCfg.data.map((item) => ({ ...item, number1: item.number })),
        },
        {
          ...s2Options,
          style: {
            // layoutWidthType: 'compact',
          },
          frozen: {
            rowHeader: true,

            // trailingRowCount: 1,
            // rowCount: 1,
          },
          totals: {
            row: {
              showGrandTotals: true,
              showSubTotals: true,
              reverseGrandTotalsLayout: true,
              reverseSubTotalsLayout: true,
              subTotalsDimensions: ['province'],
              calcGrandTotals: {
                aggregation: Aggregation.SUM,
              },
              calcSubTotals: {
                aggregation: Aggregation.SUM,
              },
              grandTotalsGroupDimensions: ['city'],
              subTotalsGroupDimensions: ['type'],
            },
          },
        },
      );

      await s2.render();
      console.log('3 level', s2.facet.getLayoutResult());
      window.s2 = s2;
    });
  });
  describe('different col levels', () => {
    test('should render pivot chart with 1 level col', async () => {
      const s2 = new PivotChartSheet(
        container,
        {
          ...dataCfg,
          fields: {
            rows: ['province', 'city'],
            columns: [],
            values: ['number'],
            valueInCols: true,
          },
        },
        s2Options,
      );

      await s2.render();
      console.log(s2);
    });

    test('should render pivot chart with 2 level cols', async () => {
      const s2 = new PivotChartSheet(
        container,
        {
          ...dataCfg,
          fields: {
            rows: ['province', 'city'],
            columns: ['type'],
            values: ['number'],
            valueInCols: true,
          },
        },
        {
          ...s2Options,
          totals: {
            col: {
              showGrandTotals: true,
              showSubTotals: true,
              reverseGrandTotalsLayout: true,
              reverseSubTotalsLayout: true,
              subTotalsDimensions: ['type'],
              calcGrandTotals: {
                aggregation: Aggregation.SUM,
              },
              calcSubTotals: {
                aggregation: Aggregation.SUM,
              },
            },
          },
        },
      );

      await s2.render();
    });

    test('should render pivot chart with 3 level cols', async () => {
      const s2 = new PivotChartSheet(
        container,
        {
          ...dataCfg,
          fields: {
            rows: ['province', 'city'],
            columns: ['type', 'sub_type'],
            values: ['number'],
            valueInCols: true,
          },
        },
        {
          ...s2Options,
          totals: {
            col: {
              showGrandTotals: true,
              showSubTotals: true,
              reverseGrandTotalsLayout: true,
              reverseSubTotalsLayout: true,
              subTotalsDimensions: ['province'],
              calcGrandTotals: {
                aggregation: Aggregation.SUM,
              },
              calcSubTotals: {
                aggregation: Aggregation.SUM,
              },
              grandTotalsGroupDimensions: ['sub_type'],
              subTotalsGroupDimensions: ['type'],
            },
          },
        },
      );

      await s2.render();
    });
  });
});
