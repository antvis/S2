import { getValidFrozenOptions } from '../../../../src/utils/layout/frozen';

describe('frozen test', () => {
  test('should get valid frozen options', () => {
    expect(
      getValidFrozenOptions(
        {
          frozenColCount: 0,
          frozenRowCount: 0,
          frozenTrailingColCount: 0,
          frozenTrailingRowCount: 0,
        },
        10,
        10,
      ),
    ).toMatchSnapshot();

    expect(
      getValidFrozenOptions(
        {
          frozenColCount: 1,
          frozenRowCount: 2,
          frozenTrailingColCount: 3,
          frozenTrailingRowCount: 4,
        },
        10,
        10,
      ),
    ).toMatchSnapshot();

    expect(
      getValidFrozenOptions(
        {
          frozenColCount: 11,
          frozenRowCount: 11,
          frozenTrailingColCount: 11,
          frozenTrailingRowCount: 11,
        },
        10,
        10,
      ),
    ).toMatchSnapshot();
  });
});
