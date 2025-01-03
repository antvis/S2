import {
  allIndexes,
  diffIndexes,
  diffPanelIndexes,
  isXYInRange,
  type Indexes,
} from '../../../src/utils/indexes';

describe('indexes test', () => {
  test('#isXYInRange()', () => {
    expect(isXYInRange(0, 0, [])).toEqual(false);
    expect(isXYInRange(0, 0, [0, 10, 0, 10])).toEqual(true);
    expect(isXYInRange(10, 10, [0, 10, 0, 10])).toEqual(true);
    expect(isXYInRange(10, 20, [0, 10, 0, 10])).toEqual(false);
    expect(isXYInRange(20, 10, [0, 10, 0, 10])).toEqual(false);
    expect(isXYInRange(20, 20, [0, 10, 0, 10])).toEqual(false);
  });

  test('#allIndexes()', () => {
    expect(allIndexes([] as unknown as Indexes)).toEqual([]);
    expect(allIndexes([0, 1, 0, 1])).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });

  test('#diffIndexes()', () => {
    expect(
      diffIndexes([] as unknown as Indexes, [] as unknown as Indexes),
    ).toEqual({
      add: [],
      remove: [],
    });
    expect(diffIndexes([0, 1, 0, 1], [0, 1, 0, 1])).toEqual({
      add: [],
      remove: [],
    });
    expect(diffIndexes([0, 1, 0, 1], [0, 1, 2, 1])).toMatchSnapshot();
  });

  test('#diffPanelIndexes()', () => {
    expect(
      diffPanelIndexes(
        { center: [] as unknown as Indexes },
        { center: [] as unknown as Indexes },
      ),
    ).toEqual({
      add: [],
      remove: [],
    });
    expect(
      diffPanelIndexes({ center: [0, 1, 0, 1] }, { center: [0, 1, 0, 1] }),
    ).toEqual({
      add: [],
      remove: [],
    });
    expect(
      diffPanelIndexes({ center: [0, 1, 0, 1] }, { center: [0, 1, 2, 1] }),
    ).toMatchSnapshot();
  });
});
