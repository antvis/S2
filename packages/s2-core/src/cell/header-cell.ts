import { first } from 'lodash';
import { isIncludeCell } from '@/utils/data-cell';
import { S2CellType } from '@/common/interface';
import { BaseHeaderConfig } from '@/facet/header/base';
import { Node } from '@/facet/layout/node';
import { BaseCell } from '@/cell';
import { InteractionStateName } from '../index';

export abstract class HeaderCell extends BaseCell<Node> {
  protected headerConfig: BaseHeaderConfig;

  protected handleRestOptions(...[headerConfig]: [BaseHeaderConfig]) {
    this.headerConfig = headerConfig;
  }

  private handleHover(cells: S2CellType[]) {
    if (isIncludeCell(cells, this.getMeta())) {
      this.updateByState(InteractionStateName.HOVER);
    }
  }

  private handleSelect(cells: S2CellType[]) {
    if (isIncludeCell(cells, this.getMeta())) {
      this.updateByState(InteractionStateName.SELECTED);
    }
  }

  public update() {
    const stateName = this.spreadsheet.interaction.getCurrentStateName();
    const cells = this.spreadsheet.interaction.getActiveCells();
    const currentCell = first(cells);
    if (!currentCell) {
      return;
    }

    switch (stateName) {
      case InteractionStateName.SELECTED:
        this.handleSelect(cells);
        break;
      case InteractionStateName.HOVER_FOCUS:
      case InteractionStateName.HOVER:
        this.handleHover(cells);
        break;
      default:
        break;
    }
  }
}
