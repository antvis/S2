import { Group } from '@antv/g';
import {
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  FRONT_GROUND_GROUP_SCROLL_Z_INDEX,
  FrozenFacet,
  Node,
  RowHeader,
} from '@antv/s2';
import { AxisRowCell } from '../cell/axis-row-cell';
import {
  KEY_GROUP_ROW_AXIS_FROZEN,
  KEY_GROUP_ROW_AXIS_SCROLL,
} from '../constant';
import { getExtraFrozenRowAxisNodes } from '../utils/frozen';

export class AxisRowHeader extends RowHeader {
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

    const { spreadsheet, nodes } = this.getHeaderConfig();

    this.extraFrozenNodes = getExtraFrozenRowAxisNodes(
      spreadsheet.facet as FrozenFacet,
      nodes,
    );
  }

  public getCellInstance(node: Node): any {
    const headerConfig = this.getHeaderConfig();

    const { spreadsheet } = headerConfig;
    const { axisRowCell: rowAxisCell } = spreadsheet.options;

    return (
      rowAxisCell?.(node, spreadsheet, headerConfig) ||
      new AxisRowCell(node, spreadsheet, headerConfig)
    );
  }
}
