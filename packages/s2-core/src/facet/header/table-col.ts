import { Group, Rect, type RectStyleProps } from '@antv/g';
import { TableColCell, TableCornerCell } from '../../cell';
import {
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  FrozenGroupPosition,
  KEY_GROUP_COL_FROZEN,
  KEY_GROUP_COL_FROZEN_TRAILING,
  KEY_GROUP_FROZEN_COL_RESIZE_AREA,
  SERIES_NUMBER_FIELD,
} from '../../common/constant';
import type { SpreadSheet } from '../../sheet-type';
import type { Node } from '../layout/node';
import {
  getLeftLeafNode,
  isFrozenCol,
  isFrozenTrailingCol,
  translateGroupX,
} from '../utils';
import type { FrozenFacet } from '../frozen-facet';
import { ColHeader } from './col';
import type { ColHeaderConfig } from './interface';
import { getFrozenTrailingColOffset } from './util';

/**
 * Column Header for SpreadSheet
 */
export class TableColHeader extends ColHeader {
  public frozenGroup: Group;

  public frozenTrailingGroup: Group;

  private topLevelColNodeLength: number;

  constructor(config: ColHeaderConfig) {
    super(config);
    this.initFrozenColGroups();
  }

  protected getCellInstance(node: Node) {
    const headerConfig = this.getHeaderConfig();
    const { spreadsheet } = headerConfig;
    const { seriesNumberCell, colCell } = spreadsheet.options;

    const args: [Node, SpreadSheet, ColHeaderConfig] = [
      node,
      spreadsheet,
      headerConfig,
    ];

    if (node.field === SERIES_NUMBER_FIELD) {
      return seriesNumberCell?.(...args) || new TableCornerCell(...args);
    }

    return colCell?.(...args) || new TableColCell(...args);
  }

  private getRealFrozenOptions() {
    const headerConfig = this.getHeaderConfig();

    return (
      headerConfig.spreadsheet.facet as FrozenFacet
    ).getRealFrozenOptions();
  }

  private initFrozenColGroups() {
    const headerConfig = this.getHeaderConfig();
    const topLevelNodes = headerConfig.spreadsheet.facet.getColNodes(0);

    this.topLevelColNodeLength = topLevelNodes.length;

    const { colCount, trailingColCount } = this.getRealFrozenOptions();

    if (colCount) {
      this.frozenGroup = this.appendChild(
        new Group({
          name: KEY_GROUP_COL_FROZEN,
          style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
        }),
      );
    }

    if (trailingColCount) {
      this.frozenTrailingGroup = this.appendChild(
        new Group({
          name: KEY_GROUP_COL_FROZEN_TRAILING,
          style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
        }),
      );
    }
  }

  public clear() {
    super.clear();

    this.frozenTrailingGroup?.removeChildren();
    this.frozenGroup?.removeChildren();

    const { spreadsheet } = this.getHeaderConfig();
    // 额外清除冻结列的 Resizer Area
    const resizerArea =
      spreadsheet.facet?.foregroundGroup.getElementById<Group>(
        KEY_GROUP_FROZEN_COL_RESIZE_AREA,
      );

    resizerArea?.removeChildren();
  }

  protected getCellGroup(node: Node): Group {
    const leftLeafNodeColIndex = getLeftLeafNode(node).colIndex;
    const { colCount, trailingColCount } = this.getRealFrozenOptions();

    if (isFrozenCol(leftLeafNodeColIndex, colCount)) {
      return this.frozenGroup;
    }

    if (
      isFrozenTrailingCol(
        leftLeafNodeColIndex,
        trailingColCount,
        this.topLevelColNodeLength,
      )
    ) {
      return this.frozenTrailingGroup;
    }

    return this.scrollGroup;
  }

  protected isColCellInRect(node: Node): boolean {
    const leftLeafNodeColIndex = getLeftLeafNode(node).colIndex;
    const { colCount, trailingColCount } = this.getRealFrozenOptions();

    if (
      isFrozenCol(leftLeafNodeColIndex, colCount) ||
      isFrozenTrailingCol(
        leftLeafNodeColIndex,
        trailingColCount,
        this.topLevelColNodeLength,
      )
    ) {
      return true;
    }

    return super.isColCellInRect(node);
  }

  public getScrollGroupClipBBox = (): RectStyleProps => {
    const { width, height, spreadsheet, position } = this.getHeaderConfig();
    const frozenGroupPositions = (spreadsheet.facet as FrozenFacet)
      .frozenGroupPositions;
    const colWidth = frozenGroupPositions[FrozenGroupPosition.Col].width;
    const trailingColWidth =
      frozenGroupPositions[FrozenGroupPosition.TrailingCol].width;
    const scrollGroupWidth = width - colWidth - trailingColWidth;

    return {
      x: position.x + colWidth,
      y: position.y,
      width: scrollGroupWidth,
      height,
    };
  };

  protected override offset() {
    super.offset();

    const { position, spreadsheet } = this.getHeaderConfig();
    const frozenGroupPositions = (spreadsheet.facet as FrozenFacet)
      .frozenGroupPositions;

    const viewportWidth = spreadsheet.facet.panelBBox.viewportWidth;
    const trailingColOffset = getFrozenTrailingColOffset(
      frozenGroupPositions,
      viewportWidth,
    );

    translateGroupX(this.frozenGroup, position.x);
    translateGroupX(this.frozenTrailingGroup, position.x - trailingColOffset);
  }

  protected clip(): void {
    this.scrollGroup.style.clipPath = new Rect({
      style: this.getScrollGroupClipBBox(),
    });
  }
}
