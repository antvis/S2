import { size, sumBy } from 'lodash';
import {
  getTooltipData,
  mergeCellInfo,
  SpreadSheet,
  type S2CellType,
  type TooltipSummaryOptions,
} from '../../src';

export const expectHighlightActiveNodes = (
  s2: SpreadSheet,
  ids: string[] = [],
) => {
  const state = s2.interaction.getState();
  const nodeIds = state.nodes?.map((node) => node.id);

  expect(nodeIds).toEqual(ids);
};

export const getSelectedCount = (
  summaries: TooltipSummaryOptions[] | undefined,
) => sumBy(summaries, (item) => size(item?.selectedData));

export const getSelectedSum = (
  summaries: TooltipSummaryOptions[] | undefined,
) => sumBy(summaries, 'value');

export const getTestTooltipData = (s2: SpreadSheet, cell: S2CellType) => {
  const cellInfos = mergeCellInfo(s2.interaction.getActiveCells());

  return getTooltipData({
    spreadsheet: s2,
    cellInfos,
    targetCell: cell,
    options: {
      onlyShowCellText: true,
    },
  });
};

export const mapCellNodeValues = (s2: SpreadSheet) => {
  const colNodes = s2.facet.getColNodes().map((node) => {
    return {
      actualText: node.belongsCell?.getActualText(),
      value: node.value,
      id: node.field,
    };
  });

  const rowNodes = s2.facet.getRowNodes().map((node) => {
    return {
      actualText: node.belongsCell?.getActualText(),
      value: node.value,
      id: node.field,
    };
  });

  const dataCellTexts = s2.facet
    .getDataCells()
    .map((cell) => cell.getActualText());

  return {
    colNodes,
    rowNodes,
    dataCellTexts,
  };
};
