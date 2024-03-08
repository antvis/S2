import type { FederatedPointerEvent as CanvasEvent } from '@antv/g';
import { difference, findLast } from 'lodash';
import {
  CellType,
  getTooltipOperatorHiddenColumnsMenu,
  InterceptType,
  S2Event,
} from '../../../common/constant';
import type {
  TooltipBaseOperatorMenuItem,
  TooltipOperation,
  TooltipOperatorOptions,
} from '../../../common/interface';
import type { Node } from '../../../facet/layout/node';
import {
  BaseEvent,
  type BaseEventImplement,
} from '../../../interaction/base-event';
import {
  hideColumnsByThunkGroup,
  isEqualDisplaySiblingNodeId,
} from '../../../utils/hide-columns';
import {
  isMouseEventWithMeta,
  isMultiSelectionKey,
} from '../../../utils/interaction/select-event';
import {
  getTooltipOptions,
  getTooltipVisibleOperator,
  mergeCellInfo,
} from '../../../utils/tooltip';
import { SeriesNumberCell } from '../../../cell';
import type { ViewMeta } from './../../../common/interface/basic';

export class RowColumnClick extends BaseEvent implements BaseEventImplement {
  private isMultiSelection = false;

  public bindEvents() {
    this.bindKeyboardDown();
    this.bindKeyboardUp();
    this.bindColCellClick();
    this.bindRowCellClick();
    this.bindTableColExpand();
    this.bindMouseMove();
  }

  public reset() {
    this.isMultiSelection = false;
    this.spreadsheet.interaction.removeIntercepts([InterceptType.CLICK]);
  }

  private bindKeyboardDown() {
    this.spreadsheet.on(
      S2Event.GLOBAL_KEYBOARD_DOWN,
      (event: KeyboardEvent) => {
        if (isMultiSelectionKey(event)) {
          this.isMultiSelection = true;
        }
      },
    );
  }

  private bindKeyboardUp() {
    this.spreadsheet.on(S2Event.GLOBAL_KEYBOARD_UP, (event: KeyboardEvent) => {
      if (isMultiSelectionKey(event)) {
        this.reset();
      }
    });
  }

  private bindMouseMove() {
    this.spreadsheet.on(S2Event.GLOBAL_MOUSE_MOVE, (event) => {
      // 当快捷键被系统拦截后，按需补充调用一次 reset
      if (this.isMultiSelection && !isMouseEventWithMeta(event)) {
        this.reset();
      }
    });
  }

  private bindRowCellClick() {
    this.spreadsheet.on(S2Event.ROW_CELL_CLICK, (event: CanvasEvent) => {
      this.handleRowColClick(event);
    });
  }

  private bindColCellClick() {
    this.spreadsheet.on(S2Event.COL_CELL_CLICK, (event: CanvasEvent) => {
      this.handleRowColClick(event);
    });
  }

  private handleRowColClick = (event: CanvasEvent) => {
    event.stopPropagation();

    if (this.isLinkFieldText(event.target)) {
      return;
    }

    const { interaction, options } = this.spreadsheet;
    const cell = this.spreadsheet.getCell(event.target)!;

    if (cell instanceof SeriesNumberCell) {
      return;
    }

    const { multiSelection: enableMultiSelection } = options.interaction!;
    // 关闭了多选就算按下了 Ctrl/Commend, 行/列也按单选处理
    const isMultiSelection = !!(enableMultiSelection && this.isMultiSelection);
    const success = interaction.selectHeaderCell({
      cell,
      isMultiSelection,
    });

    if (success) {
      this.showTooltip(event);
    }
  };

  private showTooltip(event: CanvasEvent) {
    const { operation, enable: showTooltip } = getTooltipOptions(
      this.spreadsheet,
      event,
    )!;

    if (!showTooltip) {
      return;
    }

    const { interaction } = this.spreadsheet;
    const cellInfos = interaction.isSelectedState()
      ? mergeCellInfo(interaction.getActiveCells())
      : [];

    const operator = this.getTooltipOperator(event, operation!);

    this.spreadsheet.showTooltipWithInfo(event, cellInfos, {
      onlyShowCellText: true,
      operator,
    });
  }

  private getTooltipOperator(
    event: CanvasEvent,
    operation: TooltipOperation,
  ): TooltipOperatorOptions {
    const cell = this.spreadsheet.getCell(event.target)!;
    const cellMeta = cell.getMeta() as Node;
    const isColCell = cell.cellType === CellType.COL_CELL;

    // 只有一个叶子节点时, 不显示隐藏按钮
    const isOnlyOneLeafColumn =
      this.spreadsheet.facet.getColLeafNodes().length === 1;

    const TOOLTIP_OPERATOR_HIDDEN_COLUMNS_MENU =
      getTooltipOperatorHiddenColumnsMenu();

    const enableHiddenColumnOperator =
      isColCell &&
      !isOnlyOneLeafColumn &&
      cellMeta.isLeaf &&
      operation.hiddenColumns;

    const hiddenColumnsMenu: TooltipBaseOperatorMenuItem = {
      ...TOOLTIP_OPERATOR_HIDDEN_COLUMNS_MENU,
      onClick: () => {
        this.hideSelectedColumns();
      },
    };

    const menus = enableHiddenColumnOperator ? [hiddenColumnsMenu] : [];

    return getTooltipVisibleOperator(operation, {
      defaultMenus: menus,
      cell,
    });
  }

  private bindTableColExpand() {
    this.spreadsheet.on(S2Event.COL_CELL_EXPANDED, (node) => {
      this.handleExpandIconClick(node);
    });
  }

  private getHideColumnField = (node: Node | ViewMeta) => {
    if ((node as Node).extra?.isCustomNode) {
      return node.id;
    }

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
  public async hideSelectedColumns(): Promise<void> {
    const { interaction } = this.spreadsheet;

    const selectedColumnNodes = interaction
      .getActiveCells()
      .map((cell) => cell.getMeta());

    const selectedColumnFields = selectedColumnNodes.map(
      this.getHideColumnField,
    ) as string[];

    // 兼容多选
    await hideColumnsByThunkGroup(this.spreadsheet, selectedColumnFields, true);
  }

  private handleExpandIconClick(node: Node) {
    const lastHiddenColumnsDetail = this.spreadsheet.store.get(
      'hiddenColumnsDetail',
      [],
    );

    // 当前单元格的前/后节点都被隐藏时, 会出现两个展开按钮, 优先展开靠右的
    const { hideColumnNodes = [] } =
      findLast(lastHiddenColumnsDetail, ({ displaySiblingNode }) =>
        isEqualDisplaySiblingNodeId(displaySiblingNode, node.id),
      ) || {};

    const { hiddenColumnFields: lastHideColumnFields } =
      this.spreadsheet.options.interaction!;

    const willDisplayColumnFields = hideColumnNodes.map(
      this.getHideColumnField,
    );
    const hiddenColumnFields = difference(
      lastHideColumnFields,
      willDisplayColumnFields,
    ) as string[];

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
