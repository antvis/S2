import { Event } from '@antv/g-canvas';
import { S2Event, DefaultInterceptEventType } from './events/types';
import { BaseInteraction } from './base';
import { InteractionStateName } from '@/common/constant/interaction';
import { getTooltipData } from '../utils/tooltip';
import { each, map, assign, pick } from 'lodash';
import { Node } from '../index';

const SHIFT_KEY = 'Shift';

export class ColRowMutiSelection extends BaseInteraction {
  private isMutiSelection = false;

  protected bindEvents() {
    this.bindKeyboardDown();
    this.bindKeyboardUp();
    this.bindColCellClick();
    this.bindRowCellClick();
  }

  private bindKeyboardDown() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARD_DOWN, (ev: KeyboardEvent) => {
      if (ev.key === SHIFT_KEY) {
        this.isMutiSelection = true;
      }
    });
  }

  private bindKeyboardUp() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARD_UP, (ev: KeyboardEvent) => {
      if (ev.key === SHIFT_KEY) {
        this.isMutiSelection = false;
        this.spreadsheet.interceptEvent.delete(DefaultInterceptEventType.CLICK);
      }
    });
  }

  private bindColCellClick() {
    this.spreadsheet.on(S2Event.COL_CELL_CLICK, (ev) => {
      if (this.isMutiSelection) {
        // 屏蔽hover和click
        this.spreadsheet.interceptEvent.add(DefaultInterceptEventType.CLICK);
        const cell = this.spreadsheet.getCell(ev.target);
        let cellInfos = [];
        if (cell.getMeta().x !== undefined) {
          const meta = cell.getMeta();
          const idx = meta.colIndex;
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
            cellInfos = this.mergeCellInfo(cells);
          }
          this.handleTooltip(ev, meta, cellInfos);
          this.spreadsheet.updateCellStyleByState();
          this.spreadsheet.upDatePanelAllCellsStyle();
          this.draw();
        }
      }
    });
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROW_CELL_CLICK, (ev: Event) => {
      if (this.isMutiSelection) {
        // 屏蔽hover和click
        this.spreadsheet.interceptEvent.add(DefaultInterceptEventType.CLICK);
        const cell = this.spreadsheet.getCell(ev.target);
        if (cell.getMeta().x !== undefined) {
          const meta = cell.getMeta();
          const idx = meta.colIndex;
          this.spreadsheet.interceptEvent.add(DefaultInterceptEventType.HOVER);
          if (idx === -1) {
            // 多行
            each(Node.getAllLeavesOfNode(meta), (node: Node) => {
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
          this.spreadsheet.updateCellStyleByState();
          this.spreadsheet.upDatePanelAllCellsStyle();
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
