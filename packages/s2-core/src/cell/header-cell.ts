import { first } from 'lodash';
import { isIncludeCell } from '@/utils/data-cell';
import { S2CellType, ViewMeta } from '@/common/interface';
import { BaseHeaderConfig } from '@/facet/header/base';
import { BaseCell } from '@/cell';
import { CellTypes, InteractionStateName, SpreadSheet } from '../index';

export abstract class HeaderCell extends BaseCell<ViewMeta> {
  protected headerConfig: BaseHeaderConfig;

  constructor(
    meta: ViewMeta,
    spreadsheet: SpreadSheet,
    headerConfig: BaseHeaderConfig,
  ) {
    super(meta, spreadsheet, headerConfig);
  }

  protected handleRestOptions(...[headerConfig]: [BaseHeaderConfig]) {
    this.headerConfig = headerConfig;
  }

  private  handleHover(currentCell: S2CellType, cells: S2CellType[]) {
    if (isIncludeCell(cells, this?.meta)) {
      this.updateByState(InteractionStateName.HOVER);
    }
  }

  private  handleSelect(cells: S2CellType[]) {
    if (isIncludeCell(cells, this?.meta)) {
      this.updateByState(InteractionStateName.SELECTED);
    }
  }

  public update() {
    const stateName = this.spreadsheet.interaction.getCurrentStateName();
    const cells = this.spreadsheet.interaction.getActiveCells();
    const currentCell = first(cells);
    if (
      !currentCell 
    ) {
      return;
    }
    
    switch (stateName) {
      case InteractionStateName.SELECTED:
        this.handleSelect(cells);
        break;
      case InteractionStateName.HOVER_FOCUS:
      case InteractionStateName.HOVER:
        this.handleHover(currentCell, cells);
        break;
      default:
        break;
    }
 
   
  }
}
