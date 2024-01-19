import * as mockDataConfig from 'tests/data/data-issue-372.json';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet } from '@/sheet-type';
import { LayoutWidthType, type S2Options } from '@/common';

const s2options: S2Options = {
  width: 800,
  height: 600,
};

describe('Row width Test in grid mode', () => {
  let s2: PivotSheet;

  beforeEach(async () => {
    s2 = new PivotSheet(getContainer(), mockDataConfig, s2options);
    await s2.render();
  });

  test('get the correct custom width of row nodes when the layoutWidthType equals adaptive', () => {
    const rowNodes = s2.facet.getRowNodes();

    expect(Math.round(rowNodes[0].width)).toBe(266);
  });

  test('get the correct custom width of row nodes when the layoutWidthType equals colAdaptive', async () => {
    s2.setOptions({
      style: {
        layoutWidthType: LayoutWidthType.Compact,
        rowCell: { width: 50 },
      },
    });
    await s2.render();

    const rowNodes = s2.facet.getRowNodes();

    expect(rowNodes[0].width).toBe(50);
  });

  test('get the correct custom width of row nodes when the layoutWidthType equals compact', async () => {
    s2.setOptions({
      style: {
        layoutWidthType: LayoutWidthType.Compact,
        rowCell: { width: 20 },
      },
    });
    await s2.render();

    const rowNodes = s2.facet.getRowNodes();

    expect(rowNodes[0].width).toBe(20);
  });
});
