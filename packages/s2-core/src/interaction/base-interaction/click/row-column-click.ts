import { Event as CanvasEvent } from '@antv/g-canvas';
import { getCellMeta } from 'src/utils/interaction/select-event';
import { concat, difference, isEmpty, isNil } from 'lodash';
import { hideColumns } from '@/utils/hide-columns';
import { BaseEvent, BaseEventImplement } from '@/interaction/base-event';
import {
  S2Event,
  InteractionKeyboardKey,
  InteractionStateName,
  TOOLTIP_OPERATOR_MENUS,
  InterceptType,
} from '@/common/constant';
import { TooltipOperatorOptions } from '@/common/interface';
import { Node } from '@/facet/layout/node';
import { mergeCellInfo } from '@/utils/tooltip';

export class RowColumnClick extends BaseEvent implements BaseEventImplement {
  private isMultiSelection = false;

  public bindEvents() {
    this.bindKeyboardDown();
    this.bindKeyboardUp();
    this.bindColCellClick();
    this.bindRowCellClick();
    this.bindTableColExpand();
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
    this.spreadsheet.on(S2Event.ROW_CELL_CLICK, (event: CanvasEvent) => {
      this.handleRowColClick(event, this.spreadsheet.isHierarchyTreeType());
    });
  }

  private bindColCellClick() {
    this.spreadsheet.on(S2Event.COL_CELL_CLICK, (event: CanvasEvent) => {
      this.handleRowColClick(event);
    });
  }

  private handleRowColClick = (event: CanvasEvent, isTreeRowClick = false) => {
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

    if (!isNil(meta.x)) {
      interaction.addIntercepts([InterceptType.HOVER]);
      // 树状结构的行头点击不需要遍历当前行头的所有子节点，因为只会有一级
      let leafNodes = isTreeRowClick
        ? Node.getAllLeavesOfNode(meta).filter(
            (node) => node.rowIndex === meta.rowIndex,
          )
        : Node.getAllChildrenNode(meta);
      let selectedCells = [getCellMeta(cell)];

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

      const selectedCellIds = selectedCells.map(({ id }) => id);
      // Update the interaction state of all the selected cells:  header cells(colCell or RowCell) and dataCells belong to them.
      interaction.updateCells(
        interaction.getRowColActiveCells(selectedCellIds),
      );

      if (!isTreeRowClick) {
        leafNodes.forEach((node) => {
          node?.belongsCell?.updateByState(
            InteractionStateName.SELECTED,
            node.belongsCell,
          );
        });
      }
      this.spreadsheet.emit(
        S2Event.GLOBAL_SELECTED,
        this.interaction.getActiveCells(),
      );
      this.showTooltip(event);
    }
  };

  private showTooltip(event: CanvasEvent) {
    const {
      interaction,
      options: { tooltip },
    } = this.spreadsheet;
    const cellInfos = interaction.isSelectedState()
      ? mergeCellInfo(interaction.getActiveCells())
      : [];

    const handlers = [];

    const operator: TooltipOperatorOptions = {
      menus: [],
      onClick: (params) => handlers.map((handler) => handler(params)),
    };

    if (tooltip.operation.hiddenColumns) {
      operator.menus.push(...TOOLTIP_OPERATOR_MENUS.HiddenColumns);
      handlers.push(({ key }) => {
        if (key === 'hiddenColumns') this.hideSelectedColumns();
      });
    }

    this.spreadsheet.showTooltipWithInfo(event, cellInfos, {
      showSingleTips: true,
      operator,
    });
  }

  private bindTableColExpand() {
    this.spreadsheet.on(S2Event.LAYOUT_TABLE_COL_EXPANDED, (node) => {
      this.handleExpandIconClick(node);
    });
  }

  /**
   * 隐藏选中的列
   * 每次点击存储两个信息
   * 1. [hiddenColumnFields]: 当前选中 (单/多选) 的 field, 对应 dataCfg 里面的 column
   *    用于点击展开按钮后还原, 区别于 options.hiddenColumnFields, 这里需要分段存储, 比如现在有两个隐藏的列
   *    [1,2, (3隐藏), 4, 5, (6隐藏), 7]
   *    展开按钮在 4, 7, 点击任意按钮, 应该只展开所对应的那组 : 4 => [3], 7 => [6]
   * 2. [displaySiblingNode]: 当前这一组的列隐藏后, 需要将展开按钮显示到对应的兄弟节点
   * 这样不用每次 render 的时候实时计算, 渲染列头单元格 直接取数据即可
   */
  private hideSelectedColumns() {
    const selectedColumnFields: string[] = this.spreadsheet.interaction
      .getActiveCells()
      .map((cell) => cell.getMeta().field);

    hideColumns(this.spreadsheet, selectedColumnFields);
  }

  private handleExpandIconClick(node: Node) {
    const { hiddenColumnFields: lastHideColumnFields } =
      this.spreadsheet.options;
    const hiddenColumnsDetail = this.spreadsheet.store.get(
      'hiddenColumnsDetail',
    );
    const { hideColumnNodes } = hiddenColumnsDetail.find(
      ({ displaySiblingNode }) => displaySiblingNode?.field === node.field,
    );
    const willDisplayColumnFields = hideColumnNodes.map(({ field }) => field);
    this.spreadsheet.setOptions({
      hiddenColumnFields: difference(
        lastHideColumnFields,
        willDisplayColumnFields,
      ),
    });
    this.spreadsheet.store.set(
      'hiddenColumnsDetail',
      hiddenColumnsDetail.filter(
        ({ displaySiblingNode }) => displaySiblingNode?.field !== node.field,
      ),
    );
    this.spreadsheet.interaction.reset();
    this.spreadsheet.render(false);
  }
}
