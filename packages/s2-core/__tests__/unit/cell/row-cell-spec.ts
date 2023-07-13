import { get } from 'lodash';
import { createPivotSheet } from 'tests/util/helpers';
import type { RowCell } from '@antv/s2';
import type { SpreadSheet } from '@/sheet-type';
import type { TextAlign } from '@/common';

describe('Row Cell Tests', () => {
  describe('Link Shape Tests', () => {
    let s2: SpreadSheet;

    beforeEach(async () => {
      s2 = createPivotSheet({});
      await s2.render();
    });

    test.each([
      ['left', 21],
      ['center', 75],
      ['right', 129],
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

        const provinceCell = s2.facet.rowHeader!.children[0] as RowCell;
        const { left: minX, right: maxX } = provinceCell
          .getLinkFieldShape()
          .getBBox();

        // 宽度相当
        const linkLength = maxX - minX;

        expect(
          Math.abs(linkLength - get(provinceCell, 'actualTextWidth')),
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
      const rowCell = s2.facet.rowHeader!.children[1] as RowCell;

      expect(rowCell.getTextShape().parsedStyle.fill).toBeColor('#5083F5');
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
      const rowCell = s2.facet.rowHeader!.children[1];

      expect(get(rowCell, 'conditionIconShape.cfg.name')).toEqual('CellUp');
      expect(get(rowCell, 'conditionIconShape.cfg.fill')).toEqual('red');
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
      const rowCell = s2.facet.rowHeader!.children[0];

      expect(get(rowCell, 'backgroundShape.parsedStyle.fill')).toBeColor(
        '#F7B46F',
      );
    });

    test('should render text by text theme', () => {
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
      s2.render();

      const rowCell = s2.facet.rowHeader!.children[1] as RowCell;
      const { fill, fontSize, fontWeight } = rowCell.getTextShape().attributes;

      expect(fill).toEqual('red');
      expect(fontSize).toEqual(20);
      expect(fontWeight).toEqual(800);
    });
  });
});
