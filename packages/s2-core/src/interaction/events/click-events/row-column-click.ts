import { Event } from '@antv/g-canvas';
import { map, size, get, min, max, each } from 'lodash';
import { SortParam, Node } from '../../../index';
import { DataCell, ColCell, RowCell } from '../../../cell';
import { getHeaderHierarchyQuery } from '../../../facet/layout/util';
import { DownOutlined } from '@ant-design/icons';
import { S2Event, DefaultEventType } from '../types';
import { BaseEvent } from '../base-event';
import { StateName } from '../../../state/state';
import { getTooltipData } from '../../../utils/tooltip';
import BaseSpreadSheet from '../../../sheet-type/base-spread-sheet';

interface MenuType {
  id: string;
  sortMethod: string;
  type: string;
  icon: string;
  text: string;
}

const MENUS = [
  {
    id: 'SORT',
    text: '排序',
    icon: DownOutlined,
    children: [
      {
        id: 'SORT-ASC',
        sortMethod: 'ASC',
        type: 'groupAsc',
        icon: 'groupAsc',
        text: '组内升序',
      },
      {
        id: 'SORT-DESC',
        sortMethod: 'DESC',
        type: 'groupDesc',
        icon: 'groupDesc',
        text: '组内降序',
      },
      { id: 'SORT-NONE', sortMethod: 'NONE', type: 'none', text: '不排序' },
    ],
  },
];

/**
 * Click row/column header leaf node to set sort types
 * and high-light current row/column cells
 */
export class RowColumnClick extends BaseEvent {
  // 显示排序时，排序字段
  private sortFieldId: string;

  // 显示排序时，排序的查询参数
  private sortQuery: any;

  protected bindEvents() {
    this.bindColCellClick();
    this.bindRowCellClick();
    this.bindResetSheetStyle();
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROWCELL_CLICK, (ev: Event) => {
      if (
        this.spreadsheet.eventController.interceptEvent.has(
          DefaultEventType.CLICK,
        )
      ) {
        return;
      }
      const cell = this.spreadsheet.getCell(ev.target);
      if (cell.getMeta().x !== undefined) {
        const meta = cell.getMeta();
        const idx = meta.cellIndex;
        this.spreadsheet.clearState();
        this.spreadsheet.eventController.interceptEvent.add(
          DefaultEventType.HOVER,
        );
        if (idx === -1) {
          // 多行
          each(Node.getAllLeavesOfNode(meta), (node: Node) => {
            // 如果
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
    });
  }

  private bindColCellClick() {
    this.spreadsheet.on(S2Event.COLCELL_CLICK, (ev: Event) => {
      if (
        this.spreadsheet.eventController.interceptEvent.has(
          DefaultEventType.CLICK,
        )
      ) {
        return;
      }
      const cell = this.spreadsheet.getCell(ev.target);
      let cellInfos = [];
      const meta = cell.getMeta();
      if (meta.x !== undefined) {
        const idx = meta.cellIndex;
        this.spreadsheet.clearState();
        this.spreadsheet.eventController.interceptEvent.add(
          DefaultEventType.HOVER,
        );
        if (idx === -1) {
          // 多列
          const leafNodes = Node.getAllLeavesOfNode(meta);
          cellInfos = map(leafNodes, node => ({
            ...get(node, 'query'),
            colIndex: node.cellIndex,
            rowIndex: node.rowIndex,
          }));
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
          cellInfos = [{
            ...get(meta, 'query'),
            colIndex: meta.cellIndex,
            rowIndex: meta.rowIndex,
          }];
        }

        this.handleTooltip(ev, meta, cellInfos)

        this.spreadsheet.updateCellStyleByState();
        this.resetCell();
        this.draw();
      }
    });
  }

  private handleTooltip(ev, meta, cellInfos) {
    // 是否显示排序选项
    // let showSortOperations = false;
    //  tooltip 是否可让鼠标进入
    // if (meta.isLeaf) {
    //   // 最后一行的列选中，显示 tooltip 时可操作排序
    //   this.sortFieldId = meta.value;
    //   this.sortQuery = getHeaderHierarchyQuery(meta);
    //   enterable = true;
    //   showSortOperations = true;
    // }

    const position = {
      x: ev.clientX,
      y: ev.clientY,
    };

    const options = {
      // operator: this.getSortOperator(showSortOperations),
      enterable: true,
    };

    const tooltipData = getTooltipData(
      this.spreadsheet,
      cellInfos,
      options,
    );
    const showOptions = {
      position,
      data: tooltipData,
      options,
    };
    this.spreadsheet.showTooltip(showOptions);
  }

  private bindResetSheetStyle() {
    this.spreadsheet.on(S2Event.GLOBAL_CLEAR_INTERACTION_STYLE_EFFECT, () => {
      const currentState = this.spreadsheet.getCurrentState();
      if (
        currentState.stateName === StateName.COL_SELECTED ||
        currentState.stateName === StateName.ROW_SELECTED
      ) {
        this.spreadsheet.getPanelAllCells().forEach((cell) => {
          cell.hideShapeUnderState();
        });
      }
    });
  }

  // private findCurMenu = (id: string, menus) => {
  //   let targetMenu: MenuType = {
  //     id: '',
  //     text: '',
  //     type: '',
  //     sortMethod: '',
  //     icon: '',
  //   };
  //   // eslint-disable-next-line array-callback-return
  //   menus.map((menu) => {
  //     if (menu.id === id) {
  //       targetMenu = menu;
  //     }
  //     if (size(menu.children)) {
  //       targetMenu = this.findCurMenu(id, menu.children);
  //     }
  //   });
  //   return targetMenu;
  // };

  // private onClick = (id: string) => {
  //   const { sortFieldId, sortQuery } = this;

  //   this.spreadsheet.tooltip.hide();
  //   const curMenu = this.findCurMenu(id, MENUS);
  //   const sortParam =
  //     id === 'SORT-NONE'
  //       ? null
  //       : ({
  //           type: curMenu.type,
  //           sortFieldId,
  //           sortMethod: curMenu.sortMethod,
  //           query: sortQuery,
  //         } as SortParam);
  //   // 排序条件，存到 store 中
  //   this.spreadsheet.store.set('sortParam', sortParam);
  //   this.spreadsheet.setDataCfg({ ...this.spreadsheet.dataCfg });
  //   this.spreadsheet.render();
  // };

  // /**
  //  * showSortOperations boolean
  //  */
  // private getSortOperator(showSortOperations) {
  //   return showSortOperations
  //     ? {
  //         onClick: this.onClick,
  //         menus: MENUS,
  //       }
  //     : null;
  // }

  /**
   * 重置cell
   */
  private resetCell() {
    this.spreadsheet.getPanelAllCells().forEach((cell) => {
      cell.update();
    });
  }
}
