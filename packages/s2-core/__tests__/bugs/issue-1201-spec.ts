/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * @description spec for issue #1201
 * https://github.com/antvis/S2/issues/1201
 * fillOpacity
 */
import type { Group, IGroup } from '@antv/g-canvas';
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/data-issue-292.json';
import { PivotSheet } from '@/sheet-type';

const s2Options = {
  width: 800,
  height: 600,
};

describe('background color opacity test', () => {
  test('should set background color opacity correctly', () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
    s2.setThemeCfg({
      theme: {
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
      },
    });

    s2.render();

    // corner cell
    const cornerCell = s2.facet.cornerHeader.getChildByIndex(0);
    // @ts-ignore
    expect(cornerCell.backgroundShape.attr('fillOpacity')).toEqual(0.1);

    // row cell
    const rowHeaderScrollGroup = s2.facet.rowHeader.getChildByIndex(0) as Group;
    const rowCell = rowHeaderScrollGroup.getFirst();
    // @ts-ignore
    expect(rowCell.backgroundShape.attr('fillOpacity')).toEqual(0.2);

    // col cell
    const colCell = (
      s2.facet.columnHeader.getChildByIndex(0) as IGroup
    ).getChildByIndex(0);
    // @ts-ignore
    expect(colCell.backgroundShape.attr('fillOpacity')).toEqual(0.3);
  });
});
