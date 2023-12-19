import { Rect } from '@antv/g';
import { each, isEmpty } from 'lodash';
import type { IGroup } from '@antv/g-canvas';
import { RowCell } from '../../cell';
import type { Node } from '../layout/node';
import { translateGroup } from '../utils';
import { S2Event } from '../../common';
import { BaseHeader } from './base';
import type { RowHeaderConfig } from './interface';

/**
 * Row Header for SpreadSheet
 */
export class RowHeader extends BaseHeader<RowHeaderConfig> {
  constructor(config: RowHeaderConfig) {
    super(config);
  }

  protected getCellInstance(node: Node): RowCell {
    const headerConfig = this.getHeaderConfig();
    const { spreadsheet } = headerConfig;
    const { rowCell } = spreadsheet.options;

    return (
      rowCell?.(node, spreadsheet, headerConfig) ||
      new RowCell(node, spreadsheet, headerConfig)
    );
  }

    // row'cell only show when visible
  protected rowCellInRect(item: Node): boolean {
    const { width, viewportHeight, seriesNumberWidth, scrollY = 0, scrollX = 0 } =
      this.getHeaderConfig();

    return (
      viewportHeight + scrollY > item.y && // bottom
      scrollY < item.y + item.height && // top
      width - seriesNumberWidth + scrollX > item.x && // left
      scrollX - seriesNumberWidth < item.x + item.width
    ); // right
  }

  protected getCellGroup(node: Node): IGroup {
    return this;
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
    } = this.getHeaderConfig();

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
        let cell: RowCell | null = null;

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
          spreadsheet.emit(S2Event.ROW_CELL_RENDER, cell);
          spreadsheet.emit(S2Event.LAYOUT_CELL_RENDER, cell);
        }
      }
    });
  }

  protected offset() {
    const { scrollX = 0, scrollY = 0, position } = this.getHeaderConfig();

    // 向右多移动的 seriesNumberWidth 是序号的宽度
    translateGroup(this, position.x - scrollX, position.y - scrollY);
  }

  protected clip(): void {
    const { width, height, viewportHeight } = this.getHeaderConfig();

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
