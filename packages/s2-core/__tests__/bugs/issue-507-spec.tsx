/**
 * @description spec for issue #507
 * https://github.com/antvis/S2/issues/507
 * Show err when hierarchyType is tree and data is empty
 *
 */

import { getContainer } from '../util/helpers';
import * as dataCfg from '../data/data-issue-507.json';
import { S2Options, PivotSheet } from '@/index';

const s2options: S2Options = {
  width: 800,
  height: 600,
  hierarchyType: 'tree',
};

describe('Spreadsheet Empty Test', () => {
  const s2 = new PivotSheet(getContainer(), dataCfg, s2options);
  s2.render();
  test('should render skeleton when the data is empty', () => {
    const layoutResult = s2.facet.layoutResult;
    expect(layoutResult.colNodes).toEqual(3);
    expect(layoutResult.rowNodes).toEqual(2);
  });
});
