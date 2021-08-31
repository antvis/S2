import { first, map, includes } from 'lodash';
import { includeCell } from '@/utils/data-cell';
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
    if (includeCell(cells, this)) {
      this.updateByState(InteractionStateName.HOVER, this);
    }
  }

  private handleSelect(cells: S2CellType[], nodes: Node[]) {
    if (includeCell(cells, this)) {
      this.updateByState(InteractionStateName.SELECTED, this);
    }
    const selectedNodeIds = map(nodes, 'id');
    if (includes(selectedNodeIds, this.meta.id)) {
      this.updateByState(InteractionStateName.SELECTED, this);
    }
  }

  public update() {
    const stateInfo = this.spreadsheet.interaction.getState();
    const cells = this.spreadsheet.interaction.getActiveCells();

    if (!first(cells)) return;

    switch (stateInfo?.stateName) {
      case InteractionStateName.SELECTED:
        this.handleSelect(cells, stateInfo?.nodes);
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
