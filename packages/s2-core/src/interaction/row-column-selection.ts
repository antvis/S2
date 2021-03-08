import { Event } from '@antv/g-canvas';
import { map, size, get, min, max, each } from 'lodash';
import { ActionType, SortParam, Node } from '../index';
import { DataCell, ColCell, RowCell } from '../cell';
import { getHeaderHierarchyQuery } from '../facet/layout/util';
import { DownOutlined } from '@ant-design/icons';
import { S2Event, DefaultEventType } from './events/types';
import { BaseInteraction } from './base';
import { getTooltipData } from '../utils/tooltip';

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
export class RowColumnSelection extends BaseInteraction {
  public cells: DataCell[];

  public selected: any[];

  public selectedId: string;

  // 显示排序时，排序字段
  public sortFieldId: string;

  // 显示排序时，排序的查询参数
  public sortQuery: any;

  protected bindEvents() {
    this.bindColCellClick();
    this.bindRowCellClick();
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROWCELL_CLICK, (ev: Event) => {
      const cell = this.spreadsheet.eventController.getCell(ev.target);
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
            if(node.belongsCell) {
              this.spreadsheet.setState(node.belongsCell, 'selectedRow')
            }
          })
        } else {
          // 单行
          this.spreadsheet.setState(cell, 'selectedRow')
        }
        this.resetCell();
        this.draw();
      }
    })
  }

  private bindColCellClick() {
    this.spreadsheet.on(S2Event.COLCELL_CLICK, (ev: Event) => {
      const cell = this.spreadsheet.eventController.getCell(ev.target);
      if (cell.getMeta().x !== undefined) {
        const meta = cell.getMeta();
        this.selectedId = meta.id;
        // 是否显示排序选项
        // let showSortOperations = false;
        //  tooltip 是否可让鼠标进入
        // let enterable = true;
        // 显示 tooltip 的动作来源
        let actionType: ActionType;
        // actionType = 'columnSelection';
        const idx = meta.cellIndex;
        this.spreadsheet.clearState();
        this.spreadsheet.eventController.interceptEvent.add(
          DefaultEventType.HOVER,
        );
        if (idx === -1) {
          // 多列
          each(Node.getAllLeavesOfNode(meta), (node: Node) => {
            if(node.belongsCell) {
              this.spreadsheet.setState(node.belongsCell, 'selectedCol')
            }
          })
        } else {
          // 单列
          this.spreadsheet.setState(cell, 'selectedCol')
        }
        // if (meta.isLeaf) {
        //   // 最后一行的列选中，显示 tooltip 时可操作排序
        //   this.sortFieldId = meta.value;
        //   this.sortQuery = getHeaderHierarchyQuery(meta);
        //   enterable = true;
        //   showSortOperations = true;
        // }
        this.resetCell();
        this.draw();
        // const position = {
        //   x: ev.clientX,
        //   y: ev.clientY,
        // };
        // 兼容明细表
        // const hoveringCellData = get(meta, 'query') || {
        //   [get(meta, 'key')]: get(meta, 'value'),
        // };
        // const options = {
        //   operator: this.getSortOperator(showSortOperations),
        //   enterable,
        // };
        // const tooltipData = getTooltipData(
        //   this.spreadsheet,
        //   hoveringCellData,
        //   options,
        // );
        // const showOptions = {
        //   position,
        //   data: tooltipData,
        //   options,
        // };
        // this.showTooltip(showOptions);
      }
    })
  }

  private findCurMenu = (id: string, menus) => {
    let targetMenu: MenuType = {
      id: '',
      text: '',
      type: '',
      sortMethod: '',
      icon: '',
    };
    // eslint-disable-next-line array-callback-return
    menus.map((menu) => {
      if (menu.id === id) {
        targetMenu = menu;
      }
      if (size(menu.children)) {
        targetMenu = this.findCurMenu(id, menu.children);
      }
    });
    return targetMenu;
  };

  private onClick = (id: string) => {
    const { sortFieldId, sortQuery } = this;

    this.spreadsheet.tooltip.hide();
    const curMenu = this.findCurMenu(id, MENUS);
    const sortParam =
      id === 'SORT-NONE'
        ? null
        : ({
            type: curMenu.type,
            sortFieldId,
            sortMethod: curMenu.sortMethod,
            query: sortQuery,
          } as SortParam);
    // 排序条件，存到 store 中
    this.spreadsheet.store.set('sortParam', sortParam);
    this.spreadsheet.setDataCfg({ ...this.spreadsheet.dataCfg });
    this.spreadsheet.render();
  };

  /**
   * showSortOperations boolean
   */
  private getSortOperator(showSortOperations) {
    return showSortOperations
      ? {
          onClick: this.onClick,
          menus: MENUS,
        }
      : null;
  }

  /**
   * 重置cell
   */
  private resetCell() {
    this.spreadsheet.getPanelAllCells().forEach((cell) => {
      cell.update();
    });
  }
}
