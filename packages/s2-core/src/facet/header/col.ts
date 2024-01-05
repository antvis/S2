import { Group, Rect } from '@antv/g';
import { each } from 'lodash';
import { ColCell } from '../../cell/col-cell';
import {
  FRONT_GROUND_GROUP_SCROLL_Z_INDEX,
  KEY_GROUP_COL_SCROLL,
  S2Event,
} from '../../common/constant';
import type { Node } from '../layout/node';
import { translateGroupX } from '../utils';
import { BaseHeader } from './base';
import type { ColHeaderConfig } from './interface';

/**
 * Column Header for SpreadSheet
 */
export class ColHeader extends BaseHeader<ColHeaderConfig> {
  protected scrollGroup: Group;

  constructor(config: ColHeaderConfig) {
    super(config);
    this.initScrollGroup();
  }

  protected getCellInstance(node: Node) {
    const headerConfig = this.getHeaderConfig();

    const { spreadsheet } = this.getHeaderConfig();
    const { colCell } = spreadsheet.options;

    return (
      colCell?.(node, spreadsheet, headerConfig) ||
      new ColCell(node, spreadsheet, headerConfig)
    );
  }

  private initScrollGroup() {
    this.scrollGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_COL_SCROLL,
        style: { zIndex: FRONT_GROUND_GROUP_SCROLL_Z_INDEX },
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
    const { height, width, spreadsheet, position } = this.getHeaderConfig();
    const isFrozenRowHeader = spreadsheet.isFrozenRowHeader();

    this.scrollGroup.style.clipPath = new Rect({
      style: {
        x: isFrozenRowHeader ? position.x : 0,
        y: isFrozenRowHeader ? position.y : 0,
        width: isFrozenRowHeader ? width : position.x + width,
        height,
      },
    });
  }

  public clear() {
    this.scrollGroup?.removeChildren();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getCellGroup(node: Node): Group {
    return this.scrollGroup;
  }

  protected isColCellInRect(node: Node): boolean {
    const {
      spreadsheet,
      cornerWidth,
      width,
      scrollX = 0,
    } = this.getHeaderConfig();

    return (
      // don't care about scrollY, because there is only freeze col-header exist
      width + scrollX > node.x &&
      scrollX - (spreadsheet.isFrozenRowHeader() ? 0 : cornerWidth!) <
        node.x + node.width
    );
  }

  protected layout() {
    const { nodes, spreadsheet } = this.getHeaderConfig();

    each(nodes, (node) => {
      if (this.isColCellInRect(node)) {
        const group = this.getCellGroup(node);

        node.isFrozen = group !== this.scrollGroup;

        const cell = this.getCellInstance(node);

        node.belongsCell = cell;

        group?.appendChild(cell);
        spreadsheet.emit(S2Event.COL_CELL_RENDER, cell as ColCell);
        spreadsheet.emit(S2Event.LAYOUT_CELL_RENDER, cell);
      }
    });
  }

  protected offset() {
    const { position, scrollX = 0 } = this.getHeaderConfig();

    // 暂时不考虑移动 y
    translateGroupX(this.scrollGroup, position.x - scrollX);
  }
}
