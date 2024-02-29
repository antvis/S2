/**
 * @description spec for issue #1520
 * https://github.com/antvis/S2/issues/1520
 * 数据为0时，图标标记中的图标不显示
 */
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/data-issue-1520.json';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import { GuiIcon, type S2Options } from '@/common';

const s2Options: S2Options = {
  width: 800,
  height: 600,
  conditions: {
    icon: [
      {
        field: 'cost',
        mapping: () => {
          return { fill: 'red', icon: 'CellUp' };
        },
      },
    ],
  },
};

describe('Conditions Test', () => {
  let s2: SpreadSheet;

  beforeEach(async () => {
    s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

    await s2.render();
  });

  test('should render icon for cell with field value 0', () => {
    const dataNodes = s2.facet.getDataCells();

    dataNodes.forEach((node) => {
      const drawIcon = node.children.some((child) => child instanceof GuiIcon);

      expect(drawIcon).toBeTrue();
    });
  });
});
