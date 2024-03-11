import {
  concat,
  find,
  forEach,
  isBoolean,
  isEmpty,
  isNil,
  map,
  unionBy,
} from 'lodash';
import { type MergedCell } from '../cell';
import {
  CellType,
  INTERACTION_STATE_INFO_KEY,
  InteractionName,
  InteractionStateName,
  InterceptType,
  S2Event,
} from '../common/constant';
import type {
  BrushSelectionInfo,
  BrushSelectionOptions,
  CellMeta,
  CustomInteraction,
  InteractionCellHighlightOptions,
  InteractionStateInfo,
  Intercept,
  MergedCellInfo,
  S2CellType,
  SelectHeaderCellInfo,
  ViewMeta,
} from '../common/interface';
import type { Node } from '../facet/layout/node';
import type { SpreadSheet } from '../sheet-type';
import { hideColumnsByThunkGroup } from '../utils/hide-columns';
import {
  getActiveHoverHeaderCells,
  updateAllColHeaderCellState,
} from '../utils/interaction/hover-event';
import { mergeCell, unmergeCell } from '../utils/interaction/merge-cell';
import {
  getCellMeta,
  getRowCellForSelectedCell,
} from '../utils/interaction/select-event';
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
import { ColCellBrushSelection } from './brush-selection/col-brush-selection';
import { DataCellBrushSelection } from './brush-selection/data-cell-brush-selection';
import { RowCellBrushSelection } from './brush-selection/row-brush-selection';
import { DataCellMultiSelection } from './data-cell-multi-selection';
import { EventController } from './event-controller';
import { RangeSelection } from './range-selection';
import { RowColumnResize } from './row-column-resize';
import { SelectedCellMove } from './selected-cell-move';

export class RootInteraction {
  public spreadsheet: SpreadSheet;

  public interactions = new Map<string, BaseEvent>();

  // 用来标记需要拦截的交互，interaction 和本身的 hover 等事件可能会有冲突，有冲突时在此屏蔽
  public intercepts = new Set<Intercept>();

  /*
   * hover有 keep-hover 态，是个计时器，hover后 800毫秒还在当前 cell 的情况下，该 cell 进入 keep-hover 状态
   * 在任何触发点击，或者点击空白区域时，说明已经不是hover了，因此需要取消这个计时器。
   */
  private hoverTimer: number | null = null;

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
    return [
      InteractionStateName.SELECTED,
      InteractionStateName.ROW_CELL_BRUSH_SELECTED,
      InteractionStateName.COL_CELL_BRUSH_SELECTED,
      InteractionStateName.DATA_CELL_BRUSH_SELECTED,
    ].some((stateName) => {
      return this.isStateOf(stateName);
    });
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
  public getCells(cellType?: CellType[]): CellMeta[] {
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
    const allCells = this.spreadsheet.facet?.getCells();

    // 这里的顺序要以 ids 中的顺序为准，代表点击 cell 的顺序
    return map(ids, (id) =>
      find(allCells, (cell) => cell?.getMeta()?.id === id),
    ).filter(Boolean) as S2CellType[];
  }

  public getActiveDataCells(): S2CellType[] {
    return this.getActiveCells().filter(
      (cell) => cell.cellType === CellType.DATA_CELL,
    );
  }

  public getActiveRowCells(): S2CellType[] {
    return this.getActiveCells().filter(
      (cell) => cell.cellType === CellType.ROW_CELL,
    );
  }

  public getActiveColCells(): S2CellType[] {
    return this.getActiveCells().filter(
      (cell) => cell.cellType === CellType.COL_CELL,
    );
  }

  public clearStyleIndependent() {
    if (
      !this.isSelectedState() &&
      !this.isHoverState() &&
      !this.isAllSelectedState()
    ) {
      return;
    }

    this.spreadsheet.facet.getDataCells().forEach((cell) => {
      cell.hideInteractionShape();
    });
  }

  public getUnSelectedDataCells() {
    return this.spreadsheet.facet
      .getDataCells()
      .filter((cell) => !this.isActiveCell(cell));
  }

