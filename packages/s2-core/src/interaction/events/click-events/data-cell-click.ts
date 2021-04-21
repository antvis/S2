import { BaseEvent } from '../base-event';
import { S2Event, DefaultInterceptEventType } from '../types';
import { Event } from '@antv/g-canvas';
import { get, noop, set } from 'lodash';
import { ViewMeta } from '../../../common/interface';
import { LineChartOutlined } from '@ant-design/icons';
import { StateName } from '../../../state/state';
import { getTooltipData } from '../../../utils/tooltip';

export class DataCellClick extends BaseEvent {
  protected bindEvents() {
    this.bindDataCellClick();
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.DATACELL_CLICK, (ev: Event) => {
      ev.stopPropagation();
      if (
        this.spreadsheet.interceptEvent.has(
          DefaultInterceptEventType.CLICK,
        )
      ) {
        return;
      }
      const cell = this.spreadsheet.getCell(ev.target);
      const meta = cell.getMeta();
      if (meta) {
        // selected通过state来接管，不需要再在 this.spreadsheet.store 中操作
        this.spreadsheet.clearStyleIndependent();
        const currentState = this.spreadsheet.getCurrentState();
        if (
          currentState.stateName === StateName.SELECTED &&
          currentState.cells.indexOf(cell) > -1
        ) {
          // 点击当前已选cell 则取消当前cell的选中状态
          // 这里的clearState虽然在if和eles里都有，但是不要抽出来，因为需要先判断在清空
          // 且else中需要先清空之前选择的cell，然后再赋值新的
          this.spreadsheet.clearState();
          this.spreadsheet.interceptEvent.clear();
          this.spreadsheet.hideTooltip();
        } else {
          this.spreadsheet.clearState();
          this.spreadsheet.setState(cell, StateName.SELECTED);
          this.spreadsheet.updateCellStyleByState();
          this.spreadsheet.interceptEvent.add(
            DefaultInterceptEventType.HOVER,
          );
          this.handleTooltip(ev, meta);
        }

        this.draw();
      }
    });
  }

  // 处理tooltip
  private handleTooltip(ev: Event, meta: ViewMeta) {
    const position = {
      x: ev.clientX,
      y: ev.clientY,
    };
    const currentCellMeta = get(meta, 'data.0');
    const isTotals = get(meta, 'isTotals', false);
    if (isTotals && this.spreadsheet.isStrategyMode()) {
      return;
    }

    const cellOperator = this.spreadsheet.options?.cellOperator;

    let operator = this.spreadsheet.options?.showTrend
      ? {
          onClick: (params) => {
            if (params === 'showTrend') {
              // 展示趋势点击
              this.spreadsheet.emit('spread-trend-click', meta);
              // 隐藏tooltip
              this.spreadsheet.hideTooltip();
            }
          },
          menus: [
            {
              id: 'showTrend',
              text: '趋势',
              icon: LineChartOutlined,
            },
          ],
        }
      : {
          onClick: noop,
          menus: [],
        };
    if (cellOperator) {
      operator = cellOperator;
    }
    const options = {
      isTotals,
      operator,
      enterable: true,
      hideSummary: true,
    };

    const tooltipData = getTooltipData(
      this.spreadsheet,
      [currentCellMeta],
      options,
    );
    const showOptions = {
      position,
      data: tooltipData,
      options,
    };
    this.spreadsheet.showTooltip(showOptions);
  }
}
