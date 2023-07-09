import type { IElement } from '@antv/g-canvas';
import { concat, find, forEach, isBoolean, isEmpty, isNil, map } from 'lodash';
import { ColCell, DataCell, MergedCell, RowCell } from '../cell';
import {
  CellTypes,
  INTERACTION_STATE_INFO_KEY,
  InteractionName,
  InteractionStateName,
  InterceptType,
  S2Event,
} from '../common/constant';
import type {
  BrushSelection,
  BrushSelectionInfo,
  CellMeta,
  CustomInteraction,
  InteractionCellHighlight,
  InteractionStateInfo,
  Intercept,
  MergedCellInfo,
  S2CellType,
  SelectHeaderCellInfo,
} from '../common/interface';
import { ColHeader, RowHeader } from '../facet/header';
import { Node } from '../facet/layout/node';
import type { SpreadSheet } from '../sheet-type';
import { getAllChildCells } from '../utils/get-all-child-cells';
import { hideColumnsByThunkGroup } from '../utils/hide-columns';
import { mergeCell, unmergeCell } from '../utils/interaction/merge-cell';
import { getCellMeta } from '../utils/interaction/select-event';
import { clearState, setState } from '../utils/interaction/state-controller';
import { isMobile } from '../utils/is-mobile';
import type { BaseEvent } from './base-event';
import {
  DataCellClick,
  MergedCellClick,
  RowColumnClick,
  RowTextClick,
} from './base-interaction/click';
import { CornerCellClick } from './base-interaction/click/corner-cell-click';
import { HoverEvent } from './base-interaction/hover';
import { ColBrushSelection } from './brush-selection/col-brush-selection';
import { DataCellBrushSelection } from './brush-selection/data-cell-brush-selection';
import { RowBrushSelection } from './brush-selection/row-brush-selection';
import { DataCellMultiSelection } from './data-cell-multi-selection';
import { EventController } from './event-controller';
import { RangeSelection } from './range-selection';
import { RowColumnResize } from './row-column-resize';
import { SelectedCellMove } from './selected-cell-move';

export class RootInteraction {
  public spreadsheet: SpreadSheet;

  public interactions = new Map<string, BaseEvent>();

  // 用来标记需要拦截的交互，interaction和本身的hover等事件可能会有冲突，有冲突时在此屏蔽
  public intercepts = new Set<Intercept>();

  // hover有keep-hover态，是个计时器，hover后800毫秒还在当前cell的情况下，该cell进入keep-hover状态
  // 在任何触发点击，或者点击空白区域时，说明已经不是hover了，因此需要取消这个计时器。
  private hoverTimer: number = null;

  public eventController: EventController;

  private defaultState: InteractionStateInfo = {
    cells: [],
    force: false,
  };

