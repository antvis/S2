import type { GM } from '@antv/g-gesture';
import { each, isEmpty } from 'lodash';
import type { IGroup } from '@antv/g-canvas';
import { RowCell } from '../../cell';
import type { S2CellType, S2Options, ViewMeta } from '../../common/interface';
import type { Node } from '../layout/node';
import { translateGroup } from '../utils';
import { BaseHeader, type BaseHeaderConfig } from './base';

export interface RowHeaderConfig extends BaseHeaderConfig {
  // type of hierarchy
  hierarchyType: S2Options['hierarchyType'];
  // field ids that click to navigate
  linkFields: string[] | ((meta: Node | ViewMeta) => boolean);
  // series number group's width, will be 0 when not exists
  seriesNumberWidth: number;
}

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

  // row'cell only show when visible
  protected rowCellInRect(item: Node): boolean {
    const { width, viewportHeight, seriesNumberWidth, scrollY, scrollX } =
      this.headerConfig;
    return (
      viewportHeight + scrollY > item.y && // bottom
      scrollY < item.y + item.height && // top
      width - seriesNumberWidth + scrollX > item.x && // left
      scrollX - seriesNumberWidth < item.x + item.width
    ); // right
  }

  public createCellInstance(node: Node) {
    return new RowCell(node, this.headerConfig.spreadsheet, this.headerConfig);
  }

  protected getCellGroup(node: Node): IGroup {
    return this;
  }

  protected getCustomRowCell() {
    const { spreadsheet } = this.headerConfig;
    return spreadsheet?.facet?.cfg?.rowCell;
  }

  protected layout() {
    const { data, spreadsheet } = this.headerConfig;
    const rowCell = this.getCustomRowCell();
    each(data, (item: Node) => {
      if (this.rowCellInRect(item) && item.height !== 0) {
        let cell: S2CellType;
        // 首先由外部控制UI展示
        if (rowCell) {
          cell = rowCell(item, spreadsheet, this.headerConfig);
        }
        // 如果外部没处理，就用默认的
        if (isEmpty(cell)) {
          if (spreadsheet.isPivotMode()) {
            cell = this.createCellInstance(item);
          }
        }
        item.belongsCell = cell;
        const group = this.getCellGroup(item);
        group.add(cell);
      }
    });
  }

  protected offset() {
    const { scrollX, scrollY, position, seriesNumberWidth } = this.headerConfig;
    // 向右多移动的seriesNumberWidth是序号的宽度
    translateGroup(
      this,
      position.x - scrollX + seriesNumberWidth,
      position.y - scrollY,
    );
  }

  protected clip(): void {
    const { width, viewportHeight, scrollX, scrollY, seriesNumberWidth } =
      this.headerConfig;
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
