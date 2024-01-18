/**
 * @description spec for issue #2501
 * https://github.com/antvis/S2/issues/2501
 */

import type { TableFacet } from '../../src/facet';
import * as mockDataConfig from '../data/simple-table-data.json';
import { getContainer } from '../util/helpers';
import type { SpreadSheet, S2DataConfig, S2Options } from '@/index';
import { TableSheet } from '@/sheet-type';

const s2DataConfig: S2DataConfig = {
  ...mockDataConfig,
};

const s2Options: S2Options = {
  width: 800,
  height: 400,
  style: {
    rowCell: {
      heightByField: {
        '0': 100,
        '1': 150,
      },
    },
  },
};

describe('Table Sheet Row Offsets Tests', () => {
  let s2: SpreadSheet;

  beforeEach(async () => {
    s2 = new TableSheet(getContainer(), s2DataConfig, s2Options);

    await s2.render();
  });

  test('should get correctly row offset data', () => {
    expect((s2.facet as TableFacet).rowOffsets).toMatchInlineSnapshot(`
      Array [
        0,
        100,
        250,
        280,
      ]
    `);
  });

  test('should get correctly data cell offset for heightByField', () => {
    const { getCellOffsetY, getTotalHeight } = s2.facet.getViewCellHeights();

    expect(getCellOffsetY(0)).toEqual(0);
    expect(getCellOffsetY(1)).toEqual(100);
    expect(getCellOffsetY(2)).toEqual(250);
    expect(getTotalHeight()).toEqual(280);
  });

  test('should get correctly row layout for heightByField', () => {
    const { getTotalLength } = s2.facet.getViewCellHeights();

    expect(getTotalLength()).toEqual(3);
  });
});
