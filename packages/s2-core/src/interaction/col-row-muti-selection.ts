import { Event, Point, IShape } from '@antv/g-canvas';
import { DataCell } from '../cell';
import { FRONT_GROUND_GROUP_BRUSH_SELECTION_ZINDEX } from '../common/constant';
import { S2Event, DefaultInterceptEventType } from './events/types';
import { BaseInteraction } from './base';
import { StateName } from '../state/state';
import { DataItem, TooltipOptions } from '..';
import { getTooltipData } from '../utils/tooltip';
import { each, map, get } from 'lodash';
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
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARDDOWN, (ev: KeyboardEvent) => {
      if (ev.key === SHIFT_KEY) {
        this.isMutiSelection = true;
      }
    });
  }

  private bindKeyboardUp() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARDUP, (ev: KeyboardEvent) => {
      if (ev.key === SHIFT_KEY) {
        this.isMutiSelection = false;
        this.spreadsheet.interceptEvent.delete(
          DefaultInterceptEventType.CLICK,
        );
      }
    });
  }

  private bindColCellClick() {
    this.spreadsheet.on(S2Event.COLCELL_CLICK, (ev) => {
      if (this.isMutiSelection) {
        // 屏蔽hover和click
        this.spreadsheet.interceptEvent.add(
          DefaultInterceptEventType.CLICK,
        );
        const cell = this.spreadsheet.getCell(ev.target);
        let cellInfos = [];
        if (cell.getMeta().x !== undefined) {
          const meta = cell.getMeta();
          const idx = meta.colIndex;
          this.spreadsheet.interceptEvent.add(
            DefaultInterceptEventType.HOVER,
          );
          if (idx === -1) {
            // 多列
            const leafNodes = Node.getAllLeavesOfNode(meta);
            each(leafNodes, (node: Node) => {
              if (node.belongsCell) {
                this.spreadsheet.setState(
                  node.belongsCell,
                  StateName.COL_SELECTED,
                );
              }
            });
          } else {
            // 单列
            this.spreadsheet.setState(cell, StateName.COL_SELECTED);
          }
          const currentState = this.spreadsheet.getCurrentState();
          const { stateName, cells } = currentState;
          if (stateName === StateName.COL_SELECTED) {
            cellInfos = map(cells, (cell) => ({
              ...get(cell.getMeta(), 'query'),
              colIndex: cell.getMeta().colIndex,
              rowIndex: cell.getMeta().rowIndex,
            }));
          }
          this.handleTooltip(ev, meta, cellInfos);
          this.spreadsheet.updateCellStyleByState();
          this.resetCell();
          this.draw();
        }
      }
    });
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROWCELL_CLICK, (ev: Event) => {
      if (this.isMutiSelection) {
        // 屏蔽hover和click
        this.spreadsheet.interceptEvent.add(
          DefaultInterceptEventType.CLICK,
        );
        const cell = this.spreadsheet.getCell(ev.target);
        if (cell.getMeta().x !== undefined) {
          const meta = cell.getMeta();
          const idx = meta.colIndex;
          this.spreadsheet.interceptEvent.add(
            DefaultInterceptEventType.HOVER,
          );
          if (idx === -1) {
            // 多行
            each(Node.getAllLeavesOfNode(meta), (node: Node) => {
              if (node.belongsCell) {
                this.spreadsheet.setState(
                  node.belongsCell,
                  StateName.ROW_SELECTED,
                );
              }
            });
          } else {
            // 单行
            this.spreadsheet.setState(cell, StateName.ROW_SELECTED);
          }
          this.spreadsheet.updateCellStyleByState();
          this.resetCell();
          this.draw();
        }
      }
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

  private resetCell() {
    this.spreadsheet.getPanelAllCells().forEach((cell) => {
      cell.update();
    });
  }
}
