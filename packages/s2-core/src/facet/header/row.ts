import { Rect } from '@antv/g';
import { each, isEmpty } from 'lodash';
import { RowCell } from '../../cell/row-cell';
import type { S2CellType } from '../../common/interface';
import type { Node } from '../layout/node';
import { translateGroup } from '../utils';
import { BaseHeader } from './base';
import type { RowHeaderConfig } from './interface';

/**
 * Row Header for SpreadSheet
 */
export class RowHeader extends BaseHeader<RowHeaderConfig> {
  constructor(cfg: RowHeaderConfig) {
    super(cfg);
  }

  protected layout() {
    const {
      data,
      spreadsheet,
      width,
      viewportHeight,
      scrollY = 0,
      scrollX = 0,
      position,
    } = this.headerConfig;

    const rowCell = spreadsheet?.options?.rowCell;
    // row'cell only show when visible
    const rowCellInRect = (item: Node): boolean =>
      // bottom
      viewportHeight + scrollY > item.y &&
      // top
      scrollY < item.y + item.height &&
      // left
      width - position.x + scrollX > item.x &&
      // right
      scrollX - position.x < item.x + item.width;

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

        if (cell) {
          this.appendChild(cell);
        }
      }
    });
  }

  protected offset() {
    const { scrollX = 0, scrollY = 0, position } = this.headerConfig;

    // 向右多移动的seriesNumberWidth是序号的宽度
    translateGroup(this, position.x - scrollX, position.y - scrollY);
  }

  protected clip(): void {
    const { width, height, viewportHeight } = this.headerConfig;

    this.style.clipPath = new Rect({
      style: {
        x: 0,
        y: 0,
        width,
        height: height + viewportHeight,
      },
    });
  }
}
