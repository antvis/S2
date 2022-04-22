import { SpreadSheet } from 'src/sheet-type/spread-sheet';
import type { IGroup } from '@antv/g-canvas';
import { Group } from '@antv/g-canvas';
import { renderLine } from 'src/utils/g-renders';
import { GridInfo } from 'src/common/interface';

export class GridGroup extends Group {
  private ss: SpreadSheet;

  constructor(cfg) {
    super(cfg);
    this.ss = cfg.ss;
  }

  private gridGroup: IGroup;

  private gridInfo: GridInfo = {
    cols: [],
    rows: [],
  };

  public updateGrid = (gridInfo: GridInfo, id = 'foobar') => {
    const bbox = this.getBBox();
    const style = this.ss.theme.dataCell.cell;

    if (!this.gridGroup || !this.findById(id)) {
      this.gridGroup = this.addGroup({
        id,
      });
    }

    this.gridGroup.clear();

    this.gridInfo = gridInfo;
    this.gridInfo.cols.forEach((item) => {
      renderLine(
        this.gridGroup as Group,
        {
          x1: item - style.verticalBorderWidth / 2,
          x2: item - style.verticalBorderWidth / 2,
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
      renderLine(
        this.gridGroup as Group,
        {
          x1: Math.ceil(bbox.minX),
          x2: Math.floor(bbox.maxX),
          y1: item - style.verticalBorderWidth / 2,
          y2: item - style.verticalBorderWidth / 2,
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
