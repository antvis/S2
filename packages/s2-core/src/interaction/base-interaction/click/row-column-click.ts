import { Event as CanvasEvent } from '@antv/g-canvas';
import { difference } from 'lodash';
import {
  hideColumnsByThunkGroup,
  isEqualDisplaySiblingNodeId,
} from '@/utils/hide-columns';
import { BaseEvent, BaseEventImplement } from '@/interaction/base-event';
import {
  S2Event,
  InteractionKeyboardKey,
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
import {
  mergeCellInfo,
  getTooltipOptions,
  getTooltipVisibleOperator,
} from '@/utils/tooltip';

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
    const cell = this.spreadsheet.getCell(event.target);

    if (interaction.isSelectedCell(cell)) {
      interaction.reset();
      return;
    }

    if (
      interaction.selectHeaderCell({
        cell,
        isTreeRowClick,
        isMultiSelection: this.isMultiSelection,
      })
    ) {
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
    const cellMeta = cell.getMeta();
    const isColCell = cell.cellType === CellTypes.COL_CELL;

    // 只有一个叶子节点时, 不显示隐藏按钮
    const isOnlyOneLeafColumn =
      this.spreadsheet.getColumnLeafNodes().length === 1;

    const enableHiddenColumnOperator =
      isColCell &&
      !isOnlyOneLeafColumn &&
      cellMeta.isLeaf &&
      operation.hiddenColumns;

    const hiddenColumnsMenu: TooltipOperatorMenu =
      enableHiddenColumnOperator && {
        ...TOOLTIP_OPERATOR_HIDDEN_COLUMNS_MENU,
        onClick: () => {
          this.hideSelectedColumns();
        },
      };

    return getTooltipVisibleOperator(operation, {
      defaultMenus: [hiddenColumnsMenu],
      cell,
    });
  }

  private bindTableColExpand() {
    this.spreadsheet.on(S2Event.LAYOUT_COLS_EXPANDED, (node) => {
      this.handleExpandIconClick(node);
    });
  }

  private getHideColumnField = (node: Node) => {
    return this.spreadsheet.isTableMode() ? node.field : node.id;
  };

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

    const selectedColumnFields = selectedColumnNodes.map(
      this.getHideColumnField,
    );
    // 兼容多选
    hideColumnsByThunkGroup(this.spreadsheet, selectedColumnFields, true);
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

    const willDisplayColumnFields = hideColumnNodes.map(
      this.getHideColumnField,
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
