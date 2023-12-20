import type { IElement } from '@antv/g-lite';
import { get } from 'lodash';
import { createPivotSheet } from 'tests/util/helpers';
import type { RowCell } from '../../../src/cell';
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

        const provinceCell = s2.facet.rowHeader!
          .children[0] as unknown as IElement[] as unknown as RowCell;
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

      const rowCell = s2.facet.rowHeader!.children[1] as RowCell;
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
    s2.render();

    test('should draw right condition background shape', () => {
      const scrollGroup = s2.facet.rowHeader?.children[0]!;
      const rowCell0 = scrollGroup.children[0];
      const rowCell1 = scrollGroup.children[0];
      const rowCell2 = scrollGroup.children[0];

      expect(get(rowCell0, 'actualText')).toEqual('浙江');
      expect(get(rowCell0, 'backgroundShape.attrs.fill')).toEqual(defaultColor);
      expect(get(rowCell1, 'actualText')).toEqual('义乌');
      expect(get(rowCell1, 'backgroundShape.attrs.fill')).toEqual(crossColor);
      expect(get(rowCell2, 'actualText')).toEqual('杭州');
      expect(get(rowCell2, 'backgroundShape.attrs.fill')).toEqual(defaultColor);
    });
  });
});
