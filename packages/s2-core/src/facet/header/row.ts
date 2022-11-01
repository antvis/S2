import type { GM } from '@antv/g-gesture';
import { each, isEmpty } from 'lodash';
import { RowCell } from '../../cell';
import type { S2CellType } from '../../common/interface';
import type { Node } from '../layout/node';
import { translateGroup } from '../utils';
import { BaseHeader } from './base';
import type { RowHeaderConfig } from './interface';

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
      scrollY = 0,
      scrollX = 0,
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
        let cell: S2CellType | null = null;
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
        this.add(cell as S2CellType);
      }
    });
  }

  protected offset() {
    const {
      scrollX = 0,
      scrollY = 0,
      position,
      seriesNumberWidth,
    } = this.headerConfig;
    // 向右多移动的seriesNumberWidth是序号的宽度
    translateGroup(
      this,
      position.x - scrollX + seriesNumberWidth,
      position.y - scrollY,
    );
  }

  protected clip(): void {
    const {
      width,
      viewportHeight,
      scrollX = 0,
      scrollY = 0,
      seriesNumberWidth,
    } = this.headerConfig;

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
