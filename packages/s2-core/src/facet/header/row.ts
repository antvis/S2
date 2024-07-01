import { Group, Rect } from '@antv/g';
import { each } from 'lodash';
import { RowCell, SeriesNumberCell } from '../../cell';
import {
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  FRONT_GROUND_GROUP_SCROLL_Z_INDEX,
  FrozenGroupArea,
  KEY_GROUP_ROW_FROZEN,
  KEY_GROUP_ROW_FROZEN_TRAILING,
  KEY_GROUP_ROW_SCROLL,
  S2Event,
} from '../../common';
import type { FrozenFacet } from '../frozen-facet';
import type { Node } from '../layout/node';
import { translateGroup } from '../utils';
import { BaseHeader } from './base';
import type { RowHeaderConfig } from './interface';
import { getExtraFrozenRowNodes, getFrozenTrailingRowOffset } from './util';

/**
 * Row Header for SpreadSheet
 */
export class RowHeader extends BaseHeader<RowHeaderConfig> {
  protected initGroups(): void {
    this.scrollGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_ROW_SCROLL,
        style: { zIndex: FRONT_GROUND_GROUP_SCROLL_Z_INDEX },
      }),
    );

    this.frozenGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_ROW_FROZEN,
        style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
      }),
    );
    this.frozenTrailingGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_ROW_FROZEN_TRAILING,
        style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
      }),
    );

    const { spreadsheet } = this.getHeaderConfig();

    this.extraFrozenNodes = getExtraFrozenRowNodes(
      spreadsheet.facet as FrozenFacet,
    );
  }

  public getCellInstance(node: Node): RowCell | SeriesNumberCell {
    const headerConfig = this.getHeaderConfig();

    const { spreadsheet } = headerConfig;
    const { rowCell } = spreadsheet.options;

    return (
      rowCell?.(node, spreadsheet, headerConfig) ||
      new RowCell(node, spreadsheet, headerConfig)
    );
  }

  // row'cell only show when visible
  protected isCellInRect(node: Node): boolean {
    const {
      width,
      viewportHeight,
      position,
      scrollY = 0,
      scrollX = 0,
      spreadsheet,
    } = this.getHeaderConfig();
    const frozenGroupAreas = (spreadsheet.facet as FrozenFacet)
      .frozenGroupAreas;

    return (
      // bottom
      viewportHeight +
        scrollY -
        frozenGroupAreas[FrozenGroupArea.TrailingRow].height >
        node.y &&
      // top
      scrollY + frozenGroupAreas[FrozenGroupArea.Row].height <
        node.y + node.height &&
      // left
      width + scrollX - position.x > node.x &&
      // right
      scrollX - position.x < node.x + node.width
    );
  }

  protected getCellGroup(item: Node): Group {
    if (item.isFrozenHead) {
      return this.frozenGroup;
    }

    if (item.isFrozenTrailing) {
      return this.frozenTrailingGroup;
    }

    return this.scrollGroup;
  }

  protected layout() {
    const { nodes } = this.getHeaderConfig();

    const appendNode = (node: Node) => {
      const group = this.getCellGroup(node);

      const cell = this.getCellInstance(node);

      node.belongsCell = cell;

      group.appendChild(cell);

      this.emitRenderEvent(cell);
    };

    // row'cell only show when visible
    each(nodes, (node) => {
      if (this.isCellInRect(node) && node.height !== 0) {
        appendNode(node);
      }
    });

    each(this.extraFrozenNodes, (node) => {
      if (node.height !== 0) {
        appendNode(node);
      }
    });
  }

  protected emitRenderEvent(cell: RowCell | SeriesNumberCell) {
    const { spreadsheet } = this.getHeaderConfig();

    spreadsheet.emit(S2Event.ROW_CELL_RENDER, cell as RowCell);
    spreadsheet.emit(S2Event.LAYOUT_CELL_RENDER, cell);
  }

  protected offset() {
    const {
      scrollX = 0,
      scrollY = 0,
      position,
      spreadsheet,
      viewportHeight,
    } = this.getHeaderConfig();

    const translateX = position.x - scrollX;

    const paginationScrollY = spreadsheet.facet.getPaginationScrollY();

    const facet = spreadsheet.facet as FrozenFacet;

    const trailingRowOffset = getFrozenTrailingRowOffset(
      facet,
      viewportHeight,
      paginationScrollY,
    );

    translateGroup(this.scrollGroup, translateX, position.y - scrollY);
    translateGroup(
      this.frozenGroup,
      translateX,
      position.y - paginationScrollY,
    );
    translateGroup(
      this.frozenTrailingGroup,
      translateX,
      position.y - trailingRowOffset,
    );
  }

  protected clip(): void {
    const { width, viewportHeight, position, spreadsheet } =
      this.getHeaderConfig();

    const frozenGroupAreas = (spreadsheet.facet as FrozenFacet)
      .frozenGroupAreas;

    const frozenRowGroupHeight = frozenGroupAreas[FrozenGroupArea.Row].height;
    const frozenTrailingRowGroupHeight =
      frozenGroupAreas[FrozenGroupArea.TrailingRow].height;

    this.scrollGroup.style.clipPath = new Rect({
      style: {
        x: spreadsheet.facet.cornerBBox.x,
        y: position.y + frozenRowGroupHeight,
        width,
        height:
          viewportHeight - frozenRowGroupHeight - frozenTrailingRowGroupHeight,
      },
    });

    this.frozenGroup.style.clipPath = new Rect({
      style: {
        x: spreadsheet.facet.cornerBBox.x,
        y: position.y,
        width,
        height: frozenRowGroupHeight,
      },
    });

    this.frozenTrailingGroup.style.clipPath = new Rect({
      style: {
        x: spreadsheet.facet.cornerBBox.x,
        y: position.y + viewportHeight - frozenTrailingRowGroupHeight,
        width,
        height: frozenTrailingRowGroupHeight,
      },
    });
  }
}
