import { Group, Rect } from '@antv/g';
import { each } from 'lodash';
import { ColCell } from '../../cell/col-cell';
import {
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  FRONT_GROUND_GROUP_SCROLL_Z_INDEX,
  FrozenGroupArea,
  KEY_GROUP_COL_FROZEN,
  KEY_GROUP_COL_FROZEN_TRAILING,
  KEY_GROUP_COL_SCROLL,
  S2Event,
} from '../../common/constant';
import type { Node } from '../layout/node';
import { translateGroupX } from '../utils';
import type { FrozenFacet } from '../frozen-facet';
import { BaseHeader } from './base';
import type { ColHeaderConfig } from './interface';
import {
  getExtraFrozenColNodes,
  getFrozenColOffset,
  getFrozenTrailingColOffset,
  getScrollGroupClip,
} from './util';

/**
 * Column Header for SpreadSheet
 */
export class ColHeader extends BaseHeader<ColHeaderConfig> {
  protected initGroups(): void {
    this.scrollGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_COL_SCROLL,
        style: { zIndex: FRONT_GROUND_GROUP_SCROLL_Z_INDEX },
      }),
    );

    this.frozenGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_COL_FROZEN,
        style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
      }),
    );

    this.frozenTrailingGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_COL_FROZEN_TRAILING,
        style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
      }),
    );

    this.extraFrozenNodes = getExtraFrozenColNodes(
      this.headerConfig.spreadsheet.facet as FrozenFacet,
    );
  }

  protected getCellGroup(node: Node): Group {
    if (node.isFrozenHead) {
      return this.frozenGroup;
    }

    if (node.isFrozenTrailing) {
      return this.frozenTrailingGroup;
    }

    return this.scrollGroup;
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

  protected appendNode(node: Node) {
    const { spreadsheet } = this.getHeaderConfig();
    const group = this.getCellGroup(node);

    const cell = this.getCellInstance(node);

    node.belongsCell = cell;

    group?.appendChild(cell);
    spreadsheet.emit(S2Event.COL_CELL_RENDER, cell as ColCell);
    spreadsheet.emit(S2Event.LAYOUT_CELL_RENDER, cell);
  }

  protected layout() {
    const { nodes } = this.getHeaderConfig();

    each(nodes, (node) => {
      if (this.isColCellInRect(node)) {
        this.appendNode(node);
      }
    });

    each(this.extraFrozenNodes, (node) => {
      this.appendNode(node);
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
    const {
      height,
      spreadsheet,
      position,
      viewportWidth,
      cornerWidth = 0,
      scrollX = 0,
    } = this.getHeaderConfig();

    const facet = spreadsheet.facet as FrozenFacet;
    const frozenGroupAreas = facet.frozenGroupAreas;

    const frozenColGroupWidth = frozenGroupAreas[FrozenGroupArea.Col].width;
    const frozenTrailingColGroupWidth =
      frozenGroupAreas[FrozenGroupArea.TrailingCol].width;

    const { x, width } = getScrollGroupClip(facet, position);

    this.scrollGroup.style.clipPath = new Rect({
      style: {
        x,
        y: position.y,
        width,
        height,
      },
    });

    this.frozenGroup.style.clipPath = new Rect({
      style: {
        x: position.x - getFrozenColOffset(facet, cornerWidth, scrollX),
        y: position.y,
        width: frozenColGroupWidth,
        height,
      },
    });

    this.frozenTrailingGroup.style.clipPath = new Rect({
      style: {
        x: position.x + viewportWidth - frozenTrailingColGroupWidth,
        y: position.y,
        width: frozenTrailingColGroupWidth,
        height,
      },
    });
  }

  protected isColCellInRect(node: Node): boolean {
    const {
      spreadsheet,
      cornerWidth = 0,
      viewportWidth,
      scrollX = 0,
      position,
    } = this.getHeaderConfig();

    const frozenGroupAreas = (spreadsheet.facet as FrozenFacet)
      .frozenGroupAreas;

    let leftBoundary;

    const frozenColWidth = frozenGroupAreas[FrozenGroupArea.Col].width;
    const frozenTrailingColWidth =
      frozenGroupAreas[FrozenGroupArea.TrailingCol].width;

    if (spreadsheet.isFrozenRowHeader()) {
      leftBoundary = frozenColWidth;
    } else if (frozenColWidth) {
      // 如果存在列冻结，那么 frame 最多滚动到最左侧，即滚动 cornerWidth 的宽度
      leftBoundary = frozenColWidth - cornerWidth;
    } else {
      leftBoundary = -position.x;
    }

    return (
      // don't care about scrollY, because there is only freeze col-header exist
      viewportWidth - frozenTrailingColWidth >= node.x - scrollX &&
      leftBoundary <= node.x + node.width - scrollX
    );
  }

  protected offset() {
    const {
      viewportWidth,
      scrollX = 0,
      position,
      spreadsheet,
      cornerWidth,
    } = this.getHeaderConfig();

    translateGroupX(this.scrollGroup, position.x - scrollX);

    const facet = spreadsheet.facet as FrozenFacet;
    const colOffset = getFrozenColOffset(facet, cornerWidth, scrollX);

    const trailingColOffset = getFrozenTrailingColOffset(facet, viewportWidth);

    translateGroupX(this.frozenGroup, position.x - colOffset);
    translateGroupX(this.frozenTrailingGroup, position.x - trailingColOffset);
  }
}
