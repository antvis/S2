/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * @description spec for issue #1624
 * https://github.com/antvis/S2/issues/1624
 */

import { getContainer, sleep } from '../util/helpers';
import * as mockDataConfig from '../data/simple-data.json';
import { S2Event, type S2Options, DataCell } from '@/index';
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
  s2.render();

  test('should draw correct data cell border when hover focus', async () => {
    const dataCell = s2.panelScrollGroup.getChildren()[0] as DataCell;

    s2.emit(S2Event.DATA_CELL_HOVER, {
      target: dataCell,
    } as any);

    await sleep(40);

    // @ts-ignore
    const meta = dataCell.getCellArea();
    const borderBbox = dataCell.getChildByIndex(2).getBBox();

    expect(meta.x).toEqual(borderBbox.x - borderWidth / 2);
    expect(meta.y).toEqual(borderBbox.y - borderWidth / 2);
    expect(meta.width).toEqual(borderBbox.width + borderWidth);
    expect(meta.height).toEqual(borderBbox.height + borderWidth);
  });
});
