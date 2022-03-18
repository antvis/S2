import { concat, filter, find, forEach, isEmpty, isNil, map } from 'lodash';
import { getCellMeta } from 'src/utils/interaction/select-event';
import type { IElement } from '@antv/g-canvas';
import {
  DataCellClick,
  MergedCellClick,
  RowColumnClick,
  RowTextClick,
} from './base-interaction/click';
import { HoverEvent } from './base-interaction/hover';
import { EventController } from './event-controller';
import { RangeSelection } from './range-selection';
import { SelectedCellMove } from './selected-cell-move';
import { BrushSelection, DataCellMultiSelection, RowColumnResize } from './';
import { hideColumnsByThunkGroup } from '@/utils/hide-columns';
import { Node } from '@/facet/layout/node';
import { ColCell, DataCell, MergedCell, RowCell } from '@/cell';
import {
  CellTypes,
  InteractionName,
  InteractionStateName,
  INTERACTION_STATE_INFO_KEY,
  InterceptType,
  S2Event,
} from '@/common/constant';
import {
  CustomInteraction,
  InteractionStateInfo,
  Intercept,
  MergedCellInfo,
  S2CellType,
  SelectHeaderCellInfo,
} from '@/common/interface';
import { ColHeader, RowHeader } from '@/facet/header';
import { BaseEvent } from '@/interaction/base-event';
import { SpreadSheet } from '@/sheet-type';
import { getAllChildCells } from '@/utils/get-all-child-cells';
import { clearState, setState } from '@/utils/interaction/state-controller';
import { isMobile } from '@/utils/is-mobile';
import { mergeCell, unmergeCell } from '@/utils/interaction/merge-cell';

export class RootInteraction {
  public spreadsheet: SpreadSheet;

  public interactions = new Map<string, BaseEvent>();

  // 用来标记需要拦截的交互，interaction和本身的hover等事件可能会有冲突，有冲突时在此屏蔽
  public intercepts = new Set<Intercept>();

  // hover有keep-hover态，是个计时器，hover后800毫秒还在当前cell的情况下，该cell进入keep-hover状态
  // 在任何触发点击，或者点击空白区域时，说明已经不是hover了，因此需要取消这个计时器。
  private hoverTimer: NodeJS.Timeout = null;

  public eventController: EventController;

  private defaultState: InteractionStateInfo = {
    cells: [],
    force: false,
  };

