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
    this.onDataCellClick();
  }

  private onDataCellClick() {
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
        // selected通过state来接管，不需要再在 this.spreadsheet.store 中操作
        this.interaction.clearStyleIndependent();

        const isSelectedCell = this.interaction.isSelectedCell(cell);
        if (isSelectedCell) {
          // 点击当前已选cell 则取消当前cell的选中状态
          // 这里的clearState虽然在if和else里都有，但是不要抽出来，因为需要先判断在清空
          // 且else中需要先清空之前选择的cell，然后再赋值新的
          this.interaction.clearState();
          this.interaction.interceptEvent.clear();
          this.spreadsheet.hideTooltip();
        } else {
          this.interaction.clearState();
          this.interaction.setState(
            cell as S2CellType,
            InteractionStateName.SELECTED,
          );
          this.interaction.updateCellStyleByState();
          this.interaction.interceptEvent.add(DefaultInterceptEventType.HOVER);
          this.showTooltip(event, meta);
        }

        this.interaction.toggleSelectedCellsSpotlight(isSelectedCell);
        this.draw();
      }
    });
  }

  private getTooltipOperator(meta: ViewMeta): TooltipOperatorOptions {
    const cellOperator: TooltipOperatorOptions =
      this.spreadsheet.options?.cellOperator;

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
