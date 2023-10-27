/**
 * @description spec for issue #2385
 * https://github.com/antvis/S2/issues/2385
 */
import { createPivotSheet, getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/data-issue-2385.json';
import type { S2Options } from '../../src';
import { PivotSheet, TableSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 800,
  height: 600,
  style: {
    cellCfg: {
      width: 200,
    },
    layoutWidthType: 'compact',
  },
};

describe('Compare Layout Tests', () => {
  test('should get max col width for pivot sheet', () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
    s2.setTheme({
      dataCell: {
        text: {
          fontSize: 20,
        },
      },
    });
    s2.render();

    const colLeafNodes = s2.facet.layoutResult.colLeafNodes;
    expect(Math.floor(colLeafNodes[0].width)).toBeCloseTo(179);
    expect(Math.floor(colLeafNodes[1].width)).toEqual(98);
  });

  test('should get max col width for table sheet', () => {
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
    s2.render();

    const colLeafNodes = s2.facet.layoutResult.colLeafNodes;
    expect(Math.floor(colLeafNodes[0].width)).toBeCloseTo(165);
  });
});
