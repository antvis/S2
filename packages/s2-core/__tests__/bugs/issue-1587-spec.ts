/**
 * @description spec for issue #1587
 * https://github.com/antvis/S2/issues/1587
 */

import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/simple-data.json';
import type { S2Options } from '../../src';
import { PivotSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 800,
  height: 600,
  pagination: {
    current: 1,
    pageSize: 2,
  },
};

describe('Pagination Tests', () => {
  test('should get correctly pagination scroll y if pagination.current is empty', async () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

    await s2.render();

    expect(s2.facet.getPaginationScrollY()).toEqual(0);
  });
});
