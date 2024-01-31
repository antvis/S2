import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';
import { type S2Options, PivotSheet } from '../../src';

const s2Options: S2Options = {
  width: 400,
  height: 400,
  hierarchyType: 'grid',
  seriesNumber: {
    enable: true,
  },
};

describe('SpreadSheet Series Number Tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = getContainer();
  });

  test('series number should only contain root parent in grid mode', async () => {
    const s2 = new PivotSheet(container, mockDataConfig, s2Options);

    await s2.render();

    const seriesNumberCell = s2.facet.getSeriesNumberCells();

    expect(seriesNumberCell).toHaveLength(1);
    expect(seriesNumberCell[0].getMeta().height).toEqual(60);
  });

  test("series number should contain root parent and it's all children in tree mode", async () => {
    const s2 = new PivotSheet(container, mockDataConfig, {
      ...s2Options,
      hierarchyType: 'tree',
    });

    await s2.render();

    const seriesNumberCell = s2.facet.getSeriesNumberCells();

    expect(seriesNumberCell).toHaveLength(1);
    expect(seriesNumberCell[0].getMeta().height).toEqual(90);
  });
});
