import { Group, Rect, type RectStyleProps } from '@antv/g';
import { TableColCell, TableCornerCell } from '../../cell';
import {
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  FrozenGroupType,
  KEY_GROUP_COL_FROZEN,
  KEY_GROUP_COL_FROZEN_TRAILING,
  KEY_GROUP_FROZEN_COL_RESIZE_AREA,
  SERIES_NUMBER_FIELD,
} from '../../common/constant';
import type { SpreadSheet } from '../../sheet-type';
import type { Node } from '../layout/node';
import {
  getFrozenLeafNodesCount,
  getLeftLeafNode,
  isFrozenCol,
  isFrozenTrailingCol,
  translateGroupX,
} from '../utils';
import type { FrozenFacet } from '../frozen-facet';
import { ColHeader } from './col';
import type { ColHeaderConfig } from './interface';

/**
 * Column Header for SpreadSheet
 */
export class TableColHeader extends ColHeader {
  public frozenColGroup: Group;

  public frozenTrailingColGroup: Group;

  private finalColCount: number;

  private finalTrailingColCount: number;

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

  private initFrozenColGroups() {
    const headerConfig = this.getHeaderConfig();
    const {
      colCount: frozenColCount,
      trailingColCount: frozenTrailingColCount,
    } = headerConfig.spreadsheet.options.frozen!;

    const topLevelNodes = headerConfig.spreadsheet.facet.getColNodes(0);
    const { colCount, trailingColCount } = getFrozenLeafNodesCount(
      topLevelNodes,
      frozenColCount!,
      frozenTrailingColCount!,
    );

    this.finalColCount = colCount;
    this.finalTrailingColCount = trailingColCount;
    this.topLevelColNodeLength = topLevelNodes.length;

    if (colCount) {
      this.frozenColGroup = this.appendChild(
        new Group({
          name: KEY_GROUP_COL_FROZEN,
          style: { zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX },
        }),
      );
    }

    if (trailingColCount) {
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
    const leftLeafNode = getLeftLeafNode(node);

    return {
      colLength: this.topLevelColNodeLength,
      leftLeafNodeColIndex: leftLeafNode.colIndex,
      colCount: this.finalColCount,
      trailingColCount: this.finalTrailingColCount,
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
    const { width, height, spreadsheet, position } = this.getHeaderConfig();
    const frozenGroupInfo = (spreadsheet.facet as FrozenFacet).frozenGroupInfo;
    const colWidth = frozenGroupInfo[FrozenGroupType.FROZEN_COL].width;
    const trailingColWidth =
      frozenGroupInfo[FrozenGroupType.FROZEN_TRAILING_COL].width;
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
