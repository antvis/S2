import { InteractionStateName, type ViewMeta } from '../../../common';
import type { SpreadSheet } from '../../../sheet-type';
import { updateAllHeaderCellState } from '../../../utils';
import type { PivotChartFacet } from '../facet/pivot-chart-facet';

function updateDataCellRelevantAxisRowCells(
  stateName: InteractionStateName,
  meta: ViewMeta,
  spreadsheet: SpreadSheet,
) {
  const { rowId } = meta;
  const { facet, interaction } = spreadsheet;
  const { rowHeader } =
    stateName === InteractionStateName.HOVER
      ? interaction.getHoverHighlight()
      : interaction.getSelectedCellHighlight();

  if (rowHeader && rowId) {
    updateAllHeaderCellState(
      rowId,
      (facet as PivotChartFacet).getAxisRowCells(),
      stateName,
    );
  }
}

function updateDataCellRelevantAxisColCells(
  stateName: InteractionStateName,
  meta: ViewMeta,
  spreadsheet: SpreadSheet,
) {
  const { colId } = meta;
  const { facet, interaction } = spreadsheet;
  const { colHeader } =
    stateName === InteractionStateName.HOVER
      ? interaction.getHoverHighlight()
      : interaction.getSelectedCellHighlight();

  if (colHeader && colId) {
    updateAllHeaderCellState(
      colId,
      (facet as PivotChartFacet).getAxisColCells(),
      stateName,
    );
  }
}

export function updateDataCellRelevantHeaderCells(
  stateName: InteractionStateName,
  meta: ViewMeta,
  spreadsheet: SpreadSheet,
) {
  updateDataCellRelevantAxisRowCells(stateName, meta, spreadsheet);
  updateDataCellRelevantAxisColCells(stateName, meta, spreadsheet);
}
