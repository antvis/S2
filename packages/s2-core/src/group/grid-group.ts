import type { IGroup } from '@antv/g-canvas';
import { Group } from '@antv/g-canvas';
import {
  KEY_GROUP_GRID_GROUP,
  KEY_GROUP_PANEL_FROZEN_COL,
  SQUARE_LINE_CAP,
} from '../common/constant';
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
    const { theme, isTableMode } = this.s2;

    const style = theme.dataCell.cell;
    // 在明细表中需要补全左侧的边框，分为两种情况：
    // 1. 存在行头冻结，需要为冻结的行头组添加边框
    // 2. 不存在行头冻结，需要为默认的 Grid 组添加边框
    const shouldDrawLeftBorder =
      isTableMode() &&
      (id === KEY_GROUP_GRID_GROUP || id === KEY_GROUP_PANEL_FROZEN_COL);

    if (!this.gridGroup || !this.findById(id)) {
      this.gridGroup = this.addGroup({
        id,
      });
    }

    this.gridGroup.clear();

    this.gridInfo = gridInfo;
    if (shouldDrawLeftBorder) {
      this.gridInfo.cols.unshift(0);
    }

    // line 在绘制时，包围盒计算有点问题，会代入lineWidth
    // 比如传入的 x1=0, x2=10, lineWidth=20
    // 最后line得出来的包围盒 minX=-10, maxX=20，会将lineWidth/2纳入计算中
    // 最后就会导致更新过程中，GridGroup的包围盒不断被放大
    // 因此在传入时，将这部分坐标减去，并结合lineCap将这部分绘制出来，达到内容区域绘制不变，包围盒计算正确的目的
    const verticalBorderWidth = style.verticalBorderWidth;
    const halfVerticalBorderWidthBorderWidth = style.verticalBorderWidth / 2;
    this.gridInfo.cols.forEach((x) => {
      renderLine(
        this.gridGroup as Group,
        {
          x1: x,
          x2: x,
          y1: Math.ceil(bbox.minY + halfVerticalBorderWidthBorderWidth),
          y2: Math.floor(bbox.maxY - halfVerticalBorderWidthBorderWidth),
        },
        {
          stroke: style.verticalBorderColor,
          strokeOpacity: style.verticalBorderColorOpacity,
          lineWidth: verticalBorderWidth,
          lineCap: SQUARE_LINE_CAP,
          lineDash: style.borderDash,
        },
      );
    });

    const horizontalBorderWidth = style.horizontalBorderWidth;
    const halfHorizontalBorderWidth = style.horizontalBorderWidth / 2;
    this.gridInfo.rows.forEach((y) => {
      renderLine(
        this.gridGroup as Group,
        {
          x1: Math.ceil(bbox.minX + halfHorizontalBorderWidth),
          x2: Math.floor(bbox.maxX - halfHorizontalBorderWidth),
          y1: y,
          y2: y,
        },
        {
          stroke: style.horizontalBorderColor,
          strokeOpacity: style.horizontalBorderColorOpacity,
          lineWidth: horizontalBorderWidth,
          lineCap: SQUARE_LINE_CAP,
          lineDash: style.borderDash,
        },
      );
    });

    this.gridGroup.toFront();
  };
}
