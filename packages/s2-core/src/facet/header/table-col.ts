import type { IGroup } from '@antv/g-canvas';
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
import { isFrozenCol, isFrozenTrailingCol, translateGroupX } from '../utils';
import { ColHeader } from './col';
import type { ColHeaderConfig } from './interface';

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
    const { frozenColCount = 0, frozenTrailingColCount = 0 } =
      spreadsheet?.options;
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
    const resizerArea = spreadsheet.facet?.foregroundGroup.findById(
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
    const { frozenColCount = 0, frozenTrailingColCount = 0 } =
      spreadsheet?.options;
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
    const { frozenColCount = 0, frozenTrailingColCount = 0 } =
      spreadsheet?.options;
    const colLength = spreadsheet?.facet?.layoutResult.colLeafNodes.length;

    if (
      isFrozenCol(item.colIndex, frozenColCount) ||
      isFrozenTrailingCol(item.colIndex, frozenTrailingColCount, colLength)
    ) {
      return true;
    }

    return super.isColCellInRect(item);
  }

  public getScrollGroupClipBBox = () => {
    const { width, height, scrollX = 0, spreadsheet } = this.headerConfig;
    const options = spreadsheet.options;

    const colLeafNodes = spreadsheet.facet?.layoutResult.colLeafNodes;
    const frozenWidth = getFrozenColWidth(colLeafNodes, options);
    return {
      x: scrollX + frozenWidth.frozenColWidth,
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
    this.scrollGroup.setClip({
      type: 'rect',
      attrs: this.getScrollGroupClipBBox(),
    });
  }
}
