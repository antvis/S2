import { Group, Rect, type RectStyleProps } from '@antv/g';
import { TableColCell, TableCornerCell } from '../../cell';
import {
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
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

  private initFrozenColGroups() {
    const headerConfig = this.getHeaderConfig();
    const {
      colCount: frozenColCount,
      trailingColCount: frozenTrailingColCount,
    } = headerConfig.spreadsheet.options.frozen!;

    if (frozenColCount) {
      this.frozenColGroup = this.appendChild(
        new Group({
          name: KEY_GROUP_COL_FROZEN,
          style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
        }),
      );
    }

    if (frozenTrailingColCount) {
      this.frozenTrailingColGroup = this.appendChild(
        new Group({
          name: KEY_GROUP_COL_FROZEN_TRAILING,
          style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
        }),
      );
    }
  }

  public clear() {
    super.clear();
    this.frozenTrailingColGroup?.removeChildren();
    this.frozenColGroup?.removeChildren();

    const { spreadsheet } = this.getHeaderConfig();
    // 额外清除冻结列的 Resizer Area
    const resizerArea =
      spreadsheet.facet?.foregroundGroup.getElementById<Group>(
        KEY_GROUP_FROZEN_COL_RESIZE_AREA,
      );

    resizerArea?.removeChildren();
  }

  private getColFrozenOptionsByNode(node: Node) {
    const { spreadsheet } = this.getHeaderConfig();
    const { colCount = 0, trailingColCount = 0 } = spreadsheet.options.frozen!;

    const leftLeafNode = getLeftLeafNode(node);
    const topLevelNodes = spreadsheet.facet.getColNodes(0);

    return {
      colLength: topLevelNodes.length,
      leftLeafNodeColIndex: leftLeafNode.colIndex,
      ...getFrozenLeafNodesCount(topLevelNodes, colCount, trailingColCount),
    };
  }

  protected getCellGroup(node: Node): Group {
    const { colLength, leftLeafNodeColIndex, colCount, trailingColCount } =
      this.getColFrozenOptionsByNode(node);

    if (isFrozenCol(leftLeafNodeColIndex, colCount)) {
      return this.frozenColGroup;
    }

    if (
      isFrozenTrailingCol(leftLeafNodeColIndex, trailingColCount, colLength)
    ) {
      return this.frozenTrailingColGroup;
    }

    return this.scrollGroup;
  }

  protected isColCellInRect(node: Node): boolean {
    const { leftLeafNodeColIndex, colLength, colCount, trailingColCount } =
      this.getColFrozenOptionsByNode(node);

    if (
      isFrozenCol(leftLeafNodeColIndex, colCount) ||
      isFrozenTrailingCol(leftLeafNodeColIndex, trailingColCount, colLength)
    ) {
      return true;
    }

    return super.isColCellInRect(node);
  }

  public getScrollGroupClipBBox = (): RectStyleProps => {
    const { width, height, spreadsheet } = this.getHeaderConfig();
    const topLevelNodes = spreadsheet.facet.getColNodes(0);
    const { colWidth, trailingColWidth } = getFrozenColWidth(
      topLevelNodes,
      spreadsheet.options.frozen!,
    );
    const scrollGroupWidth = width - colWidth - trailingColWidth;

    return {
      x: colWidth,
      y: 0,
      width: scrollGroupWidth,
      height,
    };
  };

  protected override offset() {
    super.offset();

    const { position } = this.getHeaderConfig();

    translateGroupX(this.frozenColGroup, position.x);
    translateGroupX(this.frozenTrailingColGroup, position.x);
  }

  protected clip(): void {
    this.scrollGroup.style.clipPath = new Rect({
      style: this.getScrollGroupClipBBox(),
    });
  }
}
