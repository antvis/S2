import { Group } from '@antv/g';
import type { GridInfo } from '../common/interface';
import type { GridGroupConstructorParameters } from '../common/interface/group';
import { updateMergedCells } from '../utils/interaction/merge-cell';
import type { MergedCell } from './../cell/merged-cell';
import { KEY_GROUP_MERGED_CELLS } from './../common/constant/basic';
import { GridGroup } from './grid-group';

export class PanelScrollGroup extends GridGroup {
  protected mergedCellsGroup: Group;

  constructor(cfg: GridGroupConstructorParameters) {
    super(cfg);
    this.initMergedCellsGroup();
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

  addMergeCell(mergeCell: MergedCell) {
    this.mergedCellsGroup?.appendChild(mergeCell);
  }

  update(gridInfo: GridInfo) {
    this.updateGrid(gridInfo);
    this.updateMergedCells();
  }
}
