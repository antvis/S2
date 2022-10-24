import { Group, Rect, type DisplayObject } from '@antv/g';
import { each } from 'lodash';
import { ColCell } from '../../cell';
import {
  FRONT_GROUND_GROUP_COL_SCROLL_Z_INDEX,
  KEY_GROUP_COL_SCROLL,
} from '../../common/constant';
import type { SpreadSheet } from '../../sheet-type';
import type { Node } from '../layout/node';
import { translateGroupX } from '../utils';
import { BaseHeader, type BaseHeaderConfig } from './base';

export interface ColHeaderConfig extends BaseHeaderConfig {
  // corner width used when scroll {@link ColHeader#onColScroll}
  cornerWidth?: number;
  scrollContainsRowHeader?: boolean;
}

/**
 * Column Header for SpreadSheet
 */
export class ColHeader extends BaseHeader<ColHeaderConfig> {
  protected scrollGroup: Group;

  protected background: DisplayObject;

  constructor(cfg: ColHeaderConfig) {
    super(cfg);
    this.scrollGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_COL_SCROLL,
        style: { zIndex: FRONT_GROUND_GROUP_COL_SCROLL_Z_INDEX },
      }),
    );
  }

  /**
   * Make colHeader scroll with hScrollBar
   * @param scrollX horizontal offset
   * @param cornerWidth only has real meaning when scroll contains rowCell
   * @param type
   */
  public onColScroll(scrollX: number, type: string) {
    if (this.headerConfig.scrollX !== scrollX) {
      this.headerConfig.scrollX = scrollX;
      this.render(type);
    }
  }

  protected clip() {
    const { width, height, scrollX, spreadsheet } = this.headerConfig;
    const isFrozenRowHeader = spreadsheet.isFrozenRowHeader();

    this.scrollGroup.style.clipPath = new Rect({
      style: {
        x: isFrozenRowHeader ? scrollX : 0,
        y: 0,
        width: isFrozenRowHeader ? width : width + scrollX,
        height,
      },
    });
  }

  public clear() {
    this.scrollGroup?.removeChildren();
    this.background?.remove();
  }

  protected getCellInstance(
    item: Node,
    spreadsheet: SpreadSheet,
    headerConfig: ColHeaderConfig,
  ) {
    return new ColCell(item, spreadsheet, headerConfig);
  }

  protected getCellGroup(node: Node) {
    return this.scrollGroup;
  }

  protected isColCellInRect(item: Node): boolean {
    const { spreadsheet, cornerWidth, width, scrollX } = this.headerConfig;

    return (
      // don't care about scrollY, because there is only freeze col-header exist
      width + scrollX > item.x &&
      scrollX - (spreadsheet.isFrozenRowHeader() ? 0 : cornerWidth) <
        item.x + item.width
    );
  }

  protected layout() {
    const { data, spreadsheet } = this.headerConfig;
    const { colCell } = spreadsheet.options;

    each(data, (node: Node) => {
      const item = node;

      if (this.isColCellInRect(item)) {
        const cell =
          colCell?.(item, spreadsheet, this.headerConfig) ||
          this.getCellInstance(item, spreadsheet, this.headerConfig);

        item.belongsCell = cell;

        const group = this.getCellGroup(item);
        group.appendChild(cell);
      }
    });
  }

  protected offset() {
    const { position, scrollX } = this.headerConfig;
    // 暂时不考虑移动y
    translateGroupX(this.scrollGroup, position.x - scrollX);
  }
}
