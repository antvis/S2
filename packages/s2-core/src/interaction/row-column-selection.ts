import { Event, Group } from '@antv/g-canvas';
import * as _ from 'lodash';
import { ActionType, SortParam, Node } from '../index';
import { DataCell, ColCell, RowCell } from '../cell';
import { getHeaderHierarchyQuery } from '../facet/layout/util';
import { HoverInteraction } from './hover-interaction';
import { DownOutlined } from '@ant-design/icons';

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
export class RowColumnSelection extends HoverInteraction {
  public cells: DataCell[];

  public selected: any[];

  public selectedId: string;

  // 显示排序时，排序字段
  public sortFieldId: string;

  // 显示排序时，排序的查询参数
  public sortQuery: any;

  private target;

  protected start(ev: Event) {
    this.target = ev.target;
    this.cells = this.spreadsheet.getPanelAllCells();
    this.selected = [];
  }

  protected end(ev: Event) {
    // 明细表& 决策模式 直接不处理
    if (this.target !== ev.target || !ev.target.get('parent')) {
      return;
    }
    const cell: RowCell | ColCell = ev.target.get('parent');
    if (cell && (cell instanceof RowCell || cell instanceof ColCell)) {
      if (cell.getMeta().x !== undefined && ev.target.type !== 'line') {
        const meta = cell.getMeta();
        if (this.selectedId === meta.id) {
          this.spreadsheet.store.set('selected', null);
          this.resetCell();
          this.selectedId = null;
          this.draw();
          return;
        }
        this.selectedId = meta.id;
        // 是否显示排序选项
        let showSortOperations = false;
        //  tooltip 是否可让鼠标进入
        let enterable = true;
        // 显示 tooltip 的动作来源
        let actionType: ActionType;
        if (cell instanceof RowCell) {
          // 行选中
          actionType = 'rowSelection';
          const idx = meta.cellIndex;
          if (idx === -1) {
            // 多行
            const arr = _.map(Node.getAllLeavesOfNode(meta), 'cellIndex');
            this.spreadsheet.store.set('selected', {
              type: 'row',
              indexes: [[_.min(arr), _.max(arr)], -1],
            });
          } else {
            // 单行
            this.spreadsheet.store.set('selected', {
              type: 'row',
              indexes: [idx, -1],
            });
          }
        } else if (cell instanceof ColCell) {
          // 列选中
          actionType = 'columnSelection';
          const idx = meta.cellIndex;
          if (idx === -1) {
            // 多列
            const arr = _.map(Node.getAllLeavesOfNode(meta), 'cellIndex');
            this.spreadsheet.store.set('selected', {
              type: 'column',
              indexes: [-1, [_.min(arr), _.max(arr)]],
            });
          } else {
            // 单列
            this.spreadsheet.store.set('selected', {
              type: 'column',
              indexes: [-1, idx],
            });
          }
          if (meta.isLeaf) {
            // 最后一行的列选中，显示 tooltip 时可操作排序
            this.sortFieldId = meta.value;
            this.sortQuery = getHeaderHierarchyQuery(meta);
            enterable = true;
            showSortOperations = true;
          }
        }
        this.resetCell();
        this.draw();
        const position = {
          x: ev.clientX,
          y: ev.clientY,
        };
        // 兼容明细表
        const hoveringCellData = _.get(meta, 'query') || {
          [_.get(meta, 'key')]: _.get(meta, 'value'),
        };
        this.showTooltip(position, hoveringCellData, {
          actionType,
          operator: this.getSortOperator(showSortOperations),
          enterable,
        });
      }
    }
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
      if (_.size(menu.children)) {
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
    this.cells.forEach((cell) => {
      cell.update();
    });
  }
}
