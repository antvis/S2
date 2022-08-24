import { createPivotSheet } from 'tests/util/helpers';
import type { SpreadSheet } from '@/sheet-type';
import type { TextAlign } from '@/common';

describe('Row Cell Tests', () => {
  describe('Link Shape Tests', () => {
    let s2: SpreadSheet;

    beforeEach(() => {
      s2 = createPivotSheet({});
      s2.render();
    });

    test.each([
      ['left', 20],
      ['center', 77],
      ['right', 130],
    ])(
      'should align link shape with text',
      (textAlign: TextAlign, textCenterX: number) => {
        s2.setOptions({
          interaction: {
            linkFields: ['province'],
          },
        });
        s2.setTheme({
          rowCell: {
            bolderText: {
              textAlign,
            },
          },
        });
        s2.render();

        const provinceCell = s2.facet.rowHeader.getChildByIndex(0);
        const { minX, maxX } = provinceCell.linkFieldShape.getBBox();

        // 宽度相当
        const linkLength = maxX - minX;
        expect(
          Math.abs(linkLength - provinceCell.actualTextWidth),
        ).toBeLessThanOrEqual(2);

        // link shape 的中点坐标与 text 中点对齐
        const linkCenterX = minX + linkLength / 2;
        expect(linkCenterX).toEqual(textCenterX);
      },
    );
  });
});
