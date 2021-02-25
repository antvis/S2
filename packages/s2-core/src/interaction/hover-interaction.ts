import { Point } from '@antv/g-canvas';
import * as _ from 'lodash';
import { DataItem, TooltipOptions } from '../index';
import { DataCell } from '../cell';
import BaseSpreadSheet from '../sheet-type/base-spread-sheet';
import { BaseInteraction } from './base';

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
    // this.hideHoverBox();
  };

  // protected showHoverBox(cells: DataCell[]) {
  //   // this.hideHoverBox();
  //   cells.forEach((cell: DataCell) => {
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
  //   if (_.get(this.spreadsheet, 'hoverBoxGroup')) {
  //     this.spreadsheet.hoverBoxGroup.clear();
  //   }
  // }

  protected showTooltip(
    position: Point,
    hoverData?: DataItem,
    options?: TooltipOptions,
  ) {
    if (!_.get(this, 'spreadsheet.options.hideTooltip')) {
      this.spreadsheet.tooltip.show(position, hoverData, options);
    }
  }

  protected hideTooltip() {
    this.spreadsheet.tooltip.hide();
  }

  protected bindEvents() {
    super.bindEvents();
  }
}
