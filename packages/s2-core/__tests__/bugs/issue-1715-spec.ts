/**
 * @name Multi Values GrandTotal Height Test
 * @description spec for issues #1715,#2049
 * https://github.com/antvis/S2/issues/1715
 * https://github.com/antvis/S2/issues/2049
 */
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/mock-dataset.json';
import type { S2DataConfig, S2Options, SpreadSheet } from '../../src';
import { PivotSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 800,
  height: 600,
  style: {
    colCell: {
      hideValue: false,
    },
  },
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
    },
  },
};

const fields: S2DataConfig['fields'] = {
  rows: ['province'],
  columns: ['type', 'city'],
  values: ['number', 'sub_type'],
  valueInCols: false,
};

describe('Multi Values GrandTotal Height Test', () => {
  let s2: SpreadSheet;

  beforeEach(() => {
    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

    s2.setDataCfg({
      ...mockDataConfig,
      fields,
    });
    s2.render();
  });

  test('should get correctly grand total node height if value in rows', () => {
    const grandTotalsNode = s2
      .getColumnNodes()
      .find((node) => node.isGrandTotals)!;

    expect(s2.facet.layoutResult.colsHierarchy.height).toBe(60);
    expect(grandTotalsNode.height).toEqual(60);
  });

  test('should get correctly grand total node height if value in columns', () => {
    s2.setDataCfg({
      ...mockDataConfig,
      fields: {
        ...fields,
        valueInCols: true,
      },
    });
    s2.setOptions({
      style: {
        colCell: {
          hideValue: true,
        },
      },
    });
    s2.render(true);

    const grandTotalsNode = s2
      .getColumnNodes()
      .find((node) => node.isGrandTotals)!;

    expect(s2.facet.layoutResult.colsHierarchy.height).toBe(60);
    expect(grandTotalsNode.height).toEqual(30);
  });
});
