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
  hdAdapter: false,
};

describe('Data Cell Border Tests', () => {
  const borderWidth = 4;
  const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

  s2.setTheme({
    dataCell: {
      cell: {
        verticalBorderWidth: borderWidth,
        horizontalBorderWidth: borderWidth,
      },
    },
  });

  test('should draw correct data cell border when hover focus', async () => {
    await s2.render();

    const dataCell = s2.facet.getDataCells()[0];

    s2.emit(S2Event.DATA_CELL_HOVER, {
      target: dataCell,
    } as any);

    await sleep(40);

    const meta = dataCell.getBBoxByType();
    // @ts-ignore
    const borderBbox = dataCell.stateShapes
      .get('interactiveBorderShape')
      .getBBox();

    expect(meta.width).toBeGreaterThanOrEqual(borderBbox.width + borderWidth);
    expect(meta.height).toBeGreaterThanOrEqual(borderBbox.height + borderWidth);
  });
});