  public constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
    this.registerEventController();
    this.registerInteractions();
  }

  public destroy() {
    this.interactions.clear();
    this.intercepts.clear();
    this.eventController.clear();
    this.clearHoverTimer();
    this.resetState();
  }

  public reset() {
    this.clearState();
    this.clearHoverTimer();
    this.intercepts.clear();
    this.spreadsheet.hideTooltip();
  }

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

  public isHoverFocusState() {
    return this.isStateOf(InteractionStateName.HOVER_FOCUS);
  }

  public isHoverState() {
    return this.isStateOf(InteractionStateName.HOVER);
  }

  public isActiveCell(cell: S2CellType) {
    return this.getCells().find((meta) => cell.getMeta().id === meta.id);
  }

  public isSelectedCell(cell: S2CellType) {
    return this.isSelectedState() && this.isActiveCell(cell);
  }

  // 获取当前 interaction 记录的 Cells 元信息列表，包括不在可视区域内的格子
  public getCells() {
    const currentState = this.getState();
    return currentState?.cells || [];
  }

  // 获取 cells 中在可视区域内的实例列表
  public getActiveCells() {
    const ids = this.getCells().map((item) => item.id);
    const allCells = this.getAllCells();
    // 这里的顺序要以 ids 中的顺序为准，代表点击 cell 的顺序
    return map(ids, (id) =>
      find(allCells, (cell) => cell?.getMeta()?.id === id),
    ).filter((cell) => cell); // 去除 undefined
  }

  public clearStyleIndependent() {
    const currentState = this.getState();
    if (
      currentState?.stateName === InteractionStateName.SELECTED ||
      currentState?.stateName === InteractionStateName.HOVER
    ) {
      this.getPanelGroupAllDataCells().forEach((cell) => {
        cell.hideInteractionShape();
      });
    }
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

  public getAllRowHeaderCells() {
    const children = this.spreadsheet.foregroundGroup?.getChildren();
    const rowHeader = filter(
      children,
      (group) => group instanceof RowHeader,
    )?.[0];
    let currentNode = rowHeader?.cfg?.children;
    if (isEmpty(currentNode)) {
      return [];
    }
    while (!currentNode?.[0]?.cellType) {
      currentNode = currentNode?.[0]?.cfg?.children;
    }

    const rowCells = currentNode || [];
    return rowCells.filter(
      (cell: S2CellType) => cell.cellType === CellTypes.ROW_CELL,
    ) as RowCell[];
  }

  public getAllColHeaderCells() {
    const children = this.spreadsheet?.foregroundGroup?.getChildren();
    const colHeader = filter(
      children,
      (group) => group instanceof ColHeader,
    )[0];

    const headerChildren = colHeader?.cfg?.children;

    if (isEmpty(headerChildren)) {
      return [];
    }

    const colCells = getAllChildCells(headerChildren, ColCell);

    return colCells.filter(
      (cell: S2CellType) => cell.cellType === CellTypes.COL_CELL,
    ) as ColCell[];
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

  public selectHeaderCell = (selectHeaderCellInfo: SelectHeaderCellInfo) => {
    const { cell } = selectHeaderCellInfo || {};
    if (isEmpty(cell)) {
      return;
    }
    const lastState = this.getState();
    const meta = cell?.getMeta() as Node;
    if (isNil(meta.x)) {
      return;
    }
    this.addIntercepts([InterceptType.HOVER]);
    // 树状结构的行头点击不需要遍历当前行头的所有子节点，因为只会有一级
    let leafNodes = selectHeaderCellInfo?.isTreeRowClick
      ? Node.getAllLeavesOfNode(meta).filter(
          (node) => node.rowIndex === meta.rowIndex,
        )
      : Node.getAllChildrenNode(meta);
    let selectedCells = [getCellMeta(cell)];

    if (selectHeaderCellInfo?.isMultiSelection && this.isSelectedState()) {
      selectedCells = isEmpty(lastState?.cells)
        ? selectedCells
        : concat(lastState?.cells, selectedCells);
      leafNodes = isEmpty(lastState?.nodes)
        ? leafNodes
        : concat(lastState?.nodes, leafNodes);
    }

    // 兼容行列多选
    // Set the header cells (colCell or RowCell)  selected information and update the dataCell state.
    this.changeState({
      cells: selectedCells,
      nodes: leafNodes,
      stateName: InteractionStateName.SELECTED,
    });

    const selectedCellIds = selectedCells.map(({ id }) => id);
    // Update the interaction state of all the selected cells:  header cells(colCell or RowCell) and dataCells belong to them.
    this.updateCells(this.getRowColActiveCells(selectedCellIds));

    if (!selectHeaderCellInfo?.isTreeRowClick) {
      leafNodes.forEach((node) => {
        node?.belongsCell?.updateByState(
          InteractionStateName.SELECTED,
          node.belongsCell,
        );
      });
    }
    this.spreadsheet.emit(S2Event.GLOBAL_SELECTED, this.getActiveCells());

    return true;
  };

  public mergeCells = (cellsInfo?: MergedCellInfo[], hideData?: boolean) => {
    mergeCell(this.spreadsheet, cellsInfo, hideData);
  };

  public unmergeCell = (removedCells: MergedCell) => {
    unmergeCell(this.spreadsheet, removedCells);
  };

  public hideColumns(hiddenColumnFields: string[] = []) {
    hideColumnsByThunkGroup(this.spreadsheet, hiddenColumnFields, true);
  }

  private getDefaultInteractions() {
    const {
      resize,
      brushSelection,
      multiSelection,
      rangeSelection,
      selectedCellMove,
    } = this.spreadsheet.options.interaction;

    return [
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
        interaction: BrushSelection,
        enable: !isMobile() && brushSelection,
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
    clearState(this.spreadsheet);
    this.draw();
  }

  public changeState(interactionStateInfo: InteractionStateInfo) {
    const { interaction } = this.spreadsheet;
    const { cells, force, stateName } = interactionStateInfo;

    if (isEmpty(cells) && stateName === InteractionStateName.SELECTED) {
      if (force) {
        interaction.changeState({
          cells: [],
          stateName: InteractionStateName.UNSELECTED,
        });
      }
      return;
    }

    this.clearState();
    this.setState(interactionStateInfo);
    this.updatePanelGroupAllDataCells();
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

  public setHoverTimer(timer: NodeJS.Timeout) {
    this.hoverTimer = timer;
  }

  public getHoverTimer() {
    return this.hoverTimer;
  }
}
