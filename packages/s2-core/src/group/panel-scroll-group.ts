import { Group } from '@antv/g';
import type { GridInfo } from '../common/interface';
import type { GridGroupConstructorParameters } from '../common/interface/group';
import { updateMergedCells } from '../utils/interaction/merge-cell';
import { S2Event } from '../common';
import type { MergedCell } from './../cell/merged-cell';
import { KEY_GROUP_MERGED_CELLS } from './../common/constant/basic';
import { GridGroup } from './grid-group';

export class PanelScrollGroup extends GridGroup {
  protected mergedCellsGroup: Group;

  constructor(cfg: GridGroupConstructorParameters) {
    super(cfg);
    this.initMergedCellsGroup();
  }

  getMergedCellsGroup() {
    return this.mergedCellsGroup;
  }

  protected initMergedCellsGroup() {
    if (this.mergedCellsGroup && this.getElementById(KEY_GROUP_MERGED_CELLS)) {
      return;
    }

    this.mergedCellsGroup = this.appendChild(
      new Group({
        id: KEY_GROUP_MERGED_CELLS,
      }),
    );
  }

  updateMergedCells() {
    this.initMergedCellsGroup();
    updateMergedCells(this.s2, this.mergedCellsGroup);
    this.mergedCellsGroup.toFront();
  }

  addMergeCell(mergedCell: MergedCell) {
    this.mergedCellsGroup?.appendChild(mergedCell);
    this.s2.emit(S2Event.MERGED_CELLS_RENDER, mergedCell);
    this.s2.emit(S2Event.LAYOUT_CELL_RENDER, mergedCell);
  }

  update(gridInfo: GridInfo) {
    this.updateGrid(gridInfo);
    this.updateMergedCells();
  }
}
