import { Group } from '@antv/g';
import {
  ColHeader,
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  FRONT_GROUND_GROUP_SCROLL_Z_INDEX,
  FrozenFacet,
  Node,
  getFrozenColOffset,
  getFrozenTrailingColOffset,
  translateGroup,
} from '@antv/s2';
import { ColAxisCell } from '../cell/col-axis-cell';
import {
  KEY_GROUP_COL_AXIS_FROZEN,
  KEY_GROUP_COL_AXIS_SCROLL,
} from '../constant';

export class ColAxisHeader extends ColHeader {
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

    // const { spreadsheet } = this.getHeaderConfig();

    this.extraFrozenNodes = [];
  }

  public getCellInstance(node: Node): any {
    const headerConfig = this.getHeaderConfig();

    const { spreadsheet } = headerConfig;
    const { colAxisCell } = spreadsheet.options;

    return (
      colAxisCell?.(node, spreadsheet, headerConfig) ||
      new ColAxisCell(node, spreadsheet, headerConfig)
    );
  }

  // row'cell only show when visible
  protected isCellInRect(): boolean {
    return true;
  }

  protected clip(): void {}

  protected offset() {
    const {
      viewportWidth,
      scrollX = 0,
      position,
      spreadsheet,
      cornerWidth,
    } = this.getHeaderConfig();

    translateGroup(this.scrollGroup, position.x - scrollX, position.y);

    const facet = spreadsheet.facet as FrozenFacet;
    const colOffset = getFrozenColOffset(facet, cornerWidth, scrollX);

    const trailingColOffset = getFrozenTrailingColOffset(facet, viewportWidth);

    translateGroup(this.frozenGroup, position.x - colOffset, position.y);
    translateGroup(
      this.frozenTrailingGroup,
      position.x - trailingColOffset,
      position.y,
    );
  }
}
