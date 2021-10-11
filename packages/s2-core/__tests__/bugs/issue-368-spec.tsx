/**
 * @description spec for issue #368
 * https://github.com/antvis/S2/issues/368
 * Wrong style when show the totals in multi-value mode
 *
 */
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/data-issue-368.json';
import { PivotSheet } from '@/sheet-type';

const s2options = {
  width: 800,
  height: 600,
  totals: {
    row: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
      subTotalsDimensions: ['row0', 'row1'],
    },
    col: {
      showGrandTotals: true,
      showSubTotals: true,
      reverseLayout: true,
      reverseSubLayout: true,
      subTotalsDimensions: ['col0', 'col1'],
    },
  },
};

describe('Total Cells Rendering Test', () => {
  const s2 = new PivotSheet(getContainer(), mockDataConfig, s2options);
  s2.setThemeCfg({ name: 'simple' });
  s2.render();
});
