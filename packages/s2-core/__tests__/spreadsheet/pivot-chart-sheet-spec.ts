/* eslint-disable no-console */
import { getContainer } from 'tests/util/helpers';
import { Aggregation, type S2Options } from '../../src/common/interface';
import { PivotChart } from '../../src/extends';
import dataCfg from '../data/mock-dataset.json';

describe('Pivot Chart Tests', () => {
  let container: HTMLElement;

  const s2Options: S2Options = {
    width: 800,
    height: 700,
  };

  beforeEach(() => {
    container = getContainer();
  });

  afterEach(() => {
    // s2.destroy();
  });

  describe('different row levels', () => {
    test('should render pivot chart with 1 level row', async () => {
      const s2 = new PivotChart(
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
        s2Options,
      );

      await s2.render();
      console.log('1 level', s2.facet.getLayoutResult());
    });

    test('should render pivot chart with 2 level rows', async () => {
      const s2 = new PivotChart(
        container,
        {
          ...dataCfg,
          fields: {
            rows: ['province', 'city'],
            columns: ['type', 'sub_type'],
            values: ['number', 'number1'],
            valueInCols: true,
          },
          data: dataCfg.data.map((item) => ({ ...item, number1: item.number })),
        },
        {
          ...s2Options,
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
            },
          },
        },
      );

      await s2.render();
      console.log('2 level', s2.facet.getLayoutResult());
    });

    test('should render pivot chart with 3 level rows', async () => {
      const s2 = new PivotChart(
        container,
        {
          ...dataCfg,
          fields: {
            rows: ['province', 'city', 'type'],
            columns: ['sub_type'],
            values: ['number'],
            valueInCols: false,
          },
        },
        {
          ...s2Options,
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
          chartSpec: {
            x: {},
          },
        },
      );

      await s2.render();
      console.log('3 level', s2.facet.getLayoutResult());
    });
  });
  describe('different col levels', () => {
    test('should render pivot chart with 1 level col', async () => {
      const s2 = new PivotChart(
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
      const s2 = new PivotChart(
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
      const s2 = new PivotChart(
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
