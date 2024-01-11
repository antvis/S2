import { Group } from '@antv/g';
import { last } from 'lodash';
import {
  KEY_GROUP_GRID_GROUP,
  PANEL_GRID_GROUP_Z_INDEX,
} from '../common/constant';
import type { GridInfo } from '../common/interface';
import type { GridGroupConstructorParameters } from '../common/interface/group';
import type { SpreadSheet } from '../sheet-type/spread-sheet';
import { renderLine } from '../utils/g-renders';

export class GridGroup extends Group {
  protected s2: SpreadSheet;

  constructor(cfg: GridGroupConstructorParameters) {
    const { name, s2, ...rest } = cfg;

    super({
      name,
      style: rest,
    });
    this.s2 = s2;
  }

  protected gridGroup: Group;

  protected gridInfo: GridInfo = {
    cols: [],
    rows: [],
  };

  public updateGrid = (gridInfo: GridInfo, id = KEY_GROUP_GRID_GROUP) => {
    if (!this.gridGroup || !this.getElementById(id)) {
      this.gridGroup = this.appendChild(
        new Group({
          id,
          style: {
            zIndex: PANEL_GRID_GROUP_Z_INDEX,
          },
        }),
      );
    } else {
      this.gridGroup.removeChildren();
    }

    const width = last(gridInfo.cols) ?? 0;
    const height = last(gridInfo.rows) ?? 0;
    const { theme } = this.s2;

    const style = theme.dataCell!.cell;

    const verticalBorderWidth = style?.verticalBorderWidth;

    this.gridInfo = gridInfo;
    const halfVerticalBorderWidthBorderWidth = verticalBorderWidth! / 2;

    this.gridInfo.cols.forEach((x) => {
      renderLine(this.gridGroup, {
        x1: x - halfVerticalBorderWidthBorderWidth,
        x2: x - halfVerticalBorderWidthBorderWidth,
        y1: 0,
        y2: height,
        stroke: style!.verticalBorderColor,
        strokeOpacity: style!.verticalBorderColorOpacity,
        lineWidth: verticalBorderWidth,
      });
    });

    const horizontalBorderWidth = style?.horizontalBorderWidth;
    const halfHorizontalBorderWidth = horizontalBorderWidth! / 2;

    this.gridInfo.rows.forEach((y) => {
      renderLine(this.gridGroup, {
        x1: 0,
        x2: width,
        y1: y - halfHorizontalBorderWidth,
        y2: y - halfHorizontalBorderWidth,
        stroke: style!.horizontalBorderColor,
        strokeOpacity: style!.horizontalBorderColorOpacity,
        lineWidth: horizontalBorderWidth,
      });
    });
  };
}
