/* eslint-disable @typescript-eslint/ban-ts-comment */
import { set } from 'lodash';
import { createFakeSpreadSheet, createPivotSheet } from 'tests/util/helpers';
import type { ColHeaderConfig } from '../../../src/facet/header';
import { getContainer } from './../../util/helpers';
import { ColCell } from '@/cell';
import { EXTRA_FIELD, type Formatter, type TextAlign } from '@/common';
import { PivotDataSet } from '@/data-set';
import type { Node } from '@/facet/layout/node';
import { PivotSheet, SpreadSheet } from '@/sheet-type';

const MockPivotSheet = PivotSheet as unknown as jest.Mock<PivotSheet>;
const MockPivotDataSet = PivotDataSet as unknown as jest.Mock<PivotDataSet>;

describe('Col Cell Tests', () => {
  let s2: SpreadSheet;

  beforeEach(() => {
    s2 = new MockPivotSheet(getContainer());
    s2.isFrozenRowHeader = () => false;
    s2.dataSet = new MockPivotDataSet(s2);
  });

  describe('None-leaf Nodes Tests', () => {
    const node = {
      isLeaf: false,
      x: 0,
      y: 0,
      height: 30,
      width: 200,
    } as unknown as Node;

    const headerConfig: Partial<ColHeaderConfig> = {
      width: 500, // col header width
      cornerWidth: 100,
      scrollX: 30, // 模拟滚动了 30px
    };

    const actualTextWidth = 40; // 文字长度

    test.each([
      ['left', 8], // col.padding.left
      ['center', 99.5], // col.width / 2 - border
      ['right', 191], // col.width - col.padding.right - border
    ] as [TextAlign, number][])(
      'should calc node text position in %s align mode',
      (textAlign, textX) => {
        s2.setThemeCfg({
          theme: {
            colCell: {
              bolderText: {
                textAlign,
              },
            },
          },
        });

        const colCell = new ColCell(node, s2, headerConfig);

        set(colCell, 'actualTextWidth', actualTextWidth); // 文字总长度

        // @ts-ignore
        const getTextPosition = colCell.getTextPosition.bind(colCell);

        expect(getTextPosition()).toEqual({
          x: textX,
          y: 15.5,
        });
      },
    );
  });

  describe('Col Cell Formatter Test', () => {
    const node = {
      id: 1,
      fieldValue: 'fieldValue',
      value: 'value',
      width: 100,
      height: 10,
    } as unknown as Node;

    const headerConfig: Partial<ColHeaderConfig> = {
      spreadsheet: createFakeSpreadSheet(),
    };

    test('should get correct col cell formatter', () => {
      const formatter = jest.fn();

      jest.spyOn(s2.dataSet, 'getFieldFormatter').mockReturnValue(formatter);

      // eslint-disable-next-line no-new
      new ColCell(node, s2, headerConfig);

      expect(formatter).toHaveBeenCalledWith(node.value, undefined, node);
    });

    test('should return correct formatted value', () => {
      const formatter: Formatter = jest.fn(() => 'test');

      jest.spyOn(s2.dataSet, 'getFieldFormatter').mockReturnValue(formatter);

      const colCell = new ColCell(node, s2, headerConfig);

      expect(colCell.getTextShape().attr('text')).toEqual('test');
    });
  });

  describe('Condition Tests', () => {
    const s2 = createPivotSheet({
      conditions: {
        text: [
          {
            field: EXTRA_FIELD,
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
      const colCell = s2.facet.getColCells()[1];

      expect(colCell.getTextShape().parsedStyle.fill).toBeColor('#5083F5');
    });

    test('should draw right condition icon shape', async () => {
      s2.setOptions({
        conditions: {
          icon: [
            {
              field: 'type',
              mapping(field) {
                if (field === '笔') {
                  return {
                    icon: 'CellUp',
                    fill: 'red',
                  };
                }
              },
            },
          ],
        },
      });
      await s2.render();

      const colCell = s2.facet.getColCells()[0];

      // @ts-ignore
      expect(colCell.rightIconPosition).toEqual({
        x: 152,
        y: 10.5,
      });
    });

    test('should draw right condition background shape', async () => {
      s2.setOptions({
        conditions: {
          background: [
            {
              field: EXTRA_FIELD,
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
      const colCell = s2.facet.getColCells()[1];

      expect(colCell.getBackgroundShape().parsedStyle.fill).toBeColor(
        '#F7B46F',
      );
    });

    test('should render text by text theme', async () => {
      s2.setOptions({
        conditions: {
          text: [
            {
              field: 'type',
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

      const colCell = s2.facet.getColCells()[0];
      const { fill, fontSize, fontWeight } = colCell.getTextShape().attributes;

      expect(fill).toEqual('red');
      expect(fontSize).toEqual(20);
      expect(fontWeight).toEqual(800);
    });
  });
});
