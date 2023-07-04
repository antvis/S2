/**
 * @description spec for issue #565
 * https://github.com/antvis/S2/issues/565
 * copyData error in tree mode
 *
 */
import * as mockDataConfig from 'tests/data/data-issue-565.json';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet } from '@/sheet-type';
import { copyData } from '@/utils';

const s2Options = {
  width: 800,
  height: 600,
  hierarchyType: 'tree' as const,
};

describe('Export data in pivot tree mode', () => {
  test('should export correct col header in pivot tree mode', async () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, s2Options);

    await s2.render();
    const data = copyData({
      sheetInstance: s2,
      split: '\t',
    });
    const rows = data.split('\n');

    expect(rows.length).toEqual(9);
    expect(rows[0].split('\t').length).toEqual(5);
    expect(rows[0].split('\t')[0]).toEqual('');
    expect(rows[1].split('\t')[0]).toEqual('');
    expect(rows[7].split('\t')[0]).toEqual('row0');
    expect(rows[8].split('\t')[0]).toEqual('row0');
    expect(data).toMatchInlineSnapshot(`
      "		col0	col0-0	col0-0
      		col1	col1-0	col1-1
      		col2	col2-0	col2-0
      row0	row1	row2	number	number
      row0				
      row0	row1-0			
      row0	row1-0	row2-0	3	
      row0	row1-1			
      row0	row1-1	row2-0	2	4"
    `);
  });
});
