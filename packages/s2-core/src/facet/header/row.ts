import { GM } from '@antv/g-gesture';
import { each, isEmpty } from 'lodash';
import { RowCell } from '../../cell';
import { translateGroup } from '../utils';
import { S2CellType, S2Options } from '../../common/interface';
import { BaseHeader, BaseHeaderConfig } from './base';
import { Node } from '@/facet/layout/node';

export interface RowHeaderConfig extends BaseHeaderConfig {
  // type of hierarchy
  hierarchyType: S2Options['hierarchyType'];
  // field ids that click to navigate
  linkFields: string[];
  // series number group's width, will be 0 when not exists
  seriesNumberWidth: number;
}

/**
 * Row Header for SpreadSheet
 */
export class RowHeader extends BaseHeader<RowHeaderConfig> {
  // mobile event
  private gm: GM;

  constructor(cfg: RowHeaderConfig) {
    super(cfg);
  }

  public destroy() {
    super.destroy();
    if (this.gm) {
      this.gm.destroy();
    }
  }

  protected layout() {
    const {
      data,
      spreadsheet,
      width,
      viewportHeight,
      seriesNumberWidth,
      scrollY,
      scrollX,
    } = this.headerConfig;

    const rowCell = spreadsheet?.facet?.cfg?.rowCell;
    // row'cell only show when visible
    const rowCellInRect = (item: Node): boolean => {
      return (
        viewportHeight + scrollY > item.y && // bottom
        scrollY < item.y + item.height && // top
        width - seriesNumberWidth + scrollX > item.x && // left
        scrollX - seriesNumberWidth < item.x + item.width
      ); // right
    };
    each(data, (item: Node) => {
      if (rowCellInRect(item) && item.height !== 0) {
        let cell: S2CellType;
        // 首先由外部控制UI展示
        if (rowCell) {
          cell = rowCell(item, spreadsheet, this.headerConfig);
        }
        // 如果外部没处理，就用默认的
        if (isEmpty(cell)) {
          if (spreadsheet.isPivotMode()) {
            cell = new RowCell(item, spreadsheet, this.headerConfig);
          }
        }
        item.belongsCell = cell;
        this.add(cell);
      }
    });
  }

  protected offset() {
    const { scrollX, scrollY, position, seriesNumberWidth } = this.headerConfig;
    // 向右多移动的seriesNumberWidth是序号的宽度
    translateGroup(
      this,
      position.x - scrollX + seriesNumberWidth,
      position.y - scrollY,
    );
  }

  protected clip(): void {
    const { width, viewportHeight, scrollX, scrollY, seriesNumberWidth } =
      this.headerConfig;
    this.setClip({
      type: 'rect',
      attrs: {
        // 由于多移动了seriesNumberWidth跨度，所有需要向左切。 - 是反向剪裁（右 -> 左）
        x: scrollX - seriesNumberWidth,
        y: scrollY,
        width,
        height: viewportHeight,
      },
    });
  }
}
