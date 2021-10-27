/**
 * @description spec for issue #565
 * https://github.com/antvis/S2/issues/565
 * copyData error in tree mode
 *
 */
import { getContainer } from '../util/helpers';
import * as mockDataConfig from '../data/data-issue-565.json';
import { PivotSheet } from '@/sheet-type';
import { copyData } from '@/utils';

const s2options = {
  width: 800,
  height: 600,
  hierarchyType: 'tree' as const,
};

describe('Export data in pivot tree mode', () => {
  test('should export correct col header in pivot tree mode', () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, s2options);
    s2.render();
    const data = copyData(s2, '\t');
    const rows = data.split('\n');

    expect(rows.length).toEqual(9);
    expect(rows[0].split('\t').length).toEqual(5);
    expect(rows[0].split('\t')[0]).toEqual('');
    expect(rows[1].split('\t')[0]).toEqual('');
    expect(rows[7].split('\t')[0]).toEqual('" row0"');
    expect(rows[8].split('\t')[0]).toEqual('" row0"');
    expect(data.length).toEqual(274);
  });
});
