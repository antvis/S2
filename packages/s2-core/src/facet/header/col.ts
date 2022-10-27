import type { IGroup, IShape } from '@antv/g-canvas';
import { each } from 'lodash';
import { ColCell } from '../../cell';
import {
  FRONT_GROUND_GROUP_COL_SCROLL_Z_INDEX,
  KEY_GROUP_COL_SCROLL,
} from '../../common/constant';
import type { SpreadSheet } from '../../sheet-type';
import type { Node } from '../layout/node';
import { translateGroupX } from '../utils';
import { BaseHeader } from './base';
import type { ColHeaderConfig } from './interface';

/**
 * Column Header for SpreadSheet
 */
export class ColHeader extends BaseHeader<ColHeaderConfig> {
  protected scrollGroup: IGroup;

  protected background: IShape;

  constructor(cfg: ColHeaderConfig) {
    super(cfg);
    this.scrollGroup = this.addGroup({
      name: KEY_GROUP_COL_SCROLL,
      zIndex: FRONT_GROUND_GROUP_COL_SCROLL_Z_INDEX,
    });
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
    const { width, height, scrollX = 0, spreadsheet } = this.headerConfig;
    const isFrozenRowHeader = spreadsheet.isFrozenRowHeader();

    this.scrollGroup.setClip({
      type: 'rect',
      attrs: {
        x: isFrozenRowHeader ? scrollX : 0,
        y: 0,
        width: isFrozenRowHeader ? width : width + scrollX,
        height,
      },
    });
  }

  public clear() {
    this.scrollGroup?.clear();
    this.background?.remove(true);
  }

  protected getCellInstance(
    item: Node,
    spreadsheet: SpreadSheet,
    headerConfig: ColHeaderConfig,
  ) {
    return new ColCell(item, spreadsheet, headerConfig);
  }

  protected getCellGroup() {
    return this.scrollGroup;
  }

  protected isColCellInRect(item: Node): boolean {
    const { spreadsheet, cornerWidth, width, scrollX = 0 } = this.headerConfig;

    return (
      // don't care about scrollY, because there is only freeze col-header exist
      width + scrollX > item.x &&
      scrollX - (spreadsheet.isFrozenRowHeader() ? 0 : cornerWidth!) <
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

        const group = this.getCellGroup();
        group.add(cell);
      }
    });
  }

  protected offset() {
    const { position, scrollX = 0 } = this.headerConfig;
    // 暂时不考虑移动y
    translateGroupX(this.scrollGroup, position.x - scrollX);
  }
}
