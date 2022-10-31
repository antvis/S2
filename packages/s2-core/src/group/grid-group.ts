import type { IGroup } from '@antv/g-canvas';
import { Group } from '@antv/g-canvas';
import { KEY_GROUP_GRID_GROUP, SQUARE_LINE_CAP } from '../common/constant';
import type { GridInfo } from '../common/interface';
import type { SpreadSheet } from '../sheet-type/spread-sheet';
import { renderLine } from '../utils/g-renders';

export class GridGroup extends Group {
  protected s2: SpreadSheet;

  constructor(cfg) {
    super(cfg);
    this.s2 = cfg.s2;
  }

  protected gridGroup: IGroup;

  protected gridInfo: GridInfo = {
    cols: [],
    rows: [],
  };

  public updateGrid = (gridInfo: GridInfo, id = KEY_GROUP_GRID_GROUP) => {
    const bbox = this.getBBox();
    const { theme } = this.s2;

    const style = theme.dataCell.cell;

    if (!this.gridGroup || !this.findById(id)) {
      this.gridGroup = this.addGroup({
        id,
      });
    }

    this.gridGroup.clear();

    const verticalBorderWidth = style.verticalBorderWidth;

    this.gridInfo = gridInfo;

    // line 在绘制时，包围盒计算有点问题，会带入lineWidth
    // 比如传入的 x1=0, x2=10, lineWidth=20
    // 最后line得出来的包围盒 minX=-10, maxX=20，会将lineWidth/2纳入计算中
    // 最后就会导致更新过程中，GridGroup的包围盒不断被放大
    // 因此在传入时，将这部分坐标减去，并结合lineCap将这部分绘制出来，达到内容区域绘制不变，包围盒计算正确的目的
    const halfVerticalBorderWidthBorderWidth = verticalBorderWidth / 2;
    this.gridInfo.cols.forEach((x) => {
      renderLine(
        this.gridGroup as Group,
        {
          x1: x - halfVerticalBorderWidthBorderWidth,
          x2: x - halfVerticalBorderWidthBorderWidth,
          y1: Math.ceil(bbox.minY + halfVerticalBorderWidthBorderWidth),
          y2: Math.floor(bbox.maxY - halfVerticalBorderWidthBorderWidth),
        },
        {
          stroke: style.verticalBorderColor,
          strokeOpacity: style.verticalBorderColorOpacity,
          lineWidth: verticalBorderWidth,
          lineCap: SQUARE_LINE_CAP,
        },
      );
    });

    const horizontalBorderWidth = style.horizontalBorderWidth;
    const halfHorizontalBorderWidth = horizontalBorderWidth / 2;
    this.gridInfo.rows.forEach((y) => {
      renderLine(
        this.gridGroup as Group,
        {
          x1: Math.ceil(bbox.minX + halfHorizontalBorderWidth),
          x2: Math.floor(bbox.maxX - halfHorizontalBorderWidth),
          y1: y - halfHorizontalBorderWidth,
          y2: y - halfHorizontalBorderWidth,
        },
        {
          stroke: style.horizontalBorderColor,
          strokeOpacity: style.horizontalBorderColorOpacity,
          lineWidth: horizontalBorderWidth,
          lineCap: SQUARE_LINE_CAP,
        },
      );
    });

    this.gridGroup.toFront();
  };
}
