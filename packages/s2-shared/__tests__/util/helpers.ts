import { getCellMeta, InteractionStateName, type SpreadSheet } from '@antv/s2';

export interface ExpectSelectedCellsSpotlightOptions {
  s2: SpreadSheet;
  selectedCellId: string;
  selectedCount: number;
}

export const expectSelectedCellsSpotlight = (
  options: ExpectSelectedCellsSpotlightOptions,
) => {
  const { s2, selectedCellId, selectedCount } = options;

  const selectedDataCell = s2.interaction
    .getPanelGroupAllDataCells()
    .find((cell) => cell.getMeta().id === selectedCellId)!;

  s2.interaction.changeState({
    cells: [getCellMeta(selectedDataCell)],
    stateName: InteractionStateName.SELECTED,
  });

  const allDataCells = s2.interaction.getPanelGroupAllDataCells();
  const unSelectedDataCells =
    s2.interaction.getPanelGroupAllUnSelectedDataCells();

  expect(allDataCells).toHaveLength(selectedCount);
  // 选中一个
  expect(unSelectedDataCells).toHaveLength(selectedCount - 1);
  // 其余置灰
  unSelectedDataCells
    .filter((cell) => cell.getTextShape())
    .forEach((cell) => {
      const textShape = cell.getTextShape();
      expect(textShape.attr('fillOpacity')).toEqual(0.3);
    });
};
