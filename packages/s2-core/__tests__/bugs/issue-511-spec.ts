/**
 * @description spec for issue #511
 * https://github.com/antvis/S2/issues/511
 * The rendering data order does not match the data order
 */
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/data-issue-511.json';
import type { S2Options } from '../../src';
import { PivotSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 800,
  height: 600,
};

describe('Data order Test', () => {
  test('should get right order of rendering data', async () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

    await s2.render();

    const rowLeafNodes = s2.facet.getRowLeafNodes();

    expect(rowLeafNodes[0].value).toEqual('张三');
    expect(rowLeafNodes[1].value).toEqual('李四');
  });
});