  public constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
    this.registerEventController();
    this.registerInteractions();
    window.addEventListener(
      'visibilitychange',
      this.onTriggerInteractionsResetEffect,
    );
  }

  public destroy() {
    this.interactions.clear();
    this.intercepts.clear();
    this.eventController.clear();
    this.clearHoverTimer();
    this.resetState();
    window.removeEventListener(
      'visibilitychange',
      this.onTriggerInteractionsResetEffect,
    );
  }

  public reset() {
    this.clearState();
    this.clearHoverTimer();
    this.intercepts.clear();
    this.spreadsheet.hideTooltip();
  }

  private onTriggerInteractionsResetEffect = () => {
    this.interactions.forEach((interaction) => {
      interaction.reset();
    });
  };

  public setState(interactionStateInfo: InteractionStateInfo) {
    setState(this.spreadsheet, interactionStateInfo);
  }

  public getState() {
    return (
      this.spreadsheet.store.get(INTERACTION_STATE_INFO_KEY) ||
      this.defaultState
    );
  }

  public setInteractedCells(cell: S2CellType) {
    const interactedCells = this.getInteractedCells().concat([cell]);
    const state = this.getState();
    state.interactedCells = interactedCells;

    this.setState(state);
  }

  public getInteractedCells() {
    const currentState = this.getState();
    return currentState?.interactedCells || [];
  }

  public resetState() {
    this.spreadsheet.store.set(INTERACTION_STATE_INFO_KEY, this.defaultState);
  }

  public getCurrentStateName() {
    return this.getState().stateName;
  }

  public isEqualStateName(stateName: InteractionStateName) {
    return this.getCurrentStateName() === stateName;
  }

  private isStateOf(stateName: InteractionStateName) {
    const currentState = this.getState();
    return currentState?.stateName === stateName;
  }

  public isSelectedState() {
    return this.isStateOf(InteractionStateName.SELECTED);
  }

  public isAllSelectedState() {
    return this.isStateOf(InteractionStateName.ALL_SELECTED);
  }

  public isHoverFocusState() {
    return this.isStateOf(InteractionStateName.HOVER_FOCUS);
  }

  public isHoverState() {
    return this.isStateOf(InteractionStateName.HOVER);
  }

  public isActiveCell(cell: S2CellType): boolean {
    return !!this.getCells().find((meta) => cell.getMeta().id === meta.id);
  }

  public isSelectedCell(cell: S2CellType): boolean {
    return this.isSelectedState() && this.isActiveCell(cell);
  }

  // 获取当前 interaction 记录的 Cells 元信息列表，包括不在可视区域内的格子
  public getCells(cellType?: CellTypes[]): CellMeta[] {
    const currentState = this.getState();
    const cells = currentState?.cells || [];
    if (isNil(cellType)) {
      return cells;
    }
    return cells.filter((cell) => cellType.includes(cell.type));
  }

  // 获取 cells 中在可视区域内的实例列表
  public getActiveCells(): S2CellType[] {
    const ids = this.getCells().map((item) => item.id);
    const allCells = this.getAllCells();
    // 这里的顺序要以 ids 中的顺序为准，代表点击 cell 的顺序
    return map(ids, (id) =>
      find(allCells, (cell) => cell?.getMeta()?.id === id),
    ).filter((cell) => cell); // 去除 undefined
  }

  public clearStyleIndependent() {
    if (
      !this.isSelectedState() &&
      !this.isHoverState() &&
      !this.isAllSelectedState()
    ) {
      return;
    }

    this.getPanelGroupAllDataCells().forEach((cell) => {
      cell.hideInteractionShape();
    });
  }

  public getPanelGroupAllUnSelectedDataCells() {
    return this.getPanelGroupAllDataCells().filter(
      (cell) => !this.isActiveCell(cell),
    );
  }

  public getPanelGroupAllDataCells(): DataCell[] {
    return getAllChildCells(
      this.spreadsheet.panelGroup?.getChildren() as IElement[],
      DataCell,
    );
  }

  public getAllRowHeaderCells(): RowCell[] {
    const children = this.spreadsheet.foregroundGroup?.getChildren() || [];
    const rowHeader = children.find((group) => group instanceof RowHeader);
    const headerChildren = rowHeader?.cfg?.children || [];

    return getAllChildCells<RowCell>(headerChildren, RowCell).filter(
      (cell: S2CellType) => cell.cellType === CellTypes.ROW_CELL,
    );
  }

  public getAllColHeaderCells(): ColCell[] {
    const children = this.spreadsheet.foregroundGroup?.getChildren() || [];
    const colHeader = children.find((group) => group instanceof ColHeader);
    const headerChildren = colHeader?.cfg?.children || [];

    return getAllChildCells<ColCell>(headerChildren, ColCell).filter(
      (cell: S2CellType) => cell.cellType === CellTypes.COL_CELL,
    );
  }

  public getRowColActiveCells(ids: string[]) {
    return concat<S2CellType>(
      this.getAllRowHeaderCells(),
      this.getAllColHeaderCells(),
    ).filter((item) => ids.includes(item.getMeta().id));
  }

  public getAllCells() {
    return concat<S2CellType>(
      this.getPanelGroupAllDataCells(),
      this.getAllRowHeaderCells(),
      this.getAllColHeaderCells(),
    );
  }

  public selectAll = () => {
    this.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });
  };

  public getCellChildrenNodes = (cell: S2CellType): Node[] => {
    const meta = cell?.getMeta?.() as Node;
    const isRowCell = cell?.cellType === CellTypes.ROW_CELL;
    const isHierarchyTree = this.spreadsheet.isHierarchyTreeType();

    // 树状模式的行头点击不需要遍历当前行头的所有子节点，因为只会有一级
    if (isHierarchyTree && isRowCell) {
      return Node.getAllLeaveNodes(meta).filter(
        (node) => node.rowIndex === meta.rowIndex,
      );
    }

    // 平铺模式 或 树状模式的列头点击遍历所有子节点
    return Node.getAllChildrenNodes(meta);
  };

  public selectHeaderCell = (
    selectHeaderCellInfo: SelectHeaderCellInfo = {} as SelectHeaderCellInfo,
  ) => {
    const { cell } = selectHeaderCellInfo;
    if (isEmpty(cell)) {
      return;
    }

    const currentCellMeta = cell?.getMeta?.() as Node;
    if (!currentCellMeta || isNil(currentCellMeta?.x)) {
      return;
    }

    this.addIntercepts([InterceptType.HOVER]);

    const isHierarchyTree = this.spreadsheet.isHierarchyTreeType();
    const isColCell = cell?.cellType === CellTypes.COL_CELL;
    const lastState = this.getState();
    const isSelectedCell = this.isSelectedCell(cell);
    const isMultiSelected =
      selectHeaderCellInfo?.isMultiSelection && this.isSelectedState();

    // 如果是已选中的单元格, 则取消选中, 兼容行列多选 (含叶子节点)
    let childrenNodes = isSelectedCell ? [] : this.getCellChildrenNodes(cell);
    let selectedCells = isSelectedCell ? [] : [getCellMeta(cell)];

    if (isMultiSelected) {
      selectedCells = concat(lastState?.cells, selectedCells);
      childrenNodes = concat(lastState?.nodes, childrenNodes);

      if (isSelectedCell) {
        selectedCells = selectedCells.filter(
          ({ id }) => id !== currentCellMeta.id,
        );
        childrenNodes = childrenNodes.filter(
          (node) => !node?.id.includes(currentCellMeta.id),
        );
      }
    }

    if (isEmpty(selectedCells)) {
      this.reset();
      this.spreadsheet.emit(S2Event.GLOBAL_SELECTED, this.getActiveCells());
      return;
    }

    // 高亮所有的子节点, 但是只有叶子节点需要参与数据计算
    const needCalcNodes = childrenNodes.filter((node) => node?.isLeaf);
    // 兼容行列多选 (高亮 行/列头 以及相对应的数值单元格)
    this.changeState({
      cells: selectedCells,
      nodes: needCalcNodes,
      stateName: InteractionStateName.SELECTED,
    });

    const selectedCellIds = selectedCells.map(({ id }) => id);
    this.updateCells(this.getRowColActiveCells(selectedCellIds));

    // 平铺模式或者是树状模式下的列头单元格, 高亮子节点
    if (!isHierarchyTree || isColCell) {
      this.highlightNodes(childrenNodes);
    }

    this.spreadsheet.emit(S2Event.GLOBAL_SELECTED, this.getActiveCells());

    return true;
  };

  public highlightNodes = (nodes: Node[] = []) => {
    nodes.forEach((node) => {
      node?.belongsCell?.updateByState(
        InteractionStateName.SELECTED,
        node.belongsCell,
      );
    });
  };

  public mergeCells = (cellsInfo?: MergedCellInfo[], hideData?: boolean) => {
    mergeCell(this.spreadsheet, cellsInfo, hideData);
  };

  public unmergeCell = (removedCells: MergedCell) => {
    unmergeCell(this.spreadsheet, removedCells);
  };

  public hideColumns(hiddenColumnFields: string[] = [], forceRender = true) {
    hideColumnsByThunkGroup(this.spreadsheet, hiddenColumnFields, forceRender);
  }

  private getBrushSelectionInfo(
    brushSelection?: boolean | BrushSelection,
  ): BrushSelectionInfo {
    if (isBoolean(brushSelection)) {
      return {
        dataBrushSelection: brushSelection,
        rowBrushSelection: brushSelection,
        colBrushSelection: brushSelection,
      };
    }
    return {
      dataBrushSelection: brushSelection?.data ?? false,
      rowBrushSelection: brushSelection?.row ?? false,
      colBrushSelection: brushSelection?.col ?? false,
    };
  }

  private getDefaultInteractions() {
    const {
      resize,
      brushSelection,
      multiSelection,
      rangeSelection,
      selectedCellMove,
    } = this.spreadsheet.options.interaction;
    const { dataBrushSelection, rowBrushSelection, colBrushSelection } =
      this.getBrushSelectionInfo(brushSelection);

    return [
      {
        key: InteractionName.CORNER_CELL_CLICK,
        interaction: CornerCellClick,
      },
      {
        key: InteractionName.DATA_CELL_CLICK,
        interaction: DataCellClick,
      },
      {
        key: InteractionName.ROW_COLUMN_CLICK,
        interaction: RowColumnClick,
      },
      {
        key: InteractionName.ROW_TEXT_CLICK,
        interaction: RowTextClick,
      },
      {
        key: InteractionName.MERGED_CELLS_CLICK,
        interaction: MergedCellClick,
      },
      {
        key: InteractionName.HOVER,
        interaction: HoverEvent,
        enable: !isMobile(),
      },
      {
        key: InteractionName.BRUSH_SELECTION,
        interaction: DataCellBrushSelection,
        enable: !isMobile() && dataBrushSelection,
      },
      {
        key: InteractionName.ROW_BRUSH_SELECTION,
        interaction: RowBrushSelection,
        enable: !isMobile() && rowBrushSelection,
      },
      {
        key: InteractionName.COL_BRUSH_SELECTION,
        interaction: ColBrushSelection,
        enable: !isMobile() && colBrushSelection,
      },
      {
        key: InteractionName.COL_ROW_RESIZE,
        interaction: RowColumnResize,
        enable: !isMobile() && resize,
      },
      {
        key: InteractionName.DATA_CELL_MULTI_SELECTION,
        interaction: DataCellMultiSelection,
        enable: !isMobile() && multiSelection,
      },
      {
        key: InteractionName.RANGE_SELECTION,
        interaction: RangeSelection,
        enable: !isMobile() && rangeSelection,
      },
      {
        key: InteractionName.SELECTED_CELL_MOVE,
        interaction: SelectedCellMove,
        enable: !isMobile() && selectedCellMove,
      },
    ];
  }

  private registerInteractions() {
    const { customInteractions } = this.spreadsheet.options.interaction;

    this.interactions.clear();

    const defaultInteractions = this.getDefaultInteractions();
    defaultInteractions.forEach(({ key, interaction: Interaction, enable }) => {
      if (enable !== false) {
        this.interactions.set(key, new Interaction(this.spreadsheet));
      }
    });

    if (!isEmpty(customInteractions)) {
      forEach(customInteractions, (customInteraction: CustomInteraction) => {
        const CustomInteractionClass = customInteraction.interaction;
        this.interactions.set(
          customInteraction.key,
          new CustomInteractionClass(this.spreadsheet),
        );
      });
    }
  }

  private registerEventController() {
    this.eventController = new EventController(this.spreadsheet);
  }

  public draw() {
    this.spreadsheet.container.draw();
  }

  public clearState() {
    if (clearState(this.spreadsheet)) {
      this.draw();
    }
  }

  // 改变 cell 交互状态后，进行了更新和重新绘制
  public changeState(interactionStateInfo: InteractionStateInfo) {
    const { interaction } = this.spreadsheet;
    const {
      cells = [],
      force,
      stateName,
      onUpdateCells,
    } = interactionStateInfo;

    if (isEmpty(cells) && stateName === InteractionStateName.SELECTED) {
      if (force) {
        interaction.changeState({
          cells: [],
          stateName: InteractionStateName.UNSELECTED,
        });
      }
      return;
    }

    // 之前是全选状态，需要清除格子的样式
    if (this.getCurrentStateName() === InteractionStateName.ALL_SELECTED) {
      this.clearStyleIndependent();
    }

    this.clearState();
    this.setState(interactionStateInfo);

    // 更新单元格
    const update = () => {
      this.updatePanelGroupAllDataCells();
    };
    if (onUpdateCells) {
      onUpdateCells(this, update);
    } else {
      update();
    }
    this.draw();
  }

  public updatePanelGroupAllDataCells() {
    this.updateCells(this.getPanelGroupAllDataCells());
  }

  public updateCells(cells: S2CellType[] = []) {
    cells.forEach((cell) => {
      cell.update();
    });
  }

  public addIntercepts(interceptTypes: InterceptType[] = []) {
    interceptTypes.forEach((interceptType) => {
      this.intercepts.add(interceptType);
    });
  }

  public hasIntercepts(interceptTypes: InterceptType[] = []) {
    return interceptTypes.some((interceptType) =>
      this.intercepts.has(interceptType),
    );
  }

  public removeIntercepts(interceptTypes: InterceptType[] = []) {
    interceptTypes.forEach((interceptType) => {
      this.intercepts.delete(interceptType);
    });
  }

  public clearHoverTimer() {
    clearTimeout(this.hoverTimer);
  }

  public setHoverTimer(timer: number) {
    this.hoverTimer = timer;
  }

  public getHoverTimer() {
    return this.hoverTimer;
  }

  public getSelectedCellHighlight(): InteractionCellHighlight {
    const { selectedCellHighlight } = this.spreadsheet.options.interaction;

    if (isBoolean(selectedCellHighlight)) {
      return {
        rowHeader: selectedCellHighlight,
        colHeader: selectedCellHighlight,
        currentRow: false,
        currentCol: false,
      };
    }

    const {
      rowHeader = false,
      colHeader = false,
      currentRow = false,
      currentCol = false,
    } = selectedCellHighlight ?? {};

    return {
      rowHeader,
      colHeader,
      currentRow,
      currentCol,
    };
  }

  public getHoverAfterScroll(): boolean {
    return this.spreadsheet.options.interaction.hoverAfterScroll;
  }

  public getHoverHighlight(): InteractionCellHighlight {
    const { hoverHighlight } = this.spreadsheet.options.interaction;

    if (isBoolean(hoverHighlight)) {
      return {
        rowHeader: hoverHighlight,
        colHeader: hoverHighlight,
        currentRow: hoverHighlight,
        currentCol: hoverHighlight,
      };
    }

    const {
      rowHeader = false,
      colHeader = false,
      currentRow = false,
      currentCol = false,
    } = hoverHighlight ?? {};

    return {
      rowHeader,
      colHeader,
      currentRow,
      currentCol,
    };
  }

  public getBrushSelection(): BrushSelection {
    const { brushSelection } = this.spreadsheet.options.interaction;

    if (isBoolean(brushSelection)) {
      return {
        data: brushSelection,
        row: brushSelection,
        col: brushSelection,
      };
    }

    const { data = false, row = false, col = false } = brushSelection ?? {};

    return {
      data,
      row,
      col,
    };
  }
}
