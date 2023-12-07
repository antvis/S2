import type { IGroup } from '@antv/g-canvas';
import type { Node } from '../layout/node';
import {
  getFrozenRowCfgPivot,
  translateGroup,
  translateGroupX,
} from '../utils';
import {
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  FRONT_GROUND_GROUP_SCROLL_Z_INDEX,
  KEY_GROUP_ROW_HEADER_FROZEN,
  KEY_GROUP_ROW_SCROLL,
} from '../../common/constant';
import { RowHeader, type RowHeaderConfig } from './row';

export class BaseFrozenRowHeader extends RowHeader {
  public scrollGroup: IGroup;

  public frozenHeadGroup: IGroup;

  constructor(cfg: RowHeaderConfig) {
    super(cfg);
    this.scrollGroup = this.addGroup({
      name: KEY_GROUP_ROW_SCROLL,
      zIndex: FRONT_GROUND_GROUP_SCROLL_Z_INDEX,
    });

    this.frozenHeadGroup = this.addGroup({
      name: KEY_GROUP_ROW_HEADER_FROZEN,
      zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
    });

    const { position, seriesNumberWidth } = this.headerConfig;
    translateGroup(
      this.frozenHeadGroup,
      position.x + seriesNumberWidth,
      position.y,
    );
  }

  protected rowCellInRectXDir(item: Node): boolean {
    const { width, scrollX, seriesNumberWidth } = this.headerConfig;
    const itemX = item.x + seriesNumberWidth;
    return width + scrollX > itemX && scrollX < itemX + item.width;
  }

  protected rowCellInRectYDir(item: Node): boolean {
    const { viewportHeight, scrollY } = this.headerConfig;
    const itemY = item.y - this.getFrozenFirstRowHeight();
    return viewportHeight + scrollY > itemY && scrollY < itemY + item.height;
  }

  protected rowCellInRect(item: Node): boolean {
    const visibleInXDir = this.rowCellInRectXDir(item);
    if (this.isFrozenRow(item)) {
      return visibleInXDir;
    }
    return visibleInXDir && this.rowCellInRectYDir(item);
  }

  protected getCellGroup(item: Node): IGroup {
    if (this.isFrozenRow(item)) {
      return this.frozenHeadGroup;
    }
    return this.scrollGroup;
  }

  protected offset() {
    const { scrollX, scrollY, position, seriesNumberWidth } = this.headerConfig;
    // 向右多移动的seriesNumberWidth是序号的宽度
    const translateX = position.x - scrollX + seriesNumberWidth;
    translateGroup(this.scrollGroup, translateX, position.y - scrollY);
    translateGroupX(this.frozenHeadGroup, translateX);
  }

  public clip(): void {
    const { width, viewportHeight, scrollX, scrollY, seriesNumberWidth } =
      this.headerConfig;
    // 由于多移动了seriesNumberWidth跨度，所有需要向左切。 - 是反向剪裁（右 -> 左）
    const clipX = scrollX - seriesNumberWidth;
    this.scrollGroup.setClip({
      type: 'rect',
      attrs: {
        x: clipX,
        y: scrollY + this.getFrozenFirstRowHeight(),
        width,
        height: viewportHeight,
      },
    });
    this.frozenHeadGroup.setClip({
      type: 'rect',
      attrs: {
        x: clipX,
        y: 0,
        width: this.headerConfig.width,
        height: this.getFrozenFirstRowHeight(),
      },
    });
  }

  public isFrozenRow(node: Node): boolean {
    const { spreadsheet } = this.headerConfig;
    const { facet } = spreadsheet;
    const { frozenRowCount } = getFrozenRowCfgPivot(
      spreadsheet.options,
      facet.layoutResult?.rowNodes,
    );
    return (
      frozenRowCount > 0 && node.rowIndex >= 0 && node.rowIndex < frozenRowCount
    );
  }

  public getFrozenFirstRowHeight(): number {
    const { spreadsheet } = this.headerConfig;
    const { facet } = spreadsheet;
    const { frozenRowHeight } = getFrozenRowCfgPivot(
      spreadsheet.options,
      facet.layoutResult?.rowNodes,
    );
    return frozenRowHeight;
  }

  public clear(): void {
    this.frozenHeadGroup.clear();
    this.scrollGroup.clear();
  }
}
