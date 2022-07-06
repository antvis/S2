import _ from 'lodash';
import type { Node } from '@/facet/layout/node';
import { PivotDataSet } from '@/data-set';
import { SpreadSheet, PivotSheet } from '@/sheet-type';
import { ColCell } from '@/cell';
import type { TextAlign } from '@/common';

const MockPivotSheet = PivotSheet as unknown as jest.Mock<PivotSheet>;
const MockPivotDataSet = PivotDataSet as unknown as jest.Mock<PivotDataSet>;

describe('Col Cell Tests', () => {
  let s2: SpreadSheet;

  beforeEach(() => {
    const container = document.createElement('div');

    s2 = new MockPivotSheet(container);
    const dataSet: PivotDataSet = new MockPivotDataSet(s2);
    s2.dataSet = dataSet;
  });

  describe('None-leaf Nodes Tests', () => {
    const node = {
      isLeaf: false,
      x: 0,
      y: 0,
      height: 30,
      width: 200,
    } as unknown as Node;

    const headerConfig = {
      width: 500, // col header width
      scrollContainsRowHeader: true,
      cornerWidth: 100,
      scrollX: 30, // 模拟滚动了 30px
    };

    const actualTextWidth = 40; // 文字长度

    test.each([
      ['left', 8], // col.padding.left
      ['center', 100], // col.width / 2
      ['right', 192], // col.width - col.padding.right
    ])(
      'should calc node text position in %s align mode',
      (textAlign: TextAlign, textX: number) => {
        s2.setThemeCfg({
          theme: {
            colCell: {
              bolderText: {
                textAlign,
              },
            },
          },
        });

        const colCell = new ColCell(node, s2, { ...headerConfig });
        _.set(colCell, 'actualTextWidth', actualTextWidth); // 文字总长度

        const getTextPosition = _.get(colCell, 'getTextPosition').bind(colCell);
        expect(getTextPosition()).toEqual({
          x: textX,
          y: 15,
        });
      },
    );

    test.each([
      ['left', 52], // col.padding.left + actualTextWidth + icon.margin.left
      ['center', 115], // col.width / 2 + (actualTextWidth + icon.margin.left + icon.width + icon.margin.right) / 2  - (icon.width + icon.margin.right)
      ['right', 178], // col.width - col.padding.right - icon.margin.right - icon.width
    ])(
      'should calc icon position in %s align mode',
      (textAlign: TextAlign, iconX: number) => {
        s2.setThemeCfg({
          theme: {
            colCell: {
              bolderText: {
                textAlign,
              },
            },
          },
        });
        s2.setOptions({
          headerActionIcons: [
            {
              iconNames: ['SortUp'],
              belongsCell: 'colCell',
              displayCondition: (meta) => {
                return !meta.isLeaf;
              },
              action: () => true,
            },
          ],
        });

        const colCell = new ColCell(node, s2, { ...headerConfig });
        _.set(colCell, 'actualTextWidth', actualTextWidth); // 文字总长度

        const getIconPosition = _.get(colCell, 'getIconPosition').bind(colCell);
        expect(getIconPosition()).toEqual({
          x: iconX,
          y: 10,
        });
      },
    );
  });
});
