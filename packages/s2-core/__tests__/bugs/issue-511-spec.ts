/**
 * @description spec for issue #511
 * https://github.com/antvis/S2/issues/511
 * The rendering data order does not match the data order
 */
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/data-issue-511.json';
import { PivotSheet } from '@/sheet-type';

const s2Options = {
  width: 800,
  height: 600,
};

describe('Data order Test', () => {
  const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);
  s2.render();
  test('should get right order of rendering data', () => {
    const rowLeafNodes = s2.facet.layoutResult.rowLeafNodes;
    expect(rowLeafNodes[0].label).toEqual('张三');
    expect(rowLeafNodes[1].label).toEqual('李四');
  });
});
