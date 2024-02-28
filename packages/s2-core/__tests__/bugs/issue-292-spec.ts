/**
 * @description spec for issue #292
 * https://github.com/antvis/S2/issues/292
 * discussions: https://github.com/antvis/S2/discussions/384
 * Wrong order of multi-values
 */
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/data-issue-292.json';
import type { S2Options } from '../../src';
import { PivotSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 800,
  height: 600,
};

describe('Multi-Values Test', () => {
  test('should get right order of multi-values', async () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

    await s2.render();

    const colLeafNodes = s2.facet.getColLeafNodes();

    expect(colLeafNodes[0].value).toEqual('price');
    expect(colLeafNodes[1].value).toEqual('cost');
  });
});
