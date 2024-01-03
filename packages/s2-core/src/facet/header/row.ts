import { Group, Rect } from '@antv/g';
import { each } from 'lodash';
import { RowCell } from '../../cell';
import type { Node } from '../layout/node';
import { getFrozenRowCfgPivot, translateGroup } from '../utils';
import {
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  FRONT_GROUND_GROUP_SCROLL_Z_INDEX,
  FrozenGroupType,
  KEY_GROUP_ROW_HEADER_FROZEN,
  KEY_GROUP_ROW_SCROLL,
  S2Event,
} from '../../common';
import type { FrozenFacet } from '../frozen-facet';
import { customMerge } from '../../utils';
import { BaseHeader } from './base';
import type { RowHeaderConfig } from './interface';

/**
 * Row Header for SpreadSheet
 */
export class RowHeader extends BaseHeader<RowHeaderConfig> {
  public scrollGroup: Group;

  public frozenRowGroup: Group;

  constructor(config: RowHeaderConfig) {
    super(config);
    this.initGroups();
  }

  private initGroups() {
    this.scrollGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_ROW_SCROLL,
        style: { zIndex: FRONT_GROUND_GROUP_SCROLL_Z_INDEX },
      }),
    );

    this.frozenRowGroup = this.appendChild(
      new Group({
        name: KEY_GROUP_ROW_HEADER_FROZEN,
        style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
      }),
    );
  }

  protected getCellInstance(
    node: Node,
    otherOptions?: Partial<RowHeaderConfig>,
  ): RowCell {
    const headerConfig = this.getHeaderConfig();
    const finalConfig: RowHeaderConfig = otherOptions
      ? customMerge(headerConfig, otherOptions)
      : headerConfig;

    const { spreadsheet } = headerConfig;
    const { rowCell } = spreadsheet.options;

    return (
      rowCell?.(node, spreadsheet, finalConfig) ||
      new RowCell(node, spreadsheet, finalConfig)
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
    } = this.getHeaderConfig();

    if (this.isFrozenRow(node)) {
      return true;
    }

    return (
      // bottom
      viewportHeight + scrollY > node.y &&
      // top
      scrollY < node.y + node.height &&
      // left
      width - position.x + scrollX > node.x &&
      // right
      scrollX - position.x < node.x + node.width
    );
  }

  public isFrozenRow(node: Node): boolean {
    const { spreadsheet } = this.headerConfig;
    const { facet } = spreadsheet;
    const { rowCount = 0 } = getFrozenRowCfgPivot(
      spreadsheet.options,
      facet.getRowNodes(),
    );

    return rowCount > 0 && node.rowIndex >= 0 && node.rowIndex < rowCount;
  }

  protected getCellGroup(item: Node): Group {
    if (this.isFrozenRow(item)) {
      return this.frozenRowGroup;
    }

    return this.scrollGroup;
  }

  protected layout() {
    const { nodes, spreadsheet } = this.getHeaderConfig();

    // row'cell only show when visible
    each(nodes, (node) => {
      if (this.isRowCellInRect(node) && node.height !== 0) {
        const group = this.getCellGroup(node);
        const cell = this.getCellInstance(node, {
          isFrozen: group !== this.scrollGroup,
        });

        node.belongsCell = cell;

        group.appendChild(cell);
        spreadsheet.emit(S2Event.ROW_CELL_RENDER, cell);
        spreadsheet.emit(S2Event.LAYOUT_CELL_RENDER, cell);
      }
    });
  }

  protected offset() {
    const { scrollX = 0, scrollY = 0, position } = this.getHeaderConfig();

    const translateX = position.x - scrollX;

    translateGroup(this.scrollGroup, translateX, position.y - scrollY);
    translateGroup(this.frozenRowGroup, translateX, position.y);
  }

  protected clip(): void {
    const { width, height, position, spreadsheet } = this.getHeaderConfig();

    const frozenRowGroupHeight = (spreadsheet.facet as FrozenFacet)
      .frozenGroupInfo[FrozenGroupType.FROZEN_ROW].height;

    this.scrollGroup.style.clipPath = new Rect({
      style: {
        x: position.x,
        y: position.y + frozenRowGroupHeight,
        width,
        height,
      },
    });

    this.frozenRowGroup.style.clipPath = new Rect({
      style: {
        x: position.x,
        y: position.y,
        width,
        height: frozenRowGroupHeight,
      },
    });
  }

  public clear() {
    this.scrollGroup?.removeChildren();
    this.frozenRowGroup?.removeChildren();
  }
}
