import type { IGroup } from '@antv/g-canvas';
import { TableColCell, TableCornerCell } from '../../cell';
import {
  FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
  KEY_GROUP_COL_FROZEN,
  KEY_GROUP_COL_FROZEN_TRAILING,
  KEY_GROUP_FROZEN_COL_RESIZE_AREA,
  SERIES_NUMBER_FIELD,
} from '../../common/constant';
import type { SpreadSheet } from '../../sheet-type';
import { getValidFrozenOptions } from '../../utils/layout/frozen';
import type { Node } from '../layout/node';
import {
  isFrozenCol,
  isFrozenTrailingCol,
  isTopLevelNode,
  getFrozenLeafNodesCount,
  getLeftLeafNode,
} from '../utils';
import { ColHeader, type ColHeaderConfig } from './col';

/**
 * Column Header for SpreadSheet
 */
export class TableColHeader extends ColHeader {
  public frozenColGroup: IGroup;

  public frozenTrailingColGroup: IGroup;

  constructor(cfg: ColHeaderConfig) {
    super(cfg);
    const { frozenColCount, frozenTrailingColCount } =
      this.headerConfig.spreadsheet?.options;

    if (frozenColCount) {
      this.frozenColGroup = this.addGroup({
        name: KEY_GROUP_COL_FROZEN,
        zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
      });
    }

    if (frozenTrailingColCount) {
      this.frozenTrailingColGroup = this.addGroup({
        name: KEY_GROUP_COL_FROZEN_TRAILING,
        zIndex: FRONT_GROUND_GROUP_FROZEN_Z_INDEX,
      });
    }
  }

  protected isFrozenCell(meta: Node) {
    const { spreadsheet } = this.headerConfig;
    const { frozenColCount, frozenTrailingColCount } = spreadsheet?.options;
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
    this.frozenTrailingColGroup?.clear();
    this.frozenColGroup?.clear();
    // 额外清除冻结列的 Resizer Area
    const resizerArea = spreadsheet?.foregroundGroup.findById(
      KEY_GROUP_FROZEN_COL_RESIZE_AREA,
    ) as unknown as IGroup;
    resizerArea?.clear();
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
    const { frozenColCount, frozenTrailingColCount } = spreadsheet?.options;
    const topLevelNodes = spreadsheet?.facet?.layoutResult.colNodes.filter(
      (cell) => {
        return isTopLevelNode(cell);
      },
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
    const { frozenColCount, frozenTrailingColCount } = spreadsheet?.options;
    const colLength = spreadsheet?.facet?.layoutResult.colLeafNodes.length;
    const topLevelNodes = spreadsheet?.facet?.layoutResult.colNodes.filter(
      (cell) => {
        return isTopLevelNode(cell);
      },
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
    const { width, height, scrollX, spreadsheet } = this.headerConfig;
    const options = spreadsheet.options;
    if (!options.frozenColCount && !options.frozenTrailingColCount) {
      return {
        x: scrollX,
        y: 0,
        width,
        height,
      };
    }

    const colLeafNodes = spreadsheet.facet?.layoutResult.colLeafNodes;
    const { frozenColCount, frozenTrailingColCount } = getValidFrozenOptions(
      spreadsheet.options,
      colLeafNodes.length,
    );

    let frozenColWidth = 0;
    let frozenTrailingColWidth = 0;
    for (let i = 0; i < frozenColCount; i++) {
      frozenColWidth += colLeafNodes[i].width;
    }

    for (let i = 0; i < frozenTrailingColCount; i++) {
      frozenTrailingColWidth += colLeafNodes[colLeafNodes.length - 1 - i].width;
    }

    const frozenClipWidth = width - frozenColWidth - frozenTrailingColWidth;

    return {
      x: scrollX + frozenColWidth,
      y: 0,
      width: frozenClipWidth,
      height,
    };
  };

  protected clip(): void {
    this.scrollGroup.setClip({
      type: 'rect',
      attrs: this.getScrollGroupClipBBox(),
    });
  }
}
