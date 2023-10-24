import { Rect } from '@antv/g';
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
  constructor(cfg: RowHeaderConfig) {
    super(cfg);
  }

  protected getCellInstance(node: Node): S2CellType {
    const { spreadsheet } = node;
    const { rowCell } = spreadsheet.options;

    return (
      rowCell?.(node, spreadsheet, this.headerConfig) ||
      new RowCell(node, spreadsheet, this.headerConfig)
    );
  }

  protected layout() {
    const {
      nodes,
      spreadsheet,
      width,
      viewportHeight,
      scrollY = 0,
      scrollX = 0,
      position,
    } = this.headerConfig;

    const rowCell = spreadsheet?.options?.rowCell;
    // row'cell only show when visible
    const rowCellInRect = (node: Node): boolean => {
      return (
        // bottom
        viewportHeight + scrollY > node.y &&
        // top
        scrollY < node.y + node.height &&
        // left
        width - position.x + scrollX > node.x &&
        // right
        scrollX - position.x < node.x + node.width
      );
    };

    each(nodes, (node) => {
      if (rowCellInRect(node) && node.height !== 0) {
        let cell: S2CellType | null = null;

        // 首先由外部控制UI展示
        if (rowCell) {
          cell = rowCell(node, spreadsheet, this.headerConfig);
        }

        // 如果外部没处理，就用默认的
        if (isEmpty(cell) && spreadsheet.isPivotMode()) {
          cell = new RowCell(node, spreadsheet, this.headerConfig);
        }

        node.belongsCell = cell;

        if (cell) {
          this.appendChild(cell);
        }
      }
    });
  }

  protected offset() {
    const { scrollX = 0, scrollY = 0, position } = this.headerConfig;

    // 向右多移动的 seriesNumberWidth 是序号的宽度
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
