import type { IGroup } from '@antv/g-canvas';
import { Group } from '@antv/g-canvas';
import { KEY_GROUP_GRID_GROUP } from '../common/constant';
import type { GridInfo } from '../common/interface';
import type { SpreadSheet } from '../sheet-type/spread-sheet';
import { renderLine } from '../utils/g-renders';

export class GridGroup extends Group {
  private s2: SpreadSheet;

  constructor(cfg) {
    super(cfg);
    this.s2 = cfg.s2;
  }

  private gridGroup: IGroup;

  private gridInfo: GridInfo = {
    cols: [],
    rows: [],
  };

  public updateGrid = (gridInfo: GridInfo, id = KEY_GROUP_GRID_GROUP) => {
    const bbox = this.getBBox();
    const style = this.s2.theme.dataCell.cell;

    if (!this.gridGroup || !this.findById(id)) {
      this.gridGroup = this.addGroup({
        id,
      });
    }

    this.gridGroup.clear();

    this.gridInfo = gridInfo;
    this.gridInfo.cols.forEach((item) => {
      const x = item - style.verticalBorderWidth / 2;
      renderLine(
        this.gridGroup as Group,
        {
          x1: x,
          x2: x,
          y1: Math.ceil(bbox.minY),
          y2: Math.floor(bbox.maxY),
        },
        {
          stroke: style.verticalBorderColor,
          strokeOpacity: style.verticalBorderColorOpacity,
          lineWidth: style.verticalBorderWidth,
        },
      );
    });

    this.gridInfo.rows.forEach((item) => {
      const y = item - style.horizontalBorderWidth / 2;
      renderLine(
        this.gridGroup as Group,
        {
          x1: Math.ceil(bbox.minX),
          x2: Math.floor(bbox.maxX),
          y1: y,
          y2: y,
        },
        {
          stroke: style.horizontalBorderColor,
          strokeOpacity: style.horizontalBorderColorOpacity,
          lineWidth: style.horizontalBorderWidth,
        },
      );
    });
    this.gridGroup.toFront();
  };
}
