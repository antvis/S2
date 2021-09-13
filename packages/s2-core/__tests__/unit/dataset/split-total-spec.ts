/**
 * split-total function test
 */
import { every } from 'lodash';
import STANDARD_SPREADSHEET_DATA from '../../data/standard-spreadsheet-data.json';
import { splitTotal } from '@/index';

describe('DataSet splitTotal function test', () => {
  test('should return all total data.', () => {
    const fields = {
      rows: ['province', 'city'],
      columns: ['category', 'subCategory'],
    };
    const totals = splitTotal(STANDARD_SPREADSHEET_DATA.data, fields);
    totals.forEach((total) => {
      const dimensions = [].concat(fields.rows).concat(fields.columns);
      expect(every(dimensions, (dimension) => total[dimension])).toBe(false);
    });
  });
});
