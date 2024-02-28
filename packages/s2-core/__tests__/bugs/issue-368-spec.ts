/**
 * @description spec for issue #368
 * https://github.com/antvis/S2/issues/368
 * Wrong style when show the totals in multi-value mode
 *
 */
import type { S2Options } from '../../src';
import * as mockDataConfig from '../data/data-issue-368.json';
import { getContainer } from '../util/helpers';
import { PivotSheet, SpreadSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 800,
  height: 600,
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      subTotalsDimensions: ['row0', 'row1'],
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseGrandTotalsLayout: true,
      reverseSubTotalsLayout: true,
      subTotalsDimensions: ['col0', 'col1'],
    },
  },
};

describe('Total Cells Rendering Test', () => {
  let s2: SpreadSheet;

  beforeEach(async () => {
    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

    await s2.render();
  });

  test('should get right SubTotals position', () => {
    const rowSubTotalNodes = s2.facet.getRowSubTotalsNodes();
    const colSubTotalNodes = s2.facet.getColSubTotalsNodes();

    expect(rowSubTotalNodes[0].width).toEqual(192);
    expect(rowSubTotalNodes[0].height).toEqual(30);
    expect(rowSubTotalNodes[0].x).toEqual(96);
    expect(rowSubTotalNodes[0].y).toEqual(30);

    expect(colSubTotalNodes[0].width).toEqual(192);
    expect(colSubTotalNodes[0].height).toEqual(60);
    expect(colSubTotalNodes[0].x).toEqual(192);
    expect(colSubTotalNodes[0].y).toEqual(30);
  });

  test('should get right SubTotals position when valueInCols is false', async () => {
    s2.setDataCfg({
      ...mockDataConfig,
      fields: {
        ...mockDataConfig.fields,
        valueInCols: false,
      },
    });
    s2.setOptions({
      ...s2Options,
      totals: {
        ...s2Options.totals,
        row: {
          ...s2Options.totals!.row,
          subTotalsDimensions: ['row0'],
        },
      },
    });

    await s2.render();

    const rowSubTotalNodes = s2.facet.getRowSubTotalsNodes();
    const rowSubTotalChildNode = rowSubTotalNodes[0].children[0];

    expect(rowSubTotalNodes[0].x).toEqual(96);
    expect(rowSubTotalNodes[0].y).toEqual(60);

    expect(rowSubTotalChildNode.x).toEqual(288);
    expect(rowSubTotalChildNode.y).toEqual(60);
  });
});
