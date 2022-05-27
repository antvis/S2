/**
 * @description spec for issue #860
 * https://github.com/antvis/S2/issues/860
 * Column should not be formatted
 *
 */
import { getContainer } from 'tests/util/helpers';
import dataCfg from '../data/data-issue-860.json';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import { S2Options } from '@/common/interface';

const s2Options: S2Options = {
  width: 600,
  height: 400,
  frozenRowHeader: false,
};

describe('Empty String Row Value Tests', () => {
  let s2: SpreadSheet;

  beforeEach(() => {
    s2 = new PivotSheet(getContainer(), dataCfg, s2Options);
    s2.render();
  });
  test('should get correct row hierarchy with empty row node', () => {
    const layoutResult = s2.facet.layoutResult;
    expect(layoutResult.rowNodes).toHaveLength(8);
    expect(layoutResult.rowLeafNodes).toHaveLength(5);
  });
});
