import { map, each, pick, assign } from 'lodash';
import { Node } from '../../../index';
import { S2Event, DefaultInterceptEventType } from '../types';
import { BaseEvent } from '../base-event';
import { InteractionStateName } from '@/common/constant/interaction';
import { getTooltipData } from '../../../utils/tooltip';
// TODO: tooltip的菜单栏配置（在点击行头或列头的时候tooltip的样式）
export class RowColumnClick extends BaseEvent {
  protected bindEvents() {
    this.bindColCellClick();
    this.bindRowCellClick();
    this.bindResetSheetStyle();
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROW_CELL_CLICK, (ev: Event) => {
      if (
        this.spreadsheet.interceptEvent.has(DefaultInterceptEventType.CLICK)
      ) {
        return;
      }
      const cell = this.spreadsheet.getCell(ev.target);
      let cellInfos = [];
      if (cell.getMeta().x !== undefined) {
        const meta = cell.getMeta();
        const idx = meta.colIndex;
        this.spreadsheet.clearState();
        this.spreadsheet.interceptEvent.add(DefaultInterceptEventType.HOVER);
        if (idx === -1) {
          // 多行
          each(Node.getAllLeavesOfNode(meta), (node: Node) => {
            // 如果
            if (node.belongsCell) {
              this.spreadsheet.setState(
                node.belongsCell,
                InteractionStateName.SELECTED,
              );
            }
          });
        } else {
          // 单行
          this.spreadsheet.setState(cell, InteractionStateName.SELECTED);
        }

        const currentState = this.spreadsheet.getCurrentState();
        const stateName = currentState?.stateName;
        const cells = currentState?.cells;
        if (stateName === InteractionStateName.SELECTED) {
          cellInfos = this.mergeCellInfo(cells, 'rowIndex');
        }

        if (!this.spreadsheet.options.valueInCols) {
          this.handleTooltip(ev, meta, cellInfos);
        }

        this.spreadsheet.updateCellStyleByState();
        this.spreadsheet.upDatePanelAllCellsStyle();
        this.draw();
      }
    });
  }

  private bindColCellClick() {
    this.spreadsheet.on(S2Event.COL_CELL_CLICK, (ev: Event) => {
      if (
        this.spreadsheet.interceptEvent.has(DefaultInterceptEventType.CLICK)
      ) {
        return;
      }
      const cell = this.spreadsheet.getCell(ev.target);
      let cellInfos = [];
      const meta = cell.getMeta();
      if (meta.x !== undefined) {
        const idx = meta.colIndex;
        this.spreadsheet.clearState();
        this.spreadsheet.interceptEvent.add(DefaultInterceptEventType.HOVER);
        if (idx === -1) {
          // 多列
          const leafNodes = Node.getAllLeavesOfNode(meta);
          each(leafNodes, (node: Node) => {
            if (node.belongsCell) {
              this.spreadsheet.setState(
                node.belongsCell,
                InteractionStateName.SELECTED,
              );
            }
          });
        } else {
          // 单列
          this.spreadsheet.setState(cell, InteractionStateName.SELECTED);
        }

        const currentState = this.spreadsheet.getCurrentState();
        const stateName = currentState?.stateName;
        const cells = currentState?.cells;
        if (stateName === InteractionStateName.SELECTED) {
          cellInfos = this.mergeCellInfo(cells, 'colIndex');
        }

        if (this.spreadsheet.options.valueInCols) {
          this.handleTooltip(ev, meta, cellInfos);
        }

        this.spreadsheet.updateCellStyleByState();
        this.spreadsheet.upDatePanelAllCellsStyle();
        this.draw();
      }
    });
  }

  private mergeCellInfo(cells, index) {
    return map(cells, (stateCell) => {
      const stateCellMeta = stateCell.getMeta();
      return assign(
        {},
        stateCellMeta.query || {},
        pick(stateCellMeta, [index]),
      );
    });
  }

  private handleTooltip(ev, meta, cellInfos) {
    const position = {
      x: ev.clientX,
      y: ev.clientY,
    };

    const options = {
      // operator: this.getSortOperator(showSortOperations),
      enterable: true,
    };

    const tooltipData = getTooltipData({
      spreadsheet: this.spreadsheet,
      cellInfos,
      options,
      isHeader: true,
    });

    const showOptions = {
      position,
      data: tooltipData,
      options,
    };
    this.spreadsheet.showTooltip(showOptions);
  }

  private bindResetSheetStyle() {
    this.spreadsheet.on(S2Event.GLOBAL_CLEAR_INTERACTION_STYLE_EFFECT, () => {
      this.spreadsheet.clearStyleIndependent();
    });
  }
}
