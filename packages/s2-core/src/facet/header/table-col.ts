import { Group, Rect, type RectStyleProps } from '@antv/g';
import { TableColCell, TableCornerCell } from '../../cell';
import {
  FRONT_GROUND_GROUP_COL_FROZEN_Z_INDEX,
  KEY_GROUP_COL_FROZEN,
  KEY_GROUP_COL_FROZEN_TRAILING,
  KEY_GROUP_FROZEN_COL_RESIZE_AREA,
  SERIES_NUMBER_FIELD,
} from '../../common/constant';
import type { SpreadSheet } from '../../sheet-type';
import { getFrozenColWidth } from '../../utils/layout/frozen';
import type { Node } from '../layout/node';
import {
  getFrozenLeafNodesCount,
  getLeftLeafNode,
  isFrozenCol,
  isFrozenTrailingCol,
  translateGroupX,
} from '../utils';
import { ColHeader } from './col';
import type { ColHeaderConfig } from './interface';

/**
 * Column Header for SpreadSheet
 */
export class TableColHeader extends ColHeader {
  public frozenColGroup: Group;

  public frozenTrailingColGroup: Group;

  constructor(cfg: ColHeaderConfig) {
    super(cfg);

    this.initFrozenColGroups();
  }

  protected getCellInstance(node: Node) {
    const { spreadsheet } = node;
    const { seriesNumberCell, colCell } = spreadsheet.options;

    const args: [Node, SpreadSheet, ColHeaderConfig] = [
      node,
      spreadsheet,
      this.headerConfig,
    ];

    if (node.field === SERIES_NUMBER_FIELD) {
      return seriesNumberCell?.(...args) || new TableCornerCell(...args);
    }

    return colCell?.(...args) || new TableColCell(...args);
  }

  private initFrozenColGroups() {
    const {
      colCount: frozenColCount,
      trailingColCount: frozenTrailingColCount,
    } = this.headerConfig.spreadsheet.options.frozen!;

    if (frozenColCount) {
      this.frozenColGroup = this.appendChild(
        new Group({
          name: KEY_GROUP_COL_FROZEN,
          style: { zIndex: FRONT_GROUND_GROUP_COL_FROZEN_Z_INDEX },
        }),
      );
    }

    if (frozenTrailingColCount) {
      this.frozenTrailingColGroup = this.appendChild(
        new Group({
          name: KEY_GROUP_COL_FROZEN_TRAILING,
          style: { zIndex: FRONT_GROUND_GROUP_COL_FROZEN_Z_INDEX },
        }),
      );
    }
  }

  protected isFrozenCell(meta: Node) {
    const { spreadsheet } = this.headerConfig;
    const {
      colCount: frozenColCount = 0,
      trailingColCount: frozenTrailingColCount = 0,
    } = spreadsheet.options.frozen!;
    const { colIndex } = meta;
    const colLeafNodes = spreadsheet.facet.getColLeafNodes();

    return (
      isFrozenCol(colIndex, frozenColCount) ||
      isFrozenTrailingCol(colIndex, frozenTrailingColCount, colLeafNodes.length)
    );
  }

  public clear() {
    super.clear();

    this.frozenTrailingColGroup?.removeChildren();
    this.frozenColGroup?.removeChildren();

    const { spreadsheet } = this.headerConfig;
    // 额外清除冻结列的 Resizer Area
    const resizerArea =
      spreadsheet.facet?.foregroundGroup.getElementById<Group>(
        KEY_GROUP_FROZEN_COL_RESIZE_AREA,
      );

    resizerArea?.removeChildren();
  }

  private getColFrozenOptionsByNode(node: Node) {
    const { spreadsheet } = this.headerConfig;
    const { colCount = 0, trailingColCount = 0 } = spreadsheet.options.frozen!;

    const leftLeafNode = getLeftLeafNode(node);
    const topLevelNodes = spreadsheet.facet.getColNodes(0);

    const {
      colCount: frozenColCount,
      trailingColCount: frozenTrailingColCount,
    } = getFrozenLeafNodesCount(topLevelNodes, colCount, trailingColCount);

    return {
      leftLeafNodeColIndex: leftLeafNode.colIndex,
      frozenColCount,
      frozenTrailingColCount,
      colLength: topLevelNodes.length,
    };
  }

  protected getCellGroup(node: Node): Group {
    const {
      leftLeafNodeColIndex,
      frozenColCount,
      frozenTrailingColCount,
      colLength,
    } = this.getColFrozenOptionsByNode(node);

    if (isFrozenCol(leftLeafNodeColIndex, frozenColCount)) {
      return this.frozenColGroup;
    }

    if (
      isFrozenTrailingCol(
        leftLeafNodeColIndex,
        frozenTrailingColCount,
        colLength,
      )
    ) {
      return this.frozenTrailingColGroup;
    }

    return this.scrollGroup;
  }

  protected isColCellInRect(node: Node): boolean {
    const {
      leftLeafNodeColIndex,
      frozenColCount,
      frozenTrailingColCount,
      colLength,
    } = this.getColFrozenOptionsByNode(node);

    if (
      isFrozenCol(leftLeafNodeColIndex, frozenColCount) ||
      isFrozenTrailingCol(
        leftLeafNodeColIndex,
        frozenTrailingColCount,
        colLength,
      )
    ) {
      return true;
    }

    return super.isColCellInRect(node);
  }

  public getScrollGroupClipBBox = (): RectStyleProps => {
    const { width, height, spreadsheet } = this.headerConfig;
    const topLevelNodes = spreadsheet.facet.getColNodes(0);
    const { frozenColWidth, frozenTrailingColWidth } = getFrozenColWidth(
      topLevelNodes,
      spreadsheet.options.frozen!,
    );
    const scrollGroupWidth = width - frozenColWidth - frozenTrailingColWidth;

    return {
      x: frozenColWidth,
      y: 0,
      width: scrollGroupWidth,
      height,
    };
  };

  protected override offset() {
    super.offset();

    const { position } = this.headerConfig;

    translateGroupX(this.frozenColGroup, position.x);
    translateGroupX(this.frozenTrailingColGroup, position.x);
  }

  protected clip(): void {
    this.scrollGroup.style.clipPath = new Rect({
      style: this.getScrollGroupClipBBox(),
    });
  }
}
