import { each, isEmpty } from 'lodash';
import { IGroup, IShape } from '@antv/g-base';
import { translateGroup } from '../utils';
import { BaseHeader, BaseHeaderConfig } from './base';
import {
  KEY_GROUP_COL_SCROLL,
  FRONT_GROUND_GROUP_COL_SCROLL_Z_INDEX,
} from '@/common/constant';
import { ColCell } from '@/cell';
import { Formatter, S2CellType } from '@/common/interface';
import { Node } from '@/facet/layout/node';

import { SpreadSheet } from '@/sheet-type/index';

export interface ColHeaderConfig extends BaseHeaderConfig {
  // format field value
  formatter: (field: string) => Formatter;
  // corner width used when scroll {@link ColHeader#onColScroll}
  cornerWidth?: number;
  scrollContainsRowHeader?: boolean;
}

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
  public onColScroll(scrollX: number, cornerWidth: number, type: string) {
    // this is works in scroll-keep-text-center feature
    if (this.headerConfig.scrollX !== scrollX) {
      this.headerConfig.scrollX = scrollX;
      this.headerConfig.cornerWidth = cornerWidth || 0;
      this.render(type);
    }
  }

  protected clip() {
    const { width, height, scrollX, spreadsheet } = this.headerConfig;
    const scrollXOffset = spreadsheet.isFreezeRowHeader() ? scrollX : 0;
    this.scrollGroup.setClip({
      type: 'rect',
      attrs: {
        x: scrollXOffset,
        y: 0,
        width: width + scrollXOffset,
        height,
      },
    });
  }

  public clear() {
    this.scrollGroup.clear();
    this.background?.remove(true);
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
      scrollX - (spreadsheet.isFreezeRowHeader() ? 0 : cornerWidth) <
        item.x + item.width
    );
  }

  protected layout() {
    const { data, spreadsheet } = this.headerConfig;

    const colCell = spreadsheet?.facet?.cfg?.colCell;

    each(data, (node: Node) => {
      const item = node;

      if (this.isColCellInRect(item)) {
        let cell: S2CellType;
        if (colCell) {
          cell = colCell(item, spreadsheet, this.headerConfig);
        }

        if (isEmpty(cell)) {
          cell = this.getCellInstance(item, spreadsheet, this.headerConfig);
        }
        item.belongsCell = cell;

        const group = this.getCellGroup(item);
        group.add(cell);
      }
    });
  }

  protected offset() {
    const { position, scrollX } = this.headerConfig;
    // 暂时不考虑移动y
    translateGroup(this.scrollGroup, position.x - scrollX, 0);
  }
}
