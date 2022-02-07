import { Event as CanvasEvent } from '@antv/g-canvas';
import { getCellMeta } from 'src/utils/interaction/select-event';
import { compact, concat, difference, isEmpty, isNil } from 'lodash';
import {
  hideColumns,
  hideColumnsByThunkGroup,
  isEqualDisplaySiblingNodeId,
} from '@/utils/hide-columns';
import { BaseEvent, BaseEventImplement } from '@/interaction/base-event';
import {
  S2Event,
  InteractionKeyboardKey,
  InteractionStateName,
  InterceptType,
  CellTypes,
  TOOLTIP_OPERATOR_HIDDEN_COLUMNS_MENU,
} from '@/common/constant';
import {
  TooltipOperation,
  TooltipOperatorMenu,
  TooltipOperatorOptions,
} from '@/common/interface';
import { Node } from '@/facet/layout/node';
import { mergeCellInfo, getTooltipOptions } from '@/utils/tooltip';

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
        if (event.key === InteractionKeyboardKey.META) {
          this.isMultiSelection = true;
        }
      },
    );
  }

  private bindKeyboardUp() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARD_UP, (event: KeyboardEvent) => {
      if (event.key === InteractionKeyboardKey.META) {
        this.isMultiSelection = false;
        this.spreadsheet.interaction.removeIntercepts([InterceptType.CLICK]);
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
    const lastState = interaction.getState();
    const cell = this.spreadsheet.getCell(event.target);
    const meta = cell?.getMeta() as Node;

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
        interaction.getActiveCells(),
      );
      this.showTooltip(event);
    }
  };

  private showTooltip(event: CanvasEvent) {
    const { operation, showTooltip } = getTooltipOptions(
      this.spreadsheet,
      event,
    );
    if (!showTooltip) {
      return;
    }
    const { interaction } = this.spreadsheet;
    const cellInfos = interaction.isSelectedState()
      ? mergeCellInfo(interaction.getActiveCells())
      : [];

    const operator = this.getTooltipOperator(event, operation);
    this.spreadsheet.showTooltipWithInfo(event, cellInfos, {
      showSingleTips: true,
      operator,
    });
  }

  private getTooltipOperator(
    event: CanvasEvent,
    operation: TooltipOperation,
  ): TooltipOperatorOptions {
    const cell = this.spreadsheet.getCell(event.target);
    const cellMeta = cell.getMeta?.();
    const isColCell = cell.cellType === CellTypes.COL_CELL;
    // 是叶子节点, 并且是列头单元格, 且大于一个时, 显示隐藏按钮
    const isMultiColumns = this.spreadsheet.getColumnNodes().length > 1;
    const enableHiddenColumnOperator =
      isColCell && isMultiColumns && cellMeta.isLeaf && operation.hiddenColumns;

    const hiddenColumnsMenu: TooltipOperatorMenu =
      enableHiddenColumnOperator && {
        ...TOOLTIP_OPERATOR_HIDDEN_COLUMNS_MENU,
        onClick: () => {
          this.hideSelectedColumns();
        },
      };

    const operator: TooltipOperatorOptions = {
      onClick: operation.onClick,
      menus: compact([hiddenColumnsMenu, ...(operation.menus || [])]),
    };
    return operator;
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
  public hideSelectedColumns() {
    const { interaction } = this.spreadsheet;

    const selectedColumnNodes = interaction
      .getActiveCells()
      .map((cell) => cell.getMeta());

    if (this.spreadsheet.isTableMode()) {
      const selectedColumnFields = selectedColumnNodes.map(
        ({ field }) => field,
      );
      // 兼容多选
      hideColumnsByThunkGroup(this.spreadsheet, selectedColumnFields, true);
    } else {
      const selectedColumnFields = selectedColumnNodes.map(({ id }) => id);
      hideColumns(this.spreadsheet, selectedColumnFields, true);
    }
  }

  private handleExpandIconClick(node: Node) {
    const lastHiddenColumnsDetail = this.spreadsheet.store.get(
      'hiddenColumnsDetail',
      [],
    );
    const { hideColumnNodes = [] } =
      lastHiddenColumnsDetail.find(({ displaySiblingNode }) =>
        isEqualDisplaySiblingNodeId(displaySiblingNode, node.id),
      ) || {};

    const { hiddenColumnFields: lastHideColumnFields } =
      this.spreadsheet.options.interaction;

    const willDisplayColumnFields = hideColumnNodes.map((hideColumnNode) =>
      this.spreadsheet.isTableMode() ? hideColumnNode.field : hideColumnNode.id,
    );
    const hiddenColumnFields = difference(
      lastHideColumnFields,
      willDisplayColumnFields,
    );

    const hiddenColumnsDetail = lastHiddenColumnsDetail.filter(
      ({ displaySiblingNode }) =>
        !isEqualDisplaySiblingNodeId(displaySiblingNode, node.id),
    );

    this.spreadsheet.setOptions({
      interaction: {
        hiddenColumnFields,
      },
    });
    this.spreadsheet.store.set('hiddenColumnsDetail', hiddenColumnsDetail);
    this.spreadsheet.interaction.reset();
    this.spreadsheet.render(false);
  }
}
