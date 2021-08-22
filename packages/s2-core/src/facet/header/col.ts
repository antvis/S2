import { each, isEmpty } from 'lodash';
import { IGroup } from '@antv/g-base';
import { SERIES_NUMBER_FIELD, KEY_GROUP_COL_FROZEN } from 'src/common/constant';
import { Formatter, S2CellType, SortParam } from '../../common/interface';
import { ColCell, DetailColCell, CornerCell } from '../../cell';
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

  protected scrollGroup: IGroup;

  // TODO type define
  constructor(cfg: ColHeaderConfig) {
    super(cfg);
    const { frozenColCount } = this.headerConfig.spreadsheet?.options;

    this.scrollGroup = this.addGroup({
      name: 'scrollsfwe',
      zIndex: 1,
    });

    if (frozenColCount && !this.frozenColGroup) {
      this.frozenColGroup = this.addGroup({
        name: KEY_GROUP_COL_FROZEN,
        zIndex: 2,
      });
    }

    this.sort();
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
    this.scrollGroup.setClip({
      type: 'rect',
      attrs: {
        x: spreadsheet.freezeRowHeader() ? scrollX : 0,
        y: 0,
        width: width + (spreadsheet.freezeRowHeader() ? 0 : scrollX),
        height,
      },
    });
  }

  public clear() {
    this.frozenColGroup?.clear();
    this.scrollGroup.clear();
  }

  protected layout() {
    const {
      data,
      spreadsheet,
      cornerWidth,
      width,
      scrollX,
    } = this.headerConfig;
    const { frozenColCount } = spreadsheet?.options;

    // if (frozenColCount && !this.frozenColGroup) {
    //   this.frozenColGroup = this.addGroup({
    //     name: KEY_GROUP_COL_FROZEN,
    //   });
    // }
    const colCell = spreadsheet?.facet?.cfg?.colCell;
    // don't care about scrollY, because there is only freeze col-header exist
    const colCellInRect = (item: Node): boolean => {
      if (item.colIndex < frozenColCount) {
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
            cell = new CornerCell(item, spreadsheet, this.headerConfig);
          } else {
            cell = new DetailColCell(item, spreadsheet, this.headerConfig);
          }
        }
        item.belongsCell = cell;
        console.log(node.colIndex);
        if (
          node.colIndex < frozenColCount &&
          !this.headerConfig.spreadsheet.isPivotMode()
        ) {
          this.frozenColGroup.add(cell);
        } else {
          this.scrollGroup.add(cell);
        }
      }
    });

    // this.addShape('rect', {
    //   attrs: {
    //     x: scrollX,
    //     y: 0,
    //     width,
    //     height,
    //     fill: '#0ff'
    //   }
    // });
  }

  protected offset() {
    const { position, scrollX } = this.headerConfig;
    // 暂时不考虑移动y
    translateGroup(this.scrollGroup, position.x - scrollX, 0);
  }
}
