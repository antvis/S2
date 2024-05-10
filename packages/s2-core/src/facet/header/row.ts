import { Group, Rect } from '@antv/g';
import { each } from 'lodash';
import { RowCell } from '../../cell';
import type { Node } from '../layout/node';
import { translateGroup } from '../utils';
import {
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  FRONT_GROUND_GROUP_SCROLL_Z_INDEX,
  FrozenGroupPosition,
  KEY_GROUP_ROW_HEADER_FROZEN,
  KEY_GROUP_ROW_HEADER_FROZEN_TRAILING,
  KEY_GROUP_ROW_SCROLL,
  S2Event,
} from '../../common';
import type { FrozenFacet } from '../frozen-facet';
import { BaseHeader } from './base';
import type { RowHeaderConfig } from './interface';
import { getExtraFrozenNodes, getFrozenTrailingRowOffset } from './util';

/**
 * Row Header for SpreadSheet
 */
export class RowHeader extends BaseHeader<RowHeaderConfig> {
  public scrollGroup: Group;

  public frozenGroup: Group;

  public frozenTrailingGroup: Group;

  private extraFrozenNodes: Node[];

  constructor(config: RowHeaderConfig) {
    super(config);
    this.initGroups();
    this.extraFrozenNodes = getExtraFrozenNodes(this.headerConfig.spreadsheet);
  }

  private initGroups() {
    this.scrollGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_ROW_SCROLL,
        style: { zIndex: FRONT_GROUND_GROUP_SCROLL_Z_INDEX },
      }),
    );

    this.frozenGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_ROW_HEADER_FROZEN,
        style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
      }),
    );
    this.frozenTrailingGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_ROW_HEADER_FROZEN_TRAILING,
        style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
      }),
    );
  }

  public getCellInstance(node: Node): RowCell {
    const headerConfig = this.getHeaderConfig();

    const { spreadsheet } = headerConfig;
    const { rowCell } = spreadsheet.options;

    return (
      rowCell?.(node, spreadsheet, headerConfig) ||
      new RowCell(node, spreadsheet, headerConfig)
    );
  }

  // row'cell only show when visible
  protected isRowCellInRect(node: Node): boolean {
    const {
      width,
      viewportHeight,
      position,
      scrollY = 0,
      scrollX = 0,
      spreadsheet,
    } = this.getHeaderConfig();
    const frozenGroupPositions = (spreadsheet.facet as FrozenFacet)
      .frozenGroupPositions;

    return (
      // bottom
      viewportHeight +
        scrollY -
        frozenGroupPositions[FrozenGroupPosition.TrailingRow].height >
        node.y &&
      // top
      scrollY + frozenGroupPositions[FrozenGroupPosition.Row].height <
        node.y + node.height &&
      // left
      width - position.x + scrollX > node.x &&
      // right
      scrollX - position.x < node.x + node.width
    );
  }

  protected getCellGroup(item: Node): Group {
    if (item.isFrozen) {
      return this.frozenGroup;
    }

    if (item.isFrozenTrailing) {
      return this.frozenTrailingGroup;
    }

    return this.scrollGroup;
  }

  protected layout() {
    const { nodes, spreadsheet } = this.getHeaderConfig();

    const appendChild = (node: Node) => {
      const group = this.getCellGroup(node);

      const cell = this.getCellInstance(node);

      node.belongsCell = cell;

      group.appendChild(cell);
      spreadsheet.emit(S2Event.ROW_CELL_RENDER, cell);
      spreadsheet.emit(S2Event.LAYOUT_CELL_RENDER, cell);
    };

    // row'cell only show when visible
    each(nodes, (node) => {
      if (this.isRowCellInRect(node) && node.height !== 0) {
        appendChild(node);
      }
    });

    each(this.extraFrozenNodes, (node) => {
      if (node.height !== 0) {
        appendChild(node);
      }
    });
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

    const frozenGroupPositions = (spreadsheet.facet as FrozenFacet)
      .frozenGroupPositions;

    const trailingRowOffset = getFrozenTrailingRowOffset(
      frozenGroupPositions,
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

    const frozenGroupPositions = (spreadsheet.facet as FrozenFacet)
      .frozenGroupPositions;

    const frozenRowGroupHeight =
      frozenGroupPositions[FrozenGroupPosition.Row].height;
    const frozenTrailingRowGroupHeight =
      frozenGroupPositions[FrozenGroupPosition.TrailingRow].height;

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

  public clear() {
    this.scrollGroup?.removeChildren();
    this.frozenGroup?.removeChildren();
  }
}
