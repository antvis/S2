import { DefaultInterceptEventType, S2Event } from '@/common/constant';
import { InteractionStateName } from '@/common/constant/interaction';
import { S2CellType } from '@/common/interface';
import { Node } from '@/index';
import { getTooltipData } from '@/utils/tooltip';
import { Event } from '@antv/g-canvas';
import { assign, each, map, pick } from 'lodash';
import { BaseInteraction } from './base';

const SHIFT_KEY = 'Shift';

export class ColRowMultiSelection extends BaseInteraction {
  private isMultiSelection = false;

  protected bindEvents() {
    this.bindKeyboardDown();
    this.bindKeyboardUp();
    this.bindColCellClick();
    this.bindRowCellClick();
  }

  private bindKeyboardDown() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARD_DOWN, (ev: KeyboardEvent) => {
      if (ev.key === SHIFT_KEY) {
        this.isMultiSelection = true;
      }
    });
  }

  private bindKeyboardUp() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARD_UP, (ev: KeyboardEvent) => {
      if (ev.key === SHIFT_KEY) {
        this.isMultiSelection = false;
        this.interaction.interceptEvent.delete(DefaultInterceptEventType.CLICK);
      }
    });
  }

  private bindColCellClick() {
    this.spreadsheet.on(S2Event.COL_CELL_CLICK, (ev: Event) => {
      if (this.isMultiSelection) {
        // 屏蔽hover和click
        this.interaction.interceptEvent.add(DefaultInterceptEventType.CLICK);
        const cell = this.spreadsheet.getCell(ev.target) as S2CellType;
        let cellInfos = [];
        if (cell.getMeta().x !== undefined) {
          const meta = cell.getMeta() as Node;
          const idx = meta.colIndex;
          this.interaction.interceptEvent.add(DefaultInterceptEventType.HOVER);
          if (idx === -1) {
            // 多列
            const leafNodes = Node.getAllLeavesOfNode(meta);
            each(leafNodes, (node: Node) => {
              const belongsCell = node.belongsCell as S2CellType;
              if (belongsCell) {
                this.interaction.setState(
                  belongsCell,
                  InteractionStateName.SELECTED,
                );
              }
            });
          } else {
            // 单列
            this.interaction.setState(cell, InteractionStateName.SELECTED);
          }
          const currentState = this.interaction.getCurrentState();
          const stateName = currentState?.stateName;
          const cells = currentState?.cells;
          if (stateName === InteractionStateName.SELECTED) {
            cellInfos = this.mergeCellInfo(cells);
          }
          this.handleTooltip(ev, meta, cellInfos);
          this.interaction.updateCellStyleByState();
          this.interaction.upDatePanelAllCellsStyle();
          this.interaction.showInteractionMask();
          this.draw();
        }
      }
    });
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROW_CELL_CLICK, (ev: Event) => {
      if (this.isMultiSelection) {
        // 屏蔽hover和click
        this.interaction.interceptEvent.add(DefaultInterceptEventType.CLICK);
        const cell = this.spreadsheet.getCell(ev.target) as S2CellType;
        if (cell.getMeta().x !== undefined) {
          const meta = cell.getMeta() as Node;
          const idx = meta.colIndex;
          this.interaction.interceptEvent.add(DefaultInterceptEventType.HOVER);
          if (idx === -1) {
            // 多行
            each(Node.getAllLeavesOfNode(meta), (node: Node) => {
              const belongsCell = node.belongsCell as S2CellType;
              if (belongsCell) {
                this.interaction.setState(
                  belongsCell,
                  InteractionStateName.SELECTED,
                );
              }
            });
          } else {
            // 单行
            this.interaction.setState(cell, InteractionStateName.SELECTED);
          }
          this.interaction.updateCellStyleByState();
          this.interaction.upDatePanelAllCellsStyle();
          this.interaction.showInteractionMask();
          this.draw();
        }
      }
    });
  }

  // TODO: mergeCellInfo 不应该存在，应该放在tooltip的util中，但是util现在有点case by case，等util改造后收敛这里的tooltip方式
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
}
