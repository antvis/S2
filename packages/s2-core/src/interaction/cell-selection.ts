import { wrapBehavior } from '@antv/util';
import { S2Event, DefaultEventType } from './events/types';
// import { isSelected } from '../utils/selected';
import { DataCell } from '../cell';
import { Event } from '@antv/g-canvas';
import { get, noop, includes } from 'lodash';
import BaseSpreadSheet from '../sheet-type/base-spread-sheet';
import { BaseInteraction } from './base';
import { ViewMeta } from '../common/interface';
import { LineChartOutlined } from '@ant-design/icons';
import { StateName } from '../state/state'
import { getTooltipData } from '../utils/tooltip';

/**
 * Panel Area's DataCell Click Interaction
 */
export class CellSelection extends BaseInteraction {

  constructor(spreadsheet: BaseSpreadSheet) {
    super(spreadsheet);
  }

  protected bindEvents() {
    super.bindEvents();
    this.bindClick();
    this.addEventListener(
      document,
      'click',
      wrapBehavior(this, '_onDocumentClick')
    );
  }

  private bindClick() {
    this.spreadsheet.on(S2Event.DATACELL_CLICK, (ev: Event) => {
      ev.stopPropagation();
      // 说明是mouseDown后按住鼠标移动，这种行为是刷选
      // 刷选看 ---> brush-select
      const meta = this.getMetaInCell(ev.target);
      if (meta) {
        // selected通过state来接管，不需要再在 this.spreadsheet.store 中操作
        const cell = this.spreadsheet.eventController.getCell(ev.target);
        const currentState = this.spreadsheet.getCurrentState();
        if (currentState.stateName === 'selectedCol') {
          this.spreadsheet.getPanelAllCells().forEach((cell) => {
            cell.hideShapeUnderState();
          });
        }
        this.spreadsheet.clearState();
        this.spreadsheet.setState(cell, StateName.SELECTED);
        this.spreadsheet.updateCellStyleByState();
        this.spreadsheet.eventController.interceptEvent.add(DefaultEventType.HOVER);
        this.draw();

        // const position = {
        //   x: ev.clientX,
        //   y: ev.clientY,
        // };
        // const hoveringCellData = get(meta, 'data.0');
        // const isTotals = get(meta, 'isTotals', false);
        // if (isTotals && this.spreadsheet.isStrategyMode()) {
        //   return;
        // }
        // const cellOperator = this.spreadsheet.options?.cellOperator;
        // let operator = this.spreadsheet.options?.showTrend
        //   ? {
        //       onClick: (params) => {
        //         if (params === 'showTrend') {
        //           // 展示趋势点击
        //           this.spreadsheet.emit('spread-trend-click', meta);
        //           // 隐藏tooltip
        //           this.hide();
        //         }
        //       },
        //       menus: [
        //         {
        //           id: 'showTrend',
        //           text: '趋势',
        //           icon: LineChartOutlined,
        //         },
        //       ],
        //     }
        //   : {
        //       onClick: noop,
        //       menus: [],
        //     };
        // if (cellOperator) {
        //   operator = cellOperator;
        // }
        // const options = {
        //   isTotals,
        //   operator,
        // };
        // const tooltipData = getTooltipData(
        //   this.spreadsheet,
        //   hoveringCellData,
        //   options,
        // );
        // const showOptions = {
        //   position,
        //   data: tooltipData,
        //   options,
        // };
        // this.showTooltip(showOptions);
      }
    })
  }

  private getMetaInCell(target): ViewMeta {
    let cell = target;
    if (cell instanceof DataCell) {
      return cell.getMeta();
    } else {
      if (cell) {
        return this.getMetaInCell(cell.get('parent'));
      } else {
        return null;
      }
    }
  }

  private _onDocumentClick(ev) {
    if (
      ev.target !== this.spreadsheet.container.get('el') &&
      !includes(ev.target?.className, 'eva-facet') &&
      !includes(ev.target?.className, 'ant-menu') &&
      !includes(ev.target?.className, 'ant-input')
    ) {
      this.spreadsheet.clearState();
      this.draw();
      // this.hide();
    }
  }
}
