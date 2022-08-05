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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  pagination: {
    pageSize: 2,
  },
};

describe('Pagination Tests', () => {
  const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
  s2.render();

  test('should get correctly pagination scroll y if pagination.current is empty', () => {
    expect(s2.facet.getPaginationScrollY()).toEqual(0);
  });
});
