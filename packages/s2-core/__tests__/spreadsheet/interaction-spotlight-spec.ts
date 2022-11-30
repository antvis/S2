import { createPivotSheet } from 'tests/util/helpers';
import { expectSelectedCellsSpotlight } from '@antv/s2-shared/__tests__/util/helpers';
import type { S2Options } from '@/common/interface';
import type { SpreadSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 600,
  height: 400,
  interaction: {
    selectedCellsSpotlight: true,
  },
};

describe('Interaction SelectedCellsSpotlight Tests', () => {
  let s2: SpreadSheet;

  beforeEach(() => {
    s2 = createPivotSheet(s2Options);
    s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  // eslint-disable-next-line jest/expect-expect
  test('should display tooltip when data cell clicked', () => {
    const dataCellId = `root[&]浙江[&]杭州-root[&]笔[&]price`;

    expectSelectedCellsSpotlight({
      s2,
      selectedCount: 4,
      selectedCellId: dataCellId,
    });
  });
});
