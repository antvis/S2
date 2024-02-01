/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * @description spec for issue #1624
 * https://github.com/antvis/S2/issues/1624
 */

import * as mockDataConfig from '../data/simple-data.json';
import { getContainer, sleep } from '../util/helpers';
import { S2Event, type S2Options } from '@/index';
import { PivotSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 800,
  height: 600,
  hd: false,
};

describe('Data Cell Border Tests', () => {
  const borderWidth = 4;

  test('should draw correct data cell border when hover focus', async () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

    s2.setTheme({
      dataCell: {
        cell: {
          verticalBorderWidth: borderWidth,
          horizontalBorderWidth: borderWidth,
        },
      },
    });
    await s2.render();

    const dataCell = s2.facet.getDataCells()[0];

    s2.emit(S2Event.DATA_CELL_HOVER, {
      target: dataCell,
    } as any);

    await sleep(40);

    const meta = dataCell.getBBoxByType();
    const borderBBox = dataCell
      .getStateShapes()
      .get('interactiveBorderShape')!
      .getBBox();

    expect(meta.width).toBeGreaterThanOrEqual(borderBBox.width + borderWidth);
    expect(meta.height).toBeGreaterThanOrEqual(borderBBox.height + borderWidth);
  });
});
