import { getValidFrozenOptions } from '../../../../src/utils/layout/frozen';

describe('frozen test', () => {
  test('should get valid frozen options', () => {
    expect(
      getValidFrozenOptions(
        {
          colCount: 0,
          rowCount: 0,
          trailingColCount: 0,
          trailingRowCount: 0,
        },
        10,
        10,
      ),
    ).toMatchSnapshot();

    expect(
      getValidFrozenOptions(
        {
          colCount: 1,
          rowCount: 2,
          trailingColCount: 3,
          trailingRowCount: 4,
        },
        10,
        10,
      ),
    ).toMatchSnapshot();

    expect(
      getValidFrozenOptions(
        {
          colCount: 11,
          rowCount: 11,
          trailingColCount: 11,
          trailingRowCount: 11,
        },
        10,
        10,
      ),
    ).toMatchSnapshot();
  });
});
