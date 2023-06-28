import * as mockDataConfig from 'tests/data/data-issue-372.json';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet } from '@/sheet-type';
import type { S2Options } from '@/common';

const s2options: S2Options = {
  width: 800,
  height: 600,
};

describe('Row width Test in grid mode', () => {
  let s2: PivotSheet;

  beforeEach(() => {
    s2 = new PivotSheet(getContainer(), mockDataConfig, s2options);
    s2.render();
  });

  test('get the correct custom width of row nodes when the layoutWidthType equals adaptive', () => {
    const rowNodes = s2.facet.getRowNodes();

    expect(Math.round(rowNodes[0].width)).toBe(266);
  });

  test('get the correct custom width of row nodes when the layoutWidthType equals colAdaptive', () => {
    s2.setOptions({
      style: {
        layoutWidthType: 'compact',
        rowCell: { width: 50 },
      },
    });
    s2.render();

    const rowNodes = s2.facet.getRowNodes();

    expect(rowNodes[0].width).toBe(50);
  });

  test('get the correct custom width of row nodes when the layoutWidthType equals compact', () => {
    s2.setOptions({
      style: {
        layoutWidthType: 'compact',
        rowCell: { width: 20 },
      },
    });
    s2.render();

    const rowNodes = s2.facet.getRowNodes();

    expect(rowNodes[0].width).toBe(20);
  });
});
