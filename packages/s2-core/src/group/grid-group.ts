import { Group, Line } from '@antv/g';
import { last } from 'lodash';
import {
  KEY_GROUP_GRID_GROUP,
  PANEL_GRID_GROUP_Z_INDEX,
} from '../common/constant';
import type { GridInfo } from '../common/interface';
import type { GridGroupConstructorParameters } from '../common/interface/group';
import type { SpreadSheet } from '../sheet-type/spread-sheet';
import { batchSetStyle, renderLine } from '../utils/g-renders';

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
    }

    const width = last(gridInfo.cols) ?? 0;
    const height = last(gridInfo.rows) ?? 0;
    const { theme } = this.s2;
    const style = theme.dataCell!.cell;

    const verticalBorderWidth = style?.verticalBorderWidth ?? 1;
    const halfVerticalBorderWidth = verticalBorderWidth / 2;
    const verticalBorderStyle = {
      stroke: style!.verticalBorderColor,
      strokeOpacity: style!.verticalBorderColorOpacity,
      lineWidth: verticalBorderWidth,
    };

    const horizontalBorderWidth = style?.horizontalBorderWidth ?? 1;
    const halfHorizontalBorderWidth = horizontalBorderWidth / 2;
    const horizontalBorderStyle = {
      stroke: style!.horizontalBorderColor,
      strokeOpacity: style!.horizontalBorderColorOpacity,
      lineWidth: horizontalBorderWidth,
    };

    const children = this.gridGroup.children as Line[];
    let childIndex = 0;

    // 复用或新增垂直线
    gridInfo.cols.forEach((x) => {
      const attrs = {
        x1: x - halfVerticalBorderWidth,
        x2: x - halfVerticalBorderWidth,
        y1: 0,
        y2: height,
        ...verticalBorderStyle,
      };

      if (childIndex < children.length) {
        // 复用已有的 Line 对象
        batchSetStyle(children[childIndex], attrs);
      } else {
        // 创建新的 Line 对象
        renderLine(this.gridGroup, attrs);
      }

      childIndex++;
    });

    // 复用或新增水平线
    gridInfo.rows.forEach((y) => {
      const attrs = {
        x1: 0,
        x2: width,
        y1: -halfHorizontalBorderWidth,
        y2: -halfHorizontalBorderWidth,
        transform: `translate(0, ${y})`,
        ...horizontalBorderStyle,
      };

      if (childIndex < children.length) {
        // 复用已有的 Line 对象
        batchSetStyle(children[childIndex], attrs);
      } else {
        // 创建新的 Line 对象
        renderLine(this.gridGroup, attrs);
      }

      childIndex++;
    });

    // 移除多余的 Line 对象
    const requiredCount = childIndex;
    const currentCount = children.length;

    if (requiredCount < currentCount) {
      // 从后往前删除，避免在循环中改变数组长度导致索引错乱
      for (let i = currentCount - 1; i >= requiredCount; i--) {
        children[i].destroy();
      }
    }

    // 更新 gridInfo 供下次使用
    this.gridInfo = gridInfo;
  };
}
