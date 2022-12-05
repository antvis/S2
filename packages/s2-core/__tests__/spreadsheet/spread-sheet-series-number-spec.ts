import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet } from '@/sheet-type';
import type { S2Options } from '@/common';
import type { SeriesNumberCell } from '@/cell';

const s2Options: S2Options = {
  width: 400,
  height: 400,
  hierarchyType: 'grid',
  showSeriesNumber: true,
};

describe('SpreadSheet Series Number Tests', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = getContainer();
  });

  test('series number should only contain root parent in grid mode', () => {
    const s2 = new PivotSheet(container, mockDataConfig, s2Options);
    s2.render();

    const seriesNumberHeader = s2.facet.seriesNumberHeader;
    expect(seriesNumberHeader?.children).toHaveLength(1);

    const seriesNum1 = seriesNumberHeader?.children[0] as SeriesNumberCell;
    // @ts-ignore
    expect(seriesNum1.meta.height).toEqual(60);
  });

  test("series number should contain root parent and it's all children in tree mode", () => {
    const s2 = new PivotSheet(container, mockDataConfig, {
      ...s2Options,
      hierarchyType: 'tree',
    });
    s2.render();

    const seriesNumberHeader = s2.facet.seriesNumberHeader;
    expect(seriesNumberHeader?.children).toHaveLength(1);

    const seriesNum1 = seriesNumberHeader?.children[0] as SeriesNumberCell;
    // @ts-ignore
    expect(seriesNum1.meta.height).toEqual(90);
  });
});
