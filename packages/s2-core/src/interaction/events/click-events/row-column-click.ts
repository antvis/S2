import { map, each, pick, assign } from 'lodash';
import { Node } from '@/index';
import { S2Event, DefaultInterceptEventType } from '../types';
import { BaseEvent } from '../base-event';
import { SelectedStateName } from '@/common/constant/interatcion';
import { getTooltipData } from '@/utils/tooltip';
// TODO: tooltip的菜单栏配置（在点击行头或列头的时候tooltip的样式）
export class RowColumnClick extends BaseEvent {
  protected bindEvents() {
    this.bindColCellClick();
    this.bindRowCellClick();
    this.bindResetSheetStyle();
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROWCELL_CLICK, (ev: Event) => {
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
                SelectedStateName.ROW_SELECTED,
              );
            }
          });
        } else {
          // 单行
          this.spreadsheet.setState(cell, SelectedStateName.ROW_SELECTED);
        }

        const currentState = this.spreadsheet.getCurrentState();
        const { stateName, cells } = currentState;
        if (stateName === SelectedStateName.ROW_SELECTED) {
          cellInfos = this.mergeCellInfo(cells);
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
    this.spreadsheet.on(S2Event.COLCELL_CLICK, (ev: Event) => {
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
                SelectedStateName.COL_SELECTED,
              );
            }
          });
        } else {
          // 单列
          this.spreadsheet.setState(cell, SelectedStateName.COL_SELECTED);
        }

        const currentState = this.spreadsheet.getCurrentState();
        const { stateName, cells } = currentState;
        if (stateName === SelectedStateName.COL_SELECTED) {
          cellInfos = this.mergeCellInfo(cells);
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

  private mergeCellInfo(cells) {
    return map(cells, (stateCell) => {
      const stateCellMeta = stateCell.getMeta();
      return assign(
        {},
        stateCellMeta.query || {},
        pick(stateCellMeta, ['colIndex', 'rowIndex']),
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

    const tooltipData = getTooltipData(this.spreadsheet, cellInfos, options);

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
