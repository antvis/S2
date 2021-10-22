/**
 * @description spec for issue #511
 * https://github.com/antvis/S2/issues/511
 * discussions: https://github.com/antvis/S2/discussions/384
 * Wrong order of multi-values
 */
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/data-issue-511.json';
import { PivotSheet } from '@/sheet-type';

const s2options = {
  width: 800,
  height: 600,
};

describe('Total Cells Rendering Test', () => {
  const s2 = new PivotSheet(getContainer(), mockDataConfig, s2options);
  s2.render();
  test('should get right order of multi-values', () => {
    const colLeafNodes = s2.facet.layoutResult.colLeafNodes;
    expect(colLeafNodes[0].label).toEqual('price');
    expect(colLeafNodes[1].label).toEqual('cost');
  });
});
