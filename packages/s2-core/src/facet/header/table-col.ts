import { Group, Rect } from '@antv/g';
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
  isFrozenCol,
  isFrozenTrailingCol,
  isTopLevelNode,
  getFrozenLeafNodesCount,
  getLeftLeafNode,
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
    const {
      colCount: frozenColCount,
      trailingColCount: frozenTrailingColCount,
    } = this.headerConfig.spreadsheet?.options.frozen!;

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
    } = this.headerConfig.spreadsheet?.options.frozen!;
    const { colIndex } = meta;
    const colLeafNodes = spreadsheet?.facet.layoutResult.colLeafNodes;

    return (
      isFrozenCol(colIndex, frozenColCount) ||
      isFrozenTrailingCol(colIndex, frozenTrailingColCount, colLeafNodes.length)
    );
  }

  public clear() {
    const { spreadsheet } = this.headerConfig;

    super.clear();
    this.frozenTrailingColGroup?.removeChildren();
    this.frozenColGroup?.removeChildren();
    // 额外清除冻结列的 Resizer Area
    const resizerArea = spreadsheet.facet?.foregroundGroup.getElementById(
      KEY_GROUP_FROZEN_COL_RESIZE_AREA,
    ) as unknown as Group;

    resizerArea?.removeChildren();
  }

  protected getCellInstance(
    item: Node,
    spreadsheet: SpreadSheet,
    headerConfig: ColHeaderConfig,
  ) {
    return item.field === SERIES_NUMBER_FIELD
      ? new TableCornerCell(item, spreadsheet, headerConfig)
      : new TableColCell(item, spreadsheet, headerConfig);
  }

  protected getCellGroup(node: Node) {
    const { spreadsheet } = this.headerConfig;
    const {
      colCount: frozenColCount = 0,
      trailingColCount: frozenTrailingColCount = 0,
    } = this.headerConfig.spreadsheet?.options.frozen!;
    const topLevelNodes = spreadsheet?.facet?.layoutResult.colNodes.filter(
      (cell) => isTopLevelNode(cell),
    );
    const { colCount, trailingColCount } = getFrozenLeafNodesCount(
      topLevelNodes,
      frozenColCount,
      frozenTrailingColCount,
    );

    if (isFrozenCol(getLeftLeafNode(node).colIndex, colCount)) {
      return this.frozenColGroup;
    }

    if (
      isFrozenTrailingCol(
        getLeftLeafNode(node).colIndex,
        trailingColCount,
        spreadsheet?.facet?.layoutResult.colLeafNodes.length,
      )
    ) {
      return this.frozenTrailingColGroup;
    }

    return this.scrollGroup;
  }

  protected isColCellInRect(item: Node): boolean {
    const { spreadsheet } = this.headerConfig;
    const {
      colCount: frozenColCount = 0,
      trailingColCount: frozenTrailingColCount = 0,
    } = spreadsheet?.options.frozen!;
    const colLength = spreadsheet?.facet?.layoutResult.colLeafNodes.length;
    const topLevelNodes = spreadsheet?.facet?.layoutResult.colNodes.filter(
      (cell) => isTopLevelNode(cell),
    );
    const { colCount, trailingColCount } = getFrozenLeafNodesCount(
      topLevelNodes,
      frozenColCount,
      frozenTrailingColCount,
    );

    if (
      isFrozenCol(getLeftLeafNode(item).colIndex, colCount) ||
      isFrozenTrailingCol(
        getLeftLeafNode(item).colIndex,
        trailingColCount,
        colLength,
      )
    ) {
      return true;
    }

    return super.isColCellInRect(item);
  }

  public getScrollGroupClipBBox = () => {
    const { width, height, spreadsheet } = this.headerConfig;

    const colLeafNodes = spreadsheet.facet?.layoutResult.colLeafNodes;
    const frozenWidth = getFrozenColWidth(
      colLeafNodes,
      spreadsheet.options.frozen!,
    );

    return {
      x: frozenWidth.frozenColWidth,
      y: 0,
      width:
        width - frozenWidth.frozenColWidth - frozenWidth.frozenTrailingColWidth,
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
