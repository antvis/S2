import { getContainer } from 'tests/util/helpers';
import { Aggregation, type S2Options } from '../../src/common/interface';
import { PivotChart } from '../../src/extends';
import dataCfg from '../data/mock-dataset.json';

describe('Pivot Chart Tests', () => {
  let container: HTMLElement;

  const s2Options: S2Options = {
    width: 800,
    height: 600,
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
    });

    test('should render pivot chart with 2 level rows', async () => {
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
            valueInCols: true,
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
        },
      );

      await s2.render();
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
      window.s2 = s2;
    });
  });
});
