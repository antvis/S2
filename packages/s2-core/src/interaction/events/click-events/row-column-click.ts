import { DefaultInterceptEventType, S2Event } from '@/common/constant';
import { InteractionStateName } from '@/common/constant/interaction';
import { assign, each, map, pick } from 'lodash';
import { S2CellType, ViewMeta } from '../../../common/interface';
import { Node } from '../../../index';
import { getTooltipData } from '../../../utils/tooltip';
import { BaseEvent } from '../base-event';
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
        this.interaction.interceptEvent.has(DefaultInterceptEventType.CLICK)
      ) {
        return;
      }
      const cell = this.spreadsheet.getCell(ev.target);
      let cellInfos = [];
      if (cell.getMeta().x !== undefined) {
        const meta = cell.getMeta() as Node;
        const idx = meta.colIndex;
        this.interaction.clearState();
        this.interaction.interceptEvent.add(DefaultInterceptEventType.HOVER);
        if (idx === -1) {
          // 多行
          each(Node.getAllLeavesOfNode(meta), (node: Node) => {
            // 如果
            if (node.belongsCell) {
              this.interaction.setState(
                node.belongsCell as S2CellType,
                InteractionStateName.SELECTED,
              );
            }
          });
        } else {
          // 单行
          this.interaction.setState(cell, InteractionStateName.SELECTED);
        }

        const currentState = this.interaction.getState();
        const stateName = currentState?.stateName;
        const cells = currentState?.cells;
        if (stateName === InteractionStateName.SELECTED) {
          cellInfos = this.mergeCellInfo(cells);
        }

        if (!this.spreadsheet.options.valueInCols) {
          this.handleTooltip(ev, meta, cellInfos);
        }

        this.interaction.updateCellStyleByState();
        this.interaction.updatePanelGroupAllDataCellsStyle();
      }
    });
  }

  private bindColCellClick() {
    this.spreadsheet.on(S2Event.COL_CELL_CLICK, (ev: Event) => {
      if (
        this.interaction.interceptEvent.has(DefaultInterceptEventType.CLICK)
      ) {
        return;
      }
      const cell = this.spreadsheet.getCell(ev.target);
      const meta = cell.getMeta() as Node;
      if (meta.x !== undefined) {
        const idx = meta.colIndex;
        this.interaction.clearState();
        this.interaction.interceptEvent.add(DefaultInterceptEventType.HOVER);
        if (idx === -1) {
          // 多列
          const leafNodes = Node.getAllLeavesOfNode(meta);
          each(leafNodes, (node: Node) => {
            if (node.belongsCell) {
              this.interaction.setState(
                node.belongsCell as S2CellType,
                InteractionStateName.SELECTED,
              );
            }
          });
        } else {
          // 单列
          this.interaction.setState(cell, InteractionStateName.SELECTED);
        }

        const cellInfos = this.interaction.isSelectedState()
          ? this.mergeCellInfo(this.interaction.getActiveCells())
          : [];

        if (this.spreadsheet.options.valueInCols) {
          this.handleTooltip(ev, meta, cellInfos);
        }

        this.interaction.updateCellStyleByState();
        this.interaction.updatePanelGroupAllDataCellsStyle();
      }
    });
  }

  private mergeCellInfo(cells: S2CellType[]): ViewMeta[] {
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
      this.interaction.clearStyleIndependent();
    });
  }
}
