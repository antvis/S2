import { Group, Rect, type DisplayObject } from '@antv/g';
import { each } from 'lodash';
import { ColCell } from '../../cell/col-cell';
import {
  FRONT_GROUND_GROUP_COL_SCROLL_Z_INDEX,
  KEY_GROUP_COL_SCROLL,
} from '../../common/constant';
import type { S2CellType } from '../../common/interface';
import type { Node } from '../layout/node';
import { translateGroupX } from '../utils';
import { BaseHeader } from './base';
import type { ColHeaderConfig } from './interface';

/**
 * Column Header for SpreadSheet
 */
export class ColHeader extends BaseHeader<ColHeaderConfig> {
  protected scrollGroup: Group;

  protected background: DisplayObject;

  constructor(cfg: ColHeaderConfig) {
    super(cfg);

    this.initScrollGroup();
  }

  protected getCellInstance(node: Node): S2CellType {
    const { spreadsheet } = this.headerConfig;
    const { colCell } = spreadsheet.options;

    return (
      colCell?.(node, spreadsheet, this.headerConfig) ||
      new ColCell(node, spreadsheet, this.headerConfig)
    );
  }

  private initScrollGroup() {
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
    const { height, spreadsheet } = this.headerConfig;

    this.scrollGroup.style.clipPath = new Rect({
      style: {
        x: 0,
        y: 0,
        width: spreadsheet.options.width!,
        height,
      },
    });
  }

  public clear() {
    this.scrollGroup?.removeChildren();
    this.background?.remove();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getCellGroup(node: Node): Group {
    return this.scrollGroup;
  }

  protected isColCellInRect(node: Node): boolean {
    const { spreadsheet, cornerWidth, width, scrollX = 0 } = this.headerConfig;

    return (
      // don't care about scrollY, because there is only freeze col-header exist
      width + scrollX > node.x &&
      scrollX - (spreadsheet.isFrozenRowHeader() ? 0 : cornerWidth!) <
        node.x + node.width
    );
  }

  protected layout() {
    const { nodes } = this.headerConfig;

    each(nodes, (node) => {
      if (this.isColCellInRect(node)) {
        const cell = this.getCellInstance(node);

        node.belongsCell = cell;

        const group = this.getCellGroup(node);

        group?.appendChild(cell);
      }
    });
  }

  protected offset() {
    const { position, scrollX = 0 } = this.headerConfig;

    // 暂时不考虑移动 y
    translateGroupX(this.scrollGroup, position.x - scrollX);
  }
}
