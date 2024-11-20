import { Group } from '@antv/g';
import {
  ColHeader,
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  FRONT_GROUND_GROUP_SCROLL_Z_INDEX,
  FrozenFacet,
  Node,
} from '@antv/s2';
import { AxisColCell } from '../cell/axis-col-cell';
import {
  KEY_GROUP_COL_AXIS_FROZEN,
  KEY_GROUP_COL_AXIS_SCROLL,
} from '../constant';
import { getExtraFrozenColAxisNodes } from '../utils/frozen';

export class AxisColHeader extends ColHeader {
  protected initGroups(): void {
    this.scrollGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_COL_AXIS_SCROLL,
        style: { zIndex: FRONT_GROUND_GROUP_SCROLL_Z_INDEX },
      }),
    );

    this.frozenGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_COL_AXIS_FROZEN,
        style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
      }),
    );
    this.frozenTrailingGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_COL_AXIS_FROZEN,
        style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
      }),
    );

    const { spreadsheet, nodes } = this.getHeaderConfig();

    this.extraFrozenNodes = getExtraFrozenColAxisNodes(
      spreadsheet.facet as FrozenFacet,
      nodes,
    );
  }

  public getCellInstance(node: Node): any {
    const headerConfig = this.getHeaderConfig();

    const { spreadsheet } = headerConfig;
    const { axisColCell: colAxisCell } = spreadsheet.options;

    return (
      colAxisCell?.(node, spreadsheet, headerConfig) ||
      new AxisColCell(node, spreadsheet, headerConfig)
    );
  }
}
