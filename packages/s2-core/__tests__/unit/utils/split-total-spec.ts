/**
 * split-total function test
 */
import { splitTotal } from 'src/index';
import { every } from 'lodash';
import { data, totalData } from 'tests/data/mock-dataset.json';

describe('DataSet splitTotal function test', () => {
  test('should return all total data.', () => {
    const fields = {
      rows: ['province', 'city'],
      columns: ['category', 'subCategory'],
    };
    const totals = splitTotal([].concat(data).concat(totalData), fields);
    totals.forEach((total) => {
      const dimensions = [].concat(fields.rows).concat(fields.columns);
      expect(every(dimensions, (dimension) => total[dimension])).toBe(false);
    });
  });
});
