/**
 * @description spec for issue #868
 * https://github.com/antvis/S2/issues/868
 * measure not show  the data type of the row header is number
 */

import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/data-issue-868.json';
import type { S2Options } from '../../src';
import { PivotSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 800,
  height: 600,
};

describe('Measure Test', () => {
  test('should get measure value when the data type of the row header is number', async () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

    await s2.render();

    const dataCell = s2.facet.getDataCells()[0];

    expect(dataCell.getActualText()).toEqual('2');
  });
});
