/**
 * @description spec for issue #2385
 * https://github.com/antvis/S2/issues/2385
 */
import { LayoutWidthType, type S2Options } from '../../src';
import * as mockDataConfig from '../data/data-issue-2385.json';
import { getContainer } from '../util/helpers';
import { PivotSheet, TableSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 800,
  height: 600,
  style: {
    dataCell: {
      width: 200,
    },
    layoutWidthType: LayoutWidthType.Compact,
  },
};

describe('Compare Layout Tests', () => {
  test('should get max col width for pivot sheet', async () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

    s2.setTheme({
      dataCell: {
        text: {
          fontSize: 20,
        },
      },
    });
    await s2.render();

    const colLeafNodes = s2.facet.getColLeafNodes();

    expect(Math.floor(colLeafNodes[0].width)).toBeCloseTo(189);
    expect(Math.floor(colLeafNodes[1].width)).toEqual(90);
  });

  test('should get max col width for table sheet', async () => {
    const s2 = new TableSheet(getContainer(), mockDataConfig, s2Options);

    s2.setDataCfg({
      fields: {
        columns: ['price'],
      },
    });
    s2.setTheme({
      dataCell: {
        text: {
          fontSize: 20,
        },
      },
    });

    await s2.render();

    const colLeafNodes = s2.facet.getColLeafNodes();

    expect(Math.floor(colLeafNodes[0].width)).toBeCloseTo(182);
  });
});
