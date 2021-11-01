import { IGroup } from '@antv/g-base';
import { isFrozenCol, isFrozenTrailingCol } from 'src/facet/utils';
import { ColHeader, ColHeaderConfig } from './col';
import {
  KEY_GROUP_COL_RESIZE_AREA,
  KEY_GROUP_FROZEN_COL_RESIZE_AREA,
  SERIES_NUMBER_FIELD,
  KEY_GROUP_COL_FROZEN,
  KEY_GROUP_COL_FROZEN_TRAILING,
  FRONT_GROUND_GROUP_COL_FROZEN_Z_INDEX,
} from '@/common/constant';
import { TableColCell, TableCornerCell } from '@/cell';
import { Node } from '@/facet/layout/node';
import { SpreadSheet } from '@/sheet-type/index';

/**
 * Column Header for SpreadSheet
 */
export class TableColHeader extends ColHeader {
  protected frozenColGroup: IGroup;

  protected frozenTrailingColGroup: IGroup;

  constructor(cfg: ColHeaderConfig) {
    super(cfg);
    const { frozenColCount, frozenTrailingColCount } =
      this.headerConfig.spreadsheet?.options;

    if (frozenColCount) {
      this.frozenColGroup = this.addGroup({
        name: KEY_GROUP_COL_FROZEN,
        zIndex: FRONT_GROUND_GROUP_COL_FROZEN_Z_INDEX,
      });
    }

    if (frozenTrailingColCount) {
      this.frozenTrailingColGroup = this.addGroup({
        name: KEY_GROUP_COL_FROZEN_TRAILING,
        zIndex: FRONT_GROUND_GROUP_COL_FROZEN_Z_INDEX,
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
    let cell;
    if (item.field === SERIES_NUMBER_FIELD) {
      cell = new TableCornerCell(item, spreadsheet, headerConfig);
    } else {
      cell = new TableColCell(item, spreadsheet, headerConfig);
    }
    return cell;
  }

  protected getCellGroup(node: Node) {
    const { spreadsheet } = this.headerConfig;
    const { frozenColCount, frozenTrailingColCount } = spreadsheet?.options;
    const colLength = spreadsheet?.facet?.layoutResult.colLeafNodes.length;

    if (isFrozenCol(node.colIndex, frozenColCount)) {
      return this.frozenColGroup;
    }
    if (isFrozenTrailingCol(node.colIndex, frozenTrailingColCount, colLength)) {
      return this.frozenTrailingColGroup;
    }

    return this.scrollGroup;
  }

  protected isColCellInRect(item: Node): boolean {
    const { spreadsheet } = this.headerConfig;
    const { frozenColCount, frozenTrailingColCount } = spreadsheet?.options;
    const colLength = spreadsheet?.facet?.layoutResult.colLeafNodes.length;

    if (
      isFrozenCol(item.colIndex, frozenColCount) ||
      isFrozenTrailingCol(item.colIndex, frozenTrailingColCount, colLength)
    ) {
      return true;
    }

    return super.isColCellInRect(item);
  }

  protected clip(): void {
    const { width, height, scrollX, spreadsheet } = this.headerConfig;
    const { frozenColCount, frozenTrailingColCount } = spreadsheet.options;
    const colLeafNodes = spreadsheet.facet?.layoutResult.colLeafNodes;

    let frozenColWidth = 0;
    let frozenTrailingColWidth = 0;
    for (let i = 0; i < frozenColCount; i++) {
      frozenColWidth += colLeafNodes[i].width;
    }

    for (let i = 0; i < frozenTrailingColCount; i++) {
      frozenTrailingColWidth += colLeafNodes[colLeafNodes.length - 1 - i].width;
    }

    const frozenClipWidth = width - frozenColWidth - frozenTrailingColWidth;

    this.scrollGroup.setClip({
      type: 'rect',
      attrs: {
        x: scrollX + frozenColWidth,
        y: 0,
        width: frozenClipWidth,
        height,
      },
    });

    const prevResizeArea = spreadsheet.foregroundGroup.findById(
      KEY_GROUP_COL_RESIZE_AREA,
    );

    if (prevResizeArea) {
      const resizeAreaSize = spreadsheet.theme.resizeArea?.size ?? 0;
      const { x, y } = prevResizeArea.getBBox();
      prevResizeArea.setClip({
        type: 'rect',
        attrs: {
          x,
          y,
          width: width - x - frozenTrailingColWidth + resizeAreaSize,
          height,
        },
      });
    }
  }
}
