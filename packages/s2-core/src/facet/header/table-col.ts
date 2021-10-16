import { each, isEmpty } from 'lodash';
import { IGroup, IShape } from '@antv/g-base';
import { translateGroup } from '../utils';
import { BaseHeader, BaseHeaderConfig } from './base';
import { ColHeader, ColHeaderConfig } from './col';
import {
  KEY_GROUP_COL_RESIZE_AREA,
  SERIES_NUMBER_FIELD,
  KEY_GROUP_COL_FROZEN,
  KEY_GROUP_COL_SCROLL,
  KEY_GROUP_COL_FROZEN_TRAILING,
  FRONT_GROUND_GROUP_COL_SCROLL_Z_INDEX,
  FRONT_GROUND_GROUP_COL_FROZEN_Z_INDEX,
} from '@/common/constant';
import { ColCell, TableColCell, TableCornerCell } from '@/cell';
import { Formatter, S2CellType } from '@/common/interface';
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

    if (this.headerConfig.spreadsheet.isTableMode()) {
      if (node.colIndex < frozenColCount) {
        return this.frozenColGroup;
      }
      if (
        frozenTrailingColCount > 0 &&
        node.colIndex >= colLength - frozenTrailingColCount
      ) {
        return this.frozenTrailingColGroup;
      }
    }
  }

  protected isColCellInRect(item: Node): boolean {
    const { spreadsheet } = this.headerConfig;
    const { frozenColCount, frozenTrailingColCount } = spreadsheet?.options;
    const colLength = spreadsheet?.facet?.layoutResult.colLeafNodes.length;

    if (
      (frozenColCount > 0 && item.colIndex < frozenColCount) ||
      (frozenTrailingColCount > 0 &&
        item.colIndex >= colLength - frozenTrailingColCount)
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
    if (spreadsheet.isTableMode()) {
      for (let i = 0; i < frozenColCount; i++) {
        frozenColWidth += colLeafNodes[i].width;
      }

      for (let i = 0; i < frozenTrailingColCount; i++) {
        frozenTrailingColWidth +=
          colLeafNodes[colLeafNodes.length - 1 - i].width;
      }
    }

    this.scrollGroup.setClip({
      type: 'rect',
      attrs: {
        x: (spreadsheet.isFreezeRowHeader() ? scrollX : 0) + frozenColWidth,
        y: 0,
        width:
          width +
          (spreadsheet.isFreezeRowHeader() ? 0 : scrollX) -
          frozenColWidth -
          frozenTrailingColWidth,
        height,
      },
    });

    const prevResizeArea = spreadsheet.foregroundGroup.findById(
      KEY_GROUP_COL_RESIZE_AREA,
    );
    const resizeAreaSize = spreadsheet.theme.resizeArea?.size ?? 0;

    if (prevResizeArea) {
      prevResizeArea.setClip({
        type: 'rect',
        attrs: {
          x: 0 + frozenColWidth,
          y: 0,
          width:
            width +
            (spreadsheet.isFreezeRowHeader() ? 0 : scrollX) -
            frozenColWidth -
            frozenTrailingColWidth +
            resizeAreaSize,
          height,
        },
      });
    }
  }
}
