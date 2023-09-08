import { get } from 'lodash';
import { createPivotSheet } from 'tests/util/helpers';
import type { RowCell } from '@antv/s2';
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

        const provinceCell = s2.facet.rowHeader.getChildByIndex(0) as RowCell;
        const { minX, maxX } = (provinceCell as any).linkFieldShape.getBBox();

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
    test('should draw right condition text shape', () => {
      s2.render();
      const rowCell = s2.facet.rowHeader.getChildByIndex(1);
      expect(get(rowCell, 'textShape.attrs.fill')).toEqual('#5083F5');
    });

    test('should draw right condition icon shape', () => {
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
      s2.render();
      const rowCell = s2.facet.rowHeader.getChildByIndex(1);
      expect(get(rowCell, 'conditionIconShape.cfg.name')).toEqual('CellUp');
      expect(get(rowCell, 'conditionIconShape.cfg.fill')).toEqual('red');
    });

    test('should draw right condition background shape', () => {
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
      s2.render();
      const rowCell = s2.facet.rowHeader.getChildByIndex(0);
      expect(get(rowCell, 'backgroundShape.attrs.fill')).toEqual('#F7B46F');
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
      const rowCell0 = s2.facet.rowHeader.getChildByIndex(0);
      const rowCell1 = s2.facet.rowHeader.getChildByIndex(1);
      const rowCell2 = s2.facet.rowHeader.getChildByIndex(2);
      expect(get(rowCell0, 'actualText')).toEqual('浙江');
      expect(get(rowCell0, 'backgroundShape.attrs.fill')).toEqual(defaultColor);
      expect(get(rowCell1, 'actualText')).toEqual('义乌');
      expect(get(rowCell1, 'backgroundShape.attrs.fill')).toEqual(crossColor);
      expect(get(rowCell2, 'actualText')).toEqual('杭州');
      expect(get(rowCell2, 'backgroundShape.attrs.fill')).toEqual(defaultColor);
    });
  });
});
