/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * @description spec for issue #1201
 * https://github.com/antvis/S2/issues/1201
 * fillOpacity
 */
import type { S2Options } from '../../src';
import * as mockDataConfig from '../data/data-issue-292.json';
import { getContainer } from '../util/helpers';
import { PivotSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 800,
  height: 600,
};

describe('background color opacity test', () => {
  test('should set background color opacity correctly', async () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

    s2.setTheme({
      cornerCell: {
        cell: {
          backgroundColorOpacity: 0.1,
        },
      },
      rowCell: {
        cell: {
          backgroundColorOpacity: 0.2,
        },
      },
      colCell: {
        cell: {
          backgroundColorOpacity: 0.3,
        },
      },
    });

    await s2.render();

    // corner cell
    const cornerCell = s2.facet.getCornerCells()[0];

    expect(cornerCell.getBackgroundShape().style.fillOpacity).toEqual(0.1);

    // row cell
    const rowCell = s2.facet.getRowCells()[0];

    expect(rowCell.getBackgroundShape().style.fillOpacity).toEqual(0.2);

    // col cell
    const colCell = s2.facet.getColCells()[0];

    expect(colCell.getBackgroundShape().style.fillOpacity).toEqual(0.3);
  });
});
