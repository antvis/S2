import { get }from 'lodash';
import { DataItem, TooltipOptions } from '../index';
import { DataCell } from '../cell';
import BaseSpreadSheet from '../sheet-type/base-spread-sheet';
import { BaseInteraction } from './base';
import { ShowProps } from '../common/tooltip/interface';

/**
 * Base interaction for that contains hover&tooltips behaviors,
 * in most custom situation,use #BaseInteraction instead
 */
export class HoverInteraction extends BaseInteraction {
  constructor(spreadsheet: BaseSpreadSheet) {
    super(spreadsheet);
  }

  protected hide = () => {
    this.hideTooltip();
  };

  // protected showHoverBox(cells: Cell[]) {
  //   this.hideHoverBox();
  //   cells.forEach((cell: Cell) => {
  //     const { x, y, width, height } = cell.getInteractiveBgShape().attr();
  //     // 往内缩一个像素，避免和外边框重叠
  //     const margin = 1;
  //     this.spreadsheet.hoverBoxGroup.addShape('rect', {
  //       name: 'hoverBox',
  //       attrs: {
  //         x: x + margin,
  //         y: +y + margin,
  //         width: width - margin * 2,
  //         height: height - margin * 2,
  //         stroke: '#000',
  //         zIndex: 999,
  //       },
  //       zIndex: 999,
  //       capture: false, // 鼠标悬浮到 cell 上时，会添加 hoverBox，但继续 mousemove 会命中 hoverBox，所以去掉事件
  //     });
  //   });
  //   this.spreadsheet.panelGroup.sort();
  // }

  // protected hideHoverBox() {
  //   if (get(this.spreadsheet, 'hoverBoxGroup')) {
  //     this.spreadsheet.hoverBoxGroup.clear();
  //   }
  // }

  protected showTooltip(showOptions: ShowProps) {
    if (get(this, 'spreadsheet.options.tooltip.showTooltip')) {
      this.spreadsheet.tooltip.show(showOptions);
    }
  }

  protected hideTooltip() {
    this.spreadsheet.tooltip.hide();
  }

  protected bindEvents() {
    super.bindEvents();
  }
}
