/**
 * export common methods on spreadsheet.tool
 */
import { SpreadSheet } from '@/sheet-type';
import { mergeCells, unmergeCell } from '@/utils/interaction/merge-cells';
import { MergedCellInfo } from '@/common/interface';
import { MergedCells } from '@/cell';
import { hideColumnsByThunkGroup } from '@/utils/hide-columns';

export class Tool {
  private readonly spreadsheet: SpreadSheet;

  constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
  }

  public mergeCells = (cellsInfo?: MergedCellInfo[], hideData?: boolean) => {
    mergeCells(this.spreadsheet, cellsInfo, hideData);
  };

  public unmergeCell = (removedCells: MergedCells) => {
    unmergeCell(this.spreadsheet, removedCells);
  };

  public hideColumns(hiddenColumnFields: string[] = []) {
    hideColumnsByThunkGroup(this.spreadsheet, hiddenColumnFields);
  }
}
