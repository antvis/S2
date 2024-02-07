import { createPivotSheet } from 'tests/util/helpers';
import { PivotDataSet } from '../../src';
import { pickMap } from '../util/fp';

describe('SpreadSheet Custom Dataset Tests', () => {
  class CustomDataSet extends PivotDataSet {
    public getFieldName() {
      return 'test';
    }
  }

  test('should render custom data set', async () => {
    const s2 = createPivotSheet({
      dataSet: (spreadsheet) => new CustomDataSet(spreadsheet),
    });

    await s2.render();

    const headerNodes = pickMap(['id', 'values'])(s2.facet.getHeaderNodes());

    expect(headerNodes).toMatchSnapshot();
  });
});
