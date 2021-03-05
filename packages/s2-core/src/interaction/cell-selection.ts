import { Event, Group } from '@antv/g-canvas';
import * as _ from '@antv/util';
import { S2Event, DefaultEventType } from './events/types';
// import { isSelected } from '../utils/selected';
import { DataCell } from '../cell';
import BaseSpreadSheet from '../sheet-type/base-spread-sheet';
import { BaseInteraction } from './base';
import { ViewMeta } from '../common/interface';
import { LineChartOutlined } from '@ant-design/icons';
import { StateName } from '../state/state'

/**
 * Panel Area's DataCell Click Interaction
 */
export class CellSelection extends BaseInteraction {
  private target;

  constructor(spreadsheet: BaseSpreadSheet) {
    super(spreadsheet);
  }

  protected bindEvents() {
    super.bindEvents();
    this.bindMouseDown();
    this.bindMouseUp();
    this.addEventListener(
      document,
      'click',
      _.wrapBehavior(this, '_onDocumentClick')
    );
  }

  private bindMouseDown() {
    this.spreadsheet.on(S2Event.DATACELL_MOUSEDOWN, ev => {
      this.target = ev.target;
    })
  }

  private bindMouseUp() {
    this.spreadsheet.on(S2Event.DATACELL_CLICK, (ev: Event) => {
      ev.stopPropagation();
      // 说明是mouseDown后按住鼠标移动，这种行为是刷选
      // 刷选看 ---> brush-select
      const meta = this.getMetaInCell(ev.target);
      if (meta) {
        // selected通过state来接管，不需要再在 this.spreadsheet.store 中操作
        const cell = this.spreadsheet.eventController.getCell(ev.target);
        const currentState = this.spreadsheet.getCurrentState();
        console.log('currentState', currentState)
        if (currentState.stateName === 'selectedCol') {
          this.spreadsheet.getPanelAllCells().forEach((cell) => {
            cell.hideShapeUnderState();
          });
        }
        this.spreadsheet.clearState();
        this.spreadsheet.setState(cell, StateName.SELECTED);
        this.spreadsheet.updateCellStyleByState();
        this.spreadsheet.eventController.interceptEvent.add(DefaultEventType.HOVER);

        // const position = {
        //   x: ev.event.clientX,
        //   y: ev.event.clientY,
        // };
        // const hoveringCellData = _.get(meta, 'data.0');
        const isTotals = _.get(meta, 'isTotals', false);

        // 决策模式下的总小计不tooltip
        if (isTotals && this.spreadsheet.isStrategyMode()) {
          return;
        }

        // const cellOperator = this.spreadsheet.options?.cellOperator;
        // let operator = this.spreadsheet.options?.showTrend
        //   ? {
        //       onClick: (params) => {
        //         if (params === 'showTrend') {
        //           // 展示趋势点击
        //           this.spreadsheet.emit('spread-trend-click', meta);
        //           // 隐藏tooltip
        //           // this.hide();
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
        //       onClick: _.noop,
        //       menus: [],
        //     };
        // if (cellOperator) {
        //   operator = cellOperator;
        // }
        // this.showTooltip(position, hoveringCellData, {
        //   actionType: 'cellSelection',
        //   isTotals,
        //   operator,
        // });
      }
      this._updateCell();
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
      !_.contains(ev.target?.className, 'eva-facet') &&
      !_.contains(ev.target?.className, 'ant-menu') &&
      !_.contains(ev.target?.className, 'ant-input')
    ) {
      this.spreadsheet.clearState();
      this.draw();
      // this.hide();
    }
  }

  private _updateCell() {
    // this.spreadsheet.getPanelAllCells((cell) => {
    //   cell.update();
    // });
    this.draw();
  }
}
