import { createPivotSheet } from 'tests/util/helpers';
import type { S2Options } from '@/common/interface';
import type { SpreadSheet } from '@/sheet-type';
import { getCellMeta } from '@/utils';
import { InteractionStateName } from '@/common';

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

  test('should display tooltip when data cell clicked', () => {
    const dataCellId = `root[&]浙江[&]杭州-root[&]笔[&]price`;

    const selectedDataCell = s2.interaction
      .getPanelGroupAllDataCells()
      .find((cell) => cell.getMeta().id === dataCellId)!;

    s2.interaction.changeState({
      cells: [getCellMeta(selectedDataCell)],
      stateName: InteractionStateName.SELECTED,
    });

    const allDataCells = s2.interaction.getPanelGroupAllDataCells();
    const unSelectedDataCells =
      s2.interaction.getPanelGroupAllUnSelectedDataCells();

    expect(allDataCells).toHaveLength(4);
    // 选中一个
    expect(unSelectedDataCells).toHaveLength(3);
    // 其余置灰
    unSelectedDataCells
      .filter((cell) => cell.getTextShape())
      .forEach((cell) => {
        const textShape = cell.getTextShape();
        expect(textShape.attr('fillOpacity')).toEqual(0.3);
      });
  });
});
