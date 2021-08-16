import { DefaultInterceptEventType, S2Event } from '@/common/constant';
import { InteractionStateName } from '@/common/constant/interaction';
import {
  S2CellType,
  TooltipOperatorOptions,
  TooltipOptions,
  TooltipPosition,
  ViewMeta,
} from '@/common/interface';
import { getTooltipData } from '@/utils/tooltip';
import { LineChartOutlined } from '@ant-design/icons';
import { Event } from '@antv/g-canvas';
import { get, noop } from 'lodash';
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
      const meta = cell.getMeta() as ViewMeta;
      if (meta) {
        // selected通过state来接管，不需要再在 this.spreadsheet.store 中操作
        this.interaction.clearStyleIndependent();

        if (this.interaction.isSelectedCell(cell)) {
          // 点击当前已选cell 则取消当前cell的选中状态
          // 这里的clearState虽然在if和else里都有，但是不要抽出来，因为需要先判断在清空
          // 且else中需要先清空之前选择的cell，然后再赋值新的
          this.interaction.clearState();
          this.interaction.interceptEvent.clear();
          this.spreadsheet.hideTooltip();
          this.interaction.hideInteractionMask();
        } else {
          this.interaction.clearState();
          this.interaction.setState(
            cell as S2CellType,
            InteractionStateName.SELECTED,
          );
          this.interaction.updateCellStyleByState();
          this.interaction.interceptEvent.add(DefaultInterceptEventType.HOVER);
          this.interaction.showInteractionMask();
          this.showTooltip(event, meta);
        }

        this.draw();
      }
    });
  }

  private showTooltip(event: Event, meta: ViewMeta) {
    const currentCellMeta: Record<string, unknown> = get(meta, 'data');
    const isTotals = get(meta, 'isTotals', false);
    if (isTotals) {
      return;
    }

    const cellOperator: TooltipOperatorOptions =
      this.spreadsheet.options?.cellOperator;

    let operator: TooltipOperatorOptions = this.spreadsheet.options?.showTrend
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

    const position: TooltipPosition = {
      x: event.clientX,
      y: event.clientY,
    };

    const options: TooltipOptions = {
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

    this.spreadsheet.showTooltip({
      position,
      data: tooltipData,
      options,
    });
  }
}
