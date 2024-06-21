import { Group } from '@antv/g';
import {
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  FRONT_GROUND_GROUP_SCROLL_Z_INDEX,
  Node,
  RowHeader,
} from '@antv/s2';
import { RowAxisCell } from '../cell/row-axis-cell';
import {
  KEY_GROUP_ROW_AXIS_FROZEN,
  KEY_GROUP_ROW_AXIS_SCROLL,
} from '../constant';

export class RowAxisHeader extends RowHeader {
  protected initGroups(): void {
    this.scrollGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_ROW_AXIS_SCROLL,
        style: { zIndex: FRONT_GROUND_GROUP_SCROLL_Z_INDEX },
      }),
    );

    this.frozenGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_ROW_AXIS_FROZEN,
        style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
      }),
    );
    this.frozenTrailingGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_ROW_AXIS_FROZEN,
        style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
      }),
    );

    // const { spreadsheet } = this.getHeaderConfig();

    this.extraFrozenNodes = [];
  }

  public getCellInstance(node: Node): any {
    const headerConfig = this.getHeaderConfig();

    const { spreadsheet } = headerConfig;
    const { rowAxisCell } = spreadsheet.options;

    return (
      rowAxisCell?.(node, spreadsheet, headerConfig) ||
      new RowAxisCell(node, spreadsheet, headerConfig)
    );
  }

  // row'cell only show when visible
  protected isCellInRect(): boolean {
    return true;
  }
}
