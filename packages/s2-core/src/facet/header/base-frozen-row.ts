import type { IGroup } from '@antv/g-canvas';
import { get } from 'lodash';
import type { Node } from '../layout/node';
import {
  getFrozenOptionsPivot,
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
  protected scrollGroup: IGroup;

  protected frozenHeadGroup: IGroup;

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
    return viewportHeight + scrollY > item.y && scrollY < item.y + item.height;
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
    translateGroup(
      this.scrollGroup,
      position.x - scrollX + seriesNumberWidth,
      position.y + this.getFrozenRowHeight() - scrollY,
    );
    translateGroupX(
      this.frozenHeadGroup,
      position.x - scrollX + seriesNumberWidth,
    );
  }

  public clip(): void {
    const { width, viewportHeight, scrollX, scrollY, seriesNumberWidth } =
      this.headerConfig;
    this.scrollGroup.setClip({
      type: 'rect',
      attrs: {
        // 由于多移动了seriesNumberWidth跨度，所有需要向左切。 - 是反向剪裁（右 -> 左）
        x: scrollX - seriesNumberWidth,
        y: scrollY,
        width,
        height: viewportHeight,
      },
    });
    this.frozenHeadGroup.setClip({
      type: 'rect',
      attrs: {
        x: scrollX - seriesNumberWidth,
        y: 0,
        width: this.headerConfig.width,
        height: this.getFrozenRowHeight(),
      },
    });
  }

  protected getFrozenRowHeight = () => {
    // get row head height TODO: There may be a better solution
    const frozenCount = this.getFrozenRowCount();
    let sum = 0;
    for (let i = 0, len = frozenCount; i < len; i++) {
      sum += get(
        this.headerConfig.spreadsheet,
        `facet.layoutResult.rowNodes[${i}].height`,
        0,
      );
    }
    return sum;
  };

  protected isFrozenRow(item: Node): boolean {
    const frozenRowCount = this.getFrozenRowCount();
    return (
      frozenRowCount > 0 && item.rowIndex >= 0 && item.rowIndex < frozenRowCount
    );
  }

  protected getFrozenRowCount(): number {
    const { spreadsheet } = this.headerConfig;
    const { frozenRowCount } = getFrozenOptionsPivot(spreadsheet.facet?.cfg);
    return frozenRowCount;
  }

  public clear(): void {
    this.frozenHeadGroup.clear();
    this.scrollGroup.clear();
    // super.clear();
  }
}
