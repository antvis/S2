import { DefaultInterceptEventType, S2Event } from '@/common/constant';
import {
  InteractionEvent,
  InteractionStateName,
  INTERACTION_TREND,
} from '@/common/constant/interaction';
import {
  S2CellType,
  TooltipOperatorOptions,
  ViewMeta,
} from '@/common/interface';
import { LineChartOutlined } from '@ant-design/icons';
import { Event } from '@antv/g-canvas';
import { noop } from 'lodash';
import { DataCell } from '../../../cell/data-cell';
import { BaseEvent } from '../base-event';

export class DataCellClick extends BaseEvent {
  protected bindEvents() {
    this.bindDataCellClick();
  }

  private bindDataCellClick() {
    this.spreadsheet.on(S2Event.DATA_CELL_CLICK, (event: Event) => {
      event.stopPropagation();
      if (
        this.interaction.interceptEvent.has(DefaultInterceptEventType.CLICK)
      ) {
        return;
      }
      const cell: DataCell = this.spreadsheet.getCell(event.target);
      const meta = cell.getMeta();
      if (meta) {
        // 屏蔽hover事件
        this.interaction.interceptEvent.add(DefaultInterceptEventType.HOVER);
        if (this.interaction.isSelectedCell(cell)) {
          // 点击当前已选cell 则取消当前cell的选中状态
          this.interaction.clearState();
          this.interaction.interceptEvent.clear();
          this.spreadsheet.hideTooltip();
        } else {
          this.interaction.clearState();
          this.interaction.changeState({
            cells: [cell],
            stateName: InteractionStateName.SELECTED,
          });
          this.showTooltip(event, meta);
        }
      }
    });
  }

  private getTooltipOperator(meta: ViewMeta): TooltipOperatorOptions {
    const cellOperator: TooltipOperatorOptions = this.spreadsheet.options
      ?.cellOperator;

    if (cellOperator) {
      return cellOperator;
    }

    const defaultOperator: TooltipOperatorOptions = {
      onClick: noop,
      menus: [],
    };

    const operator: TooltipOperatorOptions = this.spreadsheet.options?.showTrend
      ? {
          onClick: (params) => {
            if (params === INTERACTION_TREND.ID) {
              this.spreadsheet.emit(InteractionEvent.TREND_ICON_CLICK, meta);
              this.spreadsheet.hideTooltip();
            }
          },
          menus: [
            {
              id: INTERACTION_TREND.ID,
              text: INTERACTION_TREND.NAME,
              icon: LineChartOutlined,
            },
          ],
        }
      : defaultOperator;

    return operator;
  }

  private showTooltip(event: Event, meta: ViewMeta) {
    const currentCellMeta = meta?.data;
    const isTotals = meta?.isTotals || false;
    if (isTotals) {
      return;
    }
    const cellInfos = [currentCellMeta];
    const operator = this.getTooltipOperator(meta);

    this.spreadsheet.showTooltipWithInfo(event, cellInfos, {
      isTotals,
      operator,
      enterable: true,
      hideSummary: true,
    });
  }
}
