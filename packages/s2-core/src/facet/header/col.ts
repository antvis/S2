import { each, isEmpty } from 'lodash';
import { SERIES_NUMBER_FIELD } from 'src/common/constant';
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
  // TODO type define
  constructor(cfg: ColHeaderConfig) {
    super(cfg);
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
    this.setClip({
      type: 'rect',
      attrs: {
        x: spreadsheet.freezeRowHeader() ? scrollX : 0,
        y: 0,
        width: width + (spreadsheet.freezeRowHeader() ? 0 : scrollX),
        height,
      },
    });
  }

  protected layout() {
    const { data, spreadsheet, cornerWidth, width, scrollX } =
      this.headerConfig;

    const colCell = spreadsheet?.facet?.cfg?.colCell;
    // don't care about scrollY, because there is only freeze col-header exist
    const colCellInRect = (item: Node): boolean => {
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
        this.add(cell);
      }
    });
  }

  protected offset() {
    const { position, scrollX } = this.headerConfig;
    // 暂时不考虑移动y
    translateGroup(this, position.x - scrollX, 0);
  }
}
