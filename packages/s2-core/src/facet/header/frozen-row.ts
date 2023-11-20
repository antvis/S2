import type { Node } from '../layout/node';
import { FrozenRowCell, RowCell } from '../../cell';
import { BaseFrozenRowHeader } from './base-frozen-row';

export class FrozenRowHeader extends BaseFrozenRowHeader {
  // To avoid the "performance impact" of traverse the data to adjust the y-coordinate, we can correct the y-coordinate to determine if a cell is within the visible viewport.
  protected rowCellInRectYDir(item: Node): boolean {
    const { viewportHeight, scrollY } = this.headerConfig;
    const itemY = item.y - this.getFrozenRowHeight();
    return viewportHeight + scrollY > itemY && scrollY < itemY + item.height;
  }

  protected onItemReady(item: Node): Node {
    if (!this.isFrozenRow(item)) {
      // relative to scroll group position, scroll group position translateY frozenHeight
      return Object.assign({}, item, { y: item.y - this.getFrozenRowHeight() });
    }
    return item;
  }

  protected createCellInstance(item: Node): RowCell {
    const { spreadsheet } = this.headerConfig;
    if (this.isFrozenRow(item)) {
      return new RowCell(item, spreadsheet, {
        ...this.headerConfig,
        // prevent the text in the frozen header row from having a sticky effect.
        scrollY: 0,
      });
    }
    return new FrozenRowCell(
      item,
      spreadsheet,
      this.headerConfig,
      this.getFrozenRowHeight(),
    );
  }
}
