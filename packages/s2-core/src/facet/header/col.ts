import { each, isEmpty } from 'lodash';
import { IGroup, IShape } from '@antv/g-base';
import {
  SERIES_NUMBER_FIELD,
  KEY_GROUP_COL_FROZEN,
  KEY_GROUP_COL_SCROLL,
  KEY_GROUP_COL_FROZEN_TRAILING,
} from 'src/common/constant';
import { Formatter, S2CellType, SortParam } from '../../common/interface';
import { ColCell, TableColCell, TableCornerCell } from '../../cell';
import { Node } from '../..';
import { BaseHeader, BaseHeaderConfig } from './base';
import { translateGroup } from '../utils';

export interface ColHeaderConfig extends BaseHeaderConfig {
  // format field value
  formatter: (field: string) => Formatter;
  // col leaf node sort params
  sortParam: SortParam;
  // corner width used when scroll {@link ColHeader#onColScroll}
  cornerWidth?: number;
  scrollContainsRowHeader?: boolean;
}

/**
 * Column Header for SpreadSheet
 */
export class ColHeader extends BaseHeader<ColHeaderConfig> {
  protected frozenColGroup: IGroup;

  protected frozenTrailingColGroup: IGroup;

  protected scrollGroup: IGroup;

  protected background: IShape;

  // TODO type define
  constructor(cfg: ColHeaderConfig) {
    super(cfg);
    const { frozenColCount, frozenTrailingColCount } =
      this.headerConfig.spreadsheet?.options;

    this.scrollGroup = this.addGroup({
      name: KEY_GROUP_COL_SCROLL,
      zIndex: 2,
    });

    if (frozenColCount) {
      this.frozenColGroup = this.addGroup({
        name: KEY_GROUP_COL_FROZEN,
        zIndex: 3,
      });
    }

    if (frozenTrailingColCount) {
      this.frozenTrailingColGroup = this.addGroup({
        name: KEY_GROUP_COL_FROZEN_TRAILING,
        zIndex: 3,
      });
    }
  }

  /**
   * Make colHeader scroll with hScrollBar
   * @param scrollX horizontal offset
   * @param cornerWidth only has real meaning when scroll contains rowCell
   * @param type
   */
  public onColScroll(scrollX: number, cornerWidth: number, type: string): void {
    // this is works in scroll-keep-text-center feature
    this.headerConfig.offset = scrollX;
    this.headerConfig.scrollX = scrollX;
    this.headerConfig.cornerWidth = cornerWidth || 0;
    this.render(type);
  }

  protected clip(): void {
    const { width, height, scrollX, spreadsheet } = this.headerConfig;

    const { frozenColCount } = spreadsheet.options;
    const colLeafNodes = spreadsheet.facet.layoutResult.colLeafNodes;

    let frozenColWidth = 0;
    if (spreadsheet.isTableMode()) {
      for (let i = 0; i < frozenColCount; i++) {
        frozenColWidth += colLeafNodes[i].width;
      }
    }

    this.scrollGroup.setClip({
      type: 'rect',
      attrs: {
        x: (spreadsheet.freezeRowHeader() ? scrollX : 0) + frozenColWidth,
        y: 0,
        width:
          width +
          (spreadsheet.freezeRowHeader() ? 0 : scrollX) -
          frozenColWidth,
        height,
      },
    });
  }

  public clear() {
    this.frozenTrailingColGroup?.clear();
    this.frozenColGroup?.clear();
    this.scrollGroup.clear();
    this.background?.remove(true);
  }

  protected layout() {
    const { data, spreadsheet, cornerWidth, width, scrollX, height } =
      this.headerConfig;
    const { frozenColCount, frozenTrailingColCount } = spreadsheet?.options;
    const colLength = spreadsheet?.facet.layoutResult.colLeafNodes.length;
    const colCellTheme = this.cfg.spreadsheet.theme.colCell.cell;
    // draw the background

    this.background = this.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
        fill: colCellTheme.backgroundColor,
        stroke: 'transparent',
        opacity: colCellTheme.backgroundColorOpacity,
      },
      zIndex: 1,
    });
    this.sort();

    const colCell = spreadsheet?.facet?.cfg?.colCell;
    // don't care about scrollY, because there is only freeze col-header exist
    const colCellInRect = (item: Node): boolean => {
      if (
        (frozenColCount > 0 && item.colIndex < frozenColCount) ||
        (frozenTrailingColCount > 0 &&
          item.colIndex >= colLength - frozenTrailingColCount)
      ) {
        return true;
      }
      return (
        width + scrollX > item.x &&
        scrollX - (spreadsheet.freezeRowHeader() ? 0 : cornerWidth) <
          item.x + item.width
      );
    };
    each(data, (node: Node) => {
      const item = node;
      if (colCellInRect(item)) {
        let cell: S2CellType;
        if (colCell) {
          cell = colCell(item, spreadsheet, this.headerConfig);
        }

        if (isEmpty(cell)) {
          if (spreadsheet.isPivotMode()) {
            cell = new ColCell(item, spreadsheet, this.headerConfig);
          } else if (item.field === SERIES_NUMBER_FIELD) {
            cell = new TableCornerCell(item, spreadsheet, this.headerConfig);
          } else {
            cell = new TableColCell(item, spreadsheet, this.headerConfig);
          }
        }
        item.belongsCell = cell;

        if (this.headerConfig.spreadsheet.isTableMode()) {
          if (node.colIndex < frozenColCount) {
            this.frozenColGroup.add(cell);
            return;
          }
          if (
            frozenTrailingColCount > 0 &&
            node.colIndex >= colLength - frozenTrailingColCount
          ) {
            this.frozenTrailingColGroup.add(cell);
            return;
          }
        }
        this.scrollGroup.add(cell);
      }
    });
  }

  protected offset() {
    const { position, scrollX } = this.headerConfig;
    // 暂时不考虑移动y
    translateGroup(this.scrollGroup, position.x - scrollX, 0);
  }
}
