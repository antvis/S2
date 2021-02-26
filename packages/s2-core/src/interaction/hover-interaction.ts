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
  };

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
