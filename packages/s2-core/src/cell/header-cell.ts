import { BaseHeaderConfig } from '@/facet/header/base';
import { first } from 'lodash';
import { BaseCell } from 'src/cell';
import { CellTypes, InteractionStateName, Node, SpreadSheet } from '../index';

export abstract class HeaderCell extends BaseCell<Node> {
  protected headerConfig: BaseHeaderConfig;

  constructor(
    meta: Node,
    spreadsheet: SpreadSheet,
    headerConfig: BaseHeaderConfig,
  ) {
    super(meta, spreadsheet, headerConfig);
  }

  protected handleRestOptions(...[headerConfig]: [BaseHeaderConfig]) {
    this.headerConfig = headerConfig;
  }

  public update() {
    const stateName = this.spreadsheet.interaction.getCurrentStateName();
    const cells = this.spreadsheet.interaction.getActiveCells();
    const currentCell = first(cells);
    if (
      !currentCell ||
      (stateName !== InteractionStateName.HOVER &&
        stateName !== InteractionStateName.HOVER_FOCUS)
    ) {
      return;
    }
    if (currentCell?.cellType === CellTypes.DATA_CELL || cells.includes(this)) {
      this.updateByState(InteractionStateName.HOVER);
    }
  }
}