  public selectAll = () => {
    this.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });
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
    const isColCell = cell?.cellType === CellType.COL_CELL;
    const lastState = this.getState();
    const isSelectedCell = this.isSelectedCell(cell);
    const isMultiSelected =
      selectHeaderCellInfo?.isMultiSelection && this.isSelectedState();

    // 如果是已选中的单元格, 则取消选中, 兼容行列多选 (含叶子节点)
    let childrenNodes = isSelectedCell
      ? []
      : this.spreadsheet.facet.getCellChildrenNodes(cell);
    let selectedCells = isSelectedCell ? [] : [getCellMeta(cell)];

    if (isMultiSelected) {
      selectedCells = concat(lastState?.cells || [], selectedCells);
      childrenNodes = concat(lastState?.nodes || [], childrenNodes);

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

    // 禁止跨单元格选择, 这样计算出来的数据和交互没有任何意义.
    if (unionBy(selectedCells, 'type').length > 1) {
      return;
    }

    const nodes = isEmpty(childrenNodes)
      ? [cell.getMeta() as Node]
      : childrenNodes;

    // 兼容行列多选 (高亮 行/列头 以及相对应的数值单元格)
    this.changeState({
      cells: selectedCells,
      nodes,
      stateName: InteractionStateName.SELECTED,
    });

    const selectedCellIds = selectedCells.map(({ id }) => id);

    this.updateCells(this.spreadsheet.facet.getHeaderCells(selectedCellIds));

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

  public async hideColumns(
    hiddenColumnFields: string[] = [],
    forceRender = true,
  ): Promise<void> {
    await hideColumnsByThunkGroup(
      this.spreadsheet,
      hiddenColumnFields,
      forceRender,
    );
  }

  private getBrushSelectionInfo(
    brushSelection?: boolean | BrushSelectionOptions,
  ): BrushSelectionInfo {
    if (isBoolean(brushSelection)) {
      return {
        dataCellBrushSelection: brushSelection,
        rowCellBrushSelection: brushSelection,
        colCellBrushSelection: brushSelection,
      };
    }

    return {
      dataCellBrushSelection: brushSelection?.dataCell ?? false,
      rowCellBrushSelection: brushSelection?.rowCell ?? false,
      colCellBrushSelection: brushSelection?.colCell ?? false,
    };
  }

  private getDefaultInteractions() {
    const {
      resize,
      brushSelection,
      multiSelection,
      rangeSelection,
      selectedCellMove,
    } = this.spreadsheet.options.interaction!;
    const {
      dataCellBrushSelection,
      rowCellBrushSelection,
      colCellBrushSelection,
    } = this.getBrushSelectionInfo(brushSelection);

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
        key: InteractionName.DATA_CELL_BRUSH_SELECTION,
        interaction: DataCellBrushSelection,
        enable: !isMobile() && dataCellBrushSelection,
      },
      {
        key: InteractionName.ROW_CELL_BRUSH_SELECTION,
        interaction: RowCellBrushSelection,
        enable: !isMobile() && rowCellBrushSelection,
      },
      {
        key: InteractionName.COL_CELL_BRUSH_SELECTION,
        interaction: ColCellBrushSelection,
        enable: !isMobile() && colCellBrushSelection,
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
    const { customInteractions } = this.spreadsheet.options.interaction!;

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
    this.spreadsheet.container.render();
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
    this.updateCells(this.spreadsheet.facet.getDataCells());
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
    clearTimeout(this.hoverTimer!);
  }

  public setHoverTimer(timer: number) {
    this.hoverTimer = timer;
  }

  public getHoverTimer() {
    return this.hoverTimer;
  }

  public getSelectedCellHighlight(): InteractionCellHighlightOptions {
    const { selectedCellHighlight } = this.spreadsheet.options.interaction!;

    if (isBoolean(selectedCellHighlight)) {
      return {
        rowHeader: selectedCellHighlight,
        colHeader: selectedCellHighlight,
        currentRow: selectedCellHighlight,
        currentCol: selectedCellHighlight,
      };
    }

    const {
      rowHeader = false,
      colHeader = false,
      currentRow = false,
      currentCol = false,
    } = (selectedCellHighlight as unknown as InteractionCellHighlightOptions) ??
    {};

    return {
      rowHeader,
      colHeader,
      currentRow,
      currentCol,
    };
  }

  public getHoverAfterScroll(): boolean {
    return this.spreadsheet.options.interaction!.hoverAfterScroll!;
  }

  public getHoverHighlight(): InteractionCellHighlightOptions {
    const { hoverHighlight } = this.spreadsheet.options.interaction!;

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
    } = hoverHighlight ?? ({} as InteractionCellHighlightOptions);

    return {
      rowHeader,
      colHeader,
      currentRow,
      currentCol,
    };
  }

  public getBrushSelection(): BrushSelectionOptions {
    const { brushSelection } = this.spreadsheet.options.interaction!;

    if (isBoolean(brushSelection)) {
      return {
        dataCell: brushSelection,
        rowCell: brushSelection,
        colCell: brushSelection,
      };
    }

    const {
      dataCell = false,
      rowCell = false,
      colCell = false,
    } = brushSelection ?? ({} as BrushSelectionOptions);

    return {
      dataCell,
      rowCell,
      colCell,
    };
  }

  public updateDataCellRelevantHeaderCells(
    stateName: InteractionStateName,
    meta: ViewMeta,
  ) {
    this.updateDataCellRelevantColCells(stateName, meta);
    this.updateDataCellRelevantRowCells(stateName, meta);
  }

  public updateDataCellRelevantRowCells(
    stateName: InteractionStateName,
    meta: ViewMeta,
  ) {
    const { rowId } = meta;
    const { facet, interaction } = this.spreadsheet;
    const isHoverState = stateName === InteractionStateName.HOVER;
    const { rowHeader } = isHoverState
      ? interaction.getHoverHighlight()
      : interaction.getSelectedCellHighlight();

    if (rowHeader && rowId) {
      const activeRowCells = isHoverState
        ? getActiveHoverHeaderCells(
            rowId,
            facet.getRowCells(),
            this.spreadsheet.isHierarchyTreeType(),
          )
        : getRowCellForSelectedCell(meta, this.spreadsheet);

      const activeSeriesNumberCells = facet
        .getSeriesNumberCells()
        .filter((seriesNumberCell) => {
          return activeRowCells.find(
            (rowCell) => rowCell.getMeta().y === seriesNumberCell.getMeta().y,
          );
        });

      const activeHeaderCells = [...activeSeriesNumberCells, ...activeRowCells];

      forEach(activeHeaderCells, (cell) => {
        cell.updateByState(stateName);
      });
    }
  }

  public updateDataCellRelevantColCells(
    stateName: InteractionStateName,
    meta: ViewMeta,
  ) {
    const { colId } = meta;
    const { facet, interaction } = this.spreadsheet;
    const { colHeader } =
      stateName === InteractionStateName.HOVER
        ? interaction.getHoverHighlight()
        : interaction.getSelectedCellHighlight();

    if (colHeader && colId) {
      updateAllColHeaderCellState(colId, facet.getColCells(), stateName);
    }
  }
}
