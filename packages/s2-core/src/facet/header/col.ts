import { Group, Shape } from '@antv/g-canvas';
import * as _ from 'lodash';
import { Formatter, SortParam } from '../../common/interface';
import { isHeaderCellInViewport } from '../../utils/is-header-cell-in-viewport';
import { ColCell, DetailColCell } from '../../cell';
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
   * @param cornerWidth only has real meaning when scroll contains rowHeader
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
        x: spreadsheet.freezeRowHeader() ? 0 : scrollX,
        y: 0,
        width: width + (spreadsheet.freezeRowHeader() ? scrollX : 0),
        height,
      },
    });
  }

  protected layout() {
    const {
      data,
      spreadsheet,
      offset,
      cornerWidth,
      width,
      height,
      scrollX,
      scrollY,
    } = this.headerConfig;
    const colCell = spreadsheet?.facet?.cfg?.colCell;
    // don't care about scrollY, because there is only freeze col-header exist
    const colCellInRect = (item: Node): boolean => {
      return (
        width + scrollX > item.x &&
        scrollX - (spreadsheet.freezeRowHeader() ? cornerWidth : 0) <
          item.x + item.width
      );
    };
    _.each(data, (item: Node) => {
      if (colCellInRect(item)) {
        let cell: Group;
        if (colCell) {
          cell = colCell(item, spreadsheet, this.headerConfig);
        }
        if (_.isEmpty(cell)) {
          if (spreadsheet.isSpreadsheetType()) {
            cell = new ColCell(item, spreadsheet, this.headerConfig);
          } else {
            cell = new DetailColCell(item, spreadsheet, this.headerConfig);
          }
        }
        item.belongsCell = cell;
        this.add(cell);
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
    translateGroup(this, position.x - scrollX, 0);
  }
}
