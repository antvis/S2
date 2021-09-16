import { Event } from '@antv/g-canvas';
import { concat, isEmpty } from 'lodash';
import { EyeOutlined } from '@ant-design/icons';
import { BaseEvent, BaseEventImplement } from '@/interaction/base-event';
import {
  S2Event,
  InteractionKeyboardKey,
  InteractionStateName,
  INTERACTION_OPERATOR,
  InterceptType,
} from '@/common/constant';
import { S2CellType, TooltipOperatorOptions } from '@/common/interface';
import { Node } from '@/facet/layout/node';
import { mergeCellInfo } from '@/utils/tooltip';

export class RowColumnClick extends BaseEvent implements BaseEventImplement {
  private isMultiSelection = false;

  public bindEvents() {
    this.bindKeyboardDown();
    this.bindKeyboardUp();
    this.bindColCellClick();
    this.bindRowCellClick();
  }

  private bindKeyboardDown() {
    this.spreadsheet.on(
      S2Event.GLOBAL_KEYBOARD_DOWN,
      (event: KeyboardEvent) => {
        if (event.key === InteractionKeyboardKey.SHIFT) {
          this.isMultiSelection = true;
        }
      },
    );
  }

  private bindKeyboardUp() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARD_UP, (event: KeyboardEvent) => {
      if (event.key === InteractionKeyboardKey.SHIFT) {
        this.isMultiSelection = false;
        this.interaction.removeIntercepts([InterceptType.CLICK]);
      }
    });
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROW_CELL_CLICK, (event: Event) => {
      this.handleRowColClick(event, this.spreadsheet.isHierarchyTreeType());
    });
  }

  private bindColCellClick() {
    this.spreadsheet.on(S2Event.COL_CELL_CLICK, (event: Event) => {
      this.handleRowColClick(event);
    });
  }

  private handleRowColClick = (event: Event, isTreeRowClick = false) => {
    event.stopPropagation();

    const { interaction } = this.spreadsheet;
    if (interaction.hasIntercepts([InterceptType.CLICK])) {
      return;
    }

    const lastState = interaction.getState();
    const cell = this.spreadsheet.getCell(event.target);
    const meta = cell.getMeta() as Node;

    if (interaction.isSelectedCell(cell)) {
      interaction.reset();
      return;
    }

    if (meta.x) {
      interaction.addIntercepts([InterceptType.HOVER]);
      // 树状结构的行头点击不需要遍历当前行头的所有子节点，因为只会有一级
      let leafNodes = isTreeRowClick
        ? Node.getAllLeavesOfNode(meta).filter(
            (node) => node.rowIndex === meta.rowIndex,
          )
        : Node.getAllChildrenNode(meta);
      let selectedCells: S2CellType[] = [cell];

      if (this.isMultiSelection && interaction.isSelectedState()) {
        selectedCells = isEmpty(lastState?.cells)
          ? selectedCells
          : concat(lastState?.cells, selectedCells);
        leafNodes = isEmpty(lastState?.nodes)
          ? leafNodes
          : concat(lastState?.nodes, leafNodes);
      }

      // 兼容行列多选
      // Set the header cells (colCell or RowCell)  selected information and update the dataCell state.
      interaction.changeState({
        cells: selectedCells,
        nodes: leafNodes,
        stateName: InteractionStateName.SELECTED,
      });

      // Update the interaction state of all the selected cells:  header cells(colCell or RowCell) and dataCells belong to them.
      interaction.updateCells(selectedCells);

      if (!isTreeRowClick) {
        leafNodes.forEach((node) => {
          node?.belongsCell?.updateByState(
            InteractionStateName.SELECTED,
            node.belongsCell,
          );
        });
      }

      this.showTooltip(event);
    }
  };

  private showTooltip(event: Event) {
    const { interaction } = this.spreadsheet;
    const cellInfos = interaction.isSelectedState()
      ? mergeCellInfo(interaction.getActiveCells())
      : [];

    const { hideColumn } = INTERACTION_OPERATOR;
    const operator: TooltipOperatorOptions = this.spreadsheet.isTableMode() && {
      onClick: (id) => {
        if (id === hideColumn.id) {
          this.hideSelectedColumns();
        }
      },
      menus: [
        {
          id: hideColumn.id,
          text: hideColumn.text,
          icon: EyeOutlined,
        },
      ],
    };

    this.spreadsheet.showTooltipWithInfo(event, cellInfos, {
      showSingleTips: true,
      hideSummary: true,
      operator,
    });
  }

  /**
   * 隐藏选中的列
   * 每次点击存储两个信息
   * 1. [hideColumnFields]: 当前选中 (单/多选) 的 field, 对应 dataCfg 里面的 column
   *    用于点击展开按钮后还原, 区别于 options.hideColumnFields, 这里需要分段存储, 比如现在有两个隐藏的列
   *    [1,2, (3隐藏), 4, 5, (6隐藏), 7]
   *    展开按钮在 4, 7, 点击任意按钮, 应该只展开所对应的那组 : 4 => [3], 7 => [6]
   * 2. [displaySiblingNode]: 当前这一组的列隐藏后, 需要将展开按钮显示到对应的兄弟节点
   * 这样不用每次 render 的时候实时计算, 渲染列头单元格 直接取数据即可, 性能较好
   */
  private hideSelectedColumns() {
    const { interaction, options } = this.spreadsheet;
    const selectedCells = interaction.getActiveCells();
    const selectedColumnFields = selectedCells.map(
      (cell) => cell.getMeta().field,
    );

    const hideColumnFields: string[] = [
      ...selectedColumnFields,
      ...options.hideColumnFields,
    ];

    const displaySiblingNode =
      this.getHiddenColumnDisplaySiblingNode(hideColumnFields);

    const lastHiddenColumnConfig = this.spreadsheet.store.get(
      'hiddenColumnDetail',
      [],
    );
    this.spreadsheet.store.set('hiddenColumnDetail', [
      ...lastHiddenColumnConfig,
      {
        hideColumnFields: selectedColumnFields,
        displaySiblingNode,
      },
    ]);
    this.spreadsheet.setOptions({
      hideColumnFields,
    });
    this.spreadsheet.interaction.reset();
    this.spreadsheet.render(false);
  }

  // 获取当前隐藏列(兼容多选) 所对应为未隐藏的兄弟节点
  private getHiddenColumnDisplaySiblingNode(hideColumnFields: string[]): Node {
    const columnNodes = this.spreadsheet.getInitColumnNodes();
    const hiddenColumnIndexes = this.getHiddenColumnNodes(hideColumnFields).map(
      ({ colIndex }) => colIndex,
    );
    const lastColumnIndex = Math.max(...hiddenColumnIndexes);
    return columnNodes.find((node) => node.colIndex === lastColumnIndex + 1);
  }

  // 获取需要隐藏的 filed 转成对应的 Node
  private getHiddenColumnNodes(hideColumnFields: string[]): Node[] {
    const columnNodes = this.spreadsheet.getInitColumnNodes();
    return hideColumnFields.map((filed) =>
      columnNodes.find((node) => node.field === filed),
    );
  }
}
