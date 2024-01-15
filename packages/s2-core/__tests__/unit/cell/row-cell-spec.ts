import { createPivotSheet } from 'tests/util/helpers';
import type { TextAlign } from '@/common';
import type { SpreadSheet } from '@/sheet-type';

describe('Row Cell Tests', () => {
  describe('Link Shape Tests', () => {
    let s2: SpreadSheet;

    beforeEach(async () => {
      s2 = createPivotSheet({});
      await s2.render();
    });

    test.each([
      ['left', 21],
      ['center', 75.25],
      ['right', 129.5],
    ] as [TextAlign, number][])(
      'should align link shape with text by %o',
      async (textAlign, textCenterX) => {
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
        await s2.render();

        const provinceCell = s2.facet.getRowCells()[0];
        const { left: minX, right: maxX } = provinceCell
          .getLinkFieldShape()
          .getBBox();

        // 宽度相当
        const linkLength = maxX - minX;

        expect(
          Math.abs(linkLength - provinceCell.getActualTextWidth()),
        ).toBeLessThanOrEqual(2);

        // link shape 的中点坐标与 text 中点对齐
        const linkCenterX = minX + linkLength / 2;

        expect(linkCenterX).toEqual(textCenterX);
      },
    );
  });

  describe('Condition Tests', () => {
    const s2 = createPivotSheet({
      conditions: {
        text: [
          {
            field: 'city',
            mapping() {
              return {
                fill: '#5083F5',
              };
            },
          },
        ],
      },
    });

    test('should draw right condition text shape', async () => {
      await s2.render();
      const rowCell = s2.facet.getRowCells()[1];

      expect(rowCell.getTextShape().style.fill).toEqual('#5083F5');
    });

    test('should draw right condition icon shape', async () => {
      s2.setOptions({
        conditions: {
          icon: [
            {
              field: 'city',
              mapping() {
                return {
                  icon: 'CellUp',
                  fill: 'red',
                };
              },
            },
          ],
        },
      });

      await s2.render();
      const rowCell = s2.facet.getRowCells()[1];

      // @ts-ignore
      expect(rowCell.rightIconPosition).toEqual({ x: 186.5, y: 9.5 });
    });

    test('should draw right condition background shape', async () => {
      s2.setOptions({
        conditions: {
          background: [
            {
              field: 'province',
              mapping() {
                return {
                  fill: '#F7B46F',
                };
              },
            },
          ],
        },
      });

      await s2.render();
      const rowCell = s2.facet.getRowCells()[0];

      expect(rowCell.getBackgroundShape().style.fill).toEqual('#F7B46F');
    });

    test('should render text by text theme', async () => {
      s2.setOptions({
        conditions: {
          text: [
            {
              field: 'city',
              mapping() {
                return {
                  fill: 'red',
                  fontSize: 20,
                  fontWeight: 800,
                };
              },
            },
          ],
        },
      });

      await s2.render();

      const rowCell = s2.facet.getRowCells()[1];
      const { fill, fontSize, fontWeight } = rowCell.getTextShape().attributes;

      expect(fill).toEqual('red');
      expect(fontSize).toEqual(20);
      expect(fontWeight).toEqual(800);
    });
  });

  describe('Cross Background Color Tests', () => {
    const s2 = createPivotSheet({
      width: 800,
      height: 600,
    });

    const crossColor = '#FFFFFF';
    const defaultColor = '#F5F8FF';
    const cellColorConfig = {
      crossBackgroundColor: crossColor,
      backgroundColor: defaultColor,
    };

    s2.setTheme({
      rowCell: {
        cell: cellColorConfig,
      },
      dataCell: {
        cell: cellColorConfig,
      },
    });

    test('should draw right condition background shape', async () => {
      await s2.render();

      const rowCell0 = s2.facet.getRowCells()[0];
      const rowCell1 = s2.facet.getRowCells()[1];
      const rowCell2 = s2.facet.getRowCells()[2];

      expect(rowCell0.getActualText()).toEqual('浙江');
      expect(rowCell0.getBackgroundShape().style.fill).toEqual(defaultColor);

      expect(rowCell1.getActualText()).toEqual('义乌');
      expect(rowCell1.getBackgroundShape().style.fill).toEqual(crossColor);

      expect(rowCell2.getActualText()).toEqual('杭州');
      expect(rowCell2.getBackgroundShape().style.fill).toEqual(defaultColor);
    });
  });
});
