import { concat, filter, forEach, isEmpty } from 'lodash';
import {
  DataCellClick,
  MergedCellsClick,
  RowColumnClick,
  RowTextClick,
} from './base-interaction/click';
import { HoverEvent } from './base-interaction/hover';
import { EventController } from './event-controller';
import { BrushSelection, DataCellMultiSelection, RowColResize } from './';
import { ColCell, DataCell, RowCell } from '@/cell';
import {
  CellTypes,
  InteractionName,
  InteractionStateName,
  INTERACTION_STATE_INFO_KEY,
  Intercept,
  InterceptType,
} from '@/common/constant';
import {
  CustomInteraction,
  InteractionStateInfo,
  S2CellType,
} from '@/common/interface';
import { ColHeader, RowHeader } from '@/facet/header';
import { BaseEvent } from '@/interaction/base-event';
import { SpreadSheet } from '@/sheet-type';
import { getAllPanelDataCell } from '@/utils/getAllPanelDataCell';
import { clearState, setState } from '@/utils/interaction/state-controller';
import { isMobile } from '@/utils/is-mobile';

export class RootInteraction {
  public spreadsheet: SpreadSheet;

  public interactions = new Map<string, BaseEvent>();

  // 用来标记需要拦截的交互，interaction和本身的hover等事件可能会有冲突，有冲突时在此屏蔽
  public intercept = new Set<Intercept>();

  // hover有keep-hover态，是个计时器，hover后800毫秒还在当前cell的情况下，该cell进入keep-hover状态
  // 在任何触发点击，或者点击空白区域时，说明已经不是hover了，因此需要取消这个计时器。
  public hoverTimer: number = null;

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
    this.eventController.clear();
    this.resetState();
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

  public isSelectedState() {
    const currentState = this.getState();
    return currentState?.stateName === InteractionStateName.SELECTED;
  }

  private isActiveCell(cell: S2CellType) {
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
    return this.getAllCells().filter((cell) => ids.includes(cell.getMeta().id));
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
    return getAllPanelDataCell(this.spreadsheet?.panelGroup?.get('children'));
  }

  public getAllRowHeaderCells() {
    const children = this.spreadsheet?.foregroundGroup?.getChildren();
    const rowHeader = filter(
      children,
      (group) => group instanceof RowHeader,
    )?.[0];
    let currentNode = rowHeader?.cfg?.children;
    if (isEmpty(currentNode)) {
      return [];
    }
    while (!currentNode[0]?.cellType) {
      currentNode = currentNode[0]?.cfg?.children;
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
    let currentNode = colHeader?.cfg?.children;
    if (isEmpty(currentNode)) {
      return [];
    }
    while (!currentNode[0]?.cellType) {
      currentNode = currentNode[0]?.cfg?.children;
    }

    const colCells = currentNode;
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
    this.spreadsheet.interaction.changeState({
      stateName: InteractionStateName.ALL_SELECTED,
    });
  };

  /**
   * 注册交互（组件按自己的场景写交互，继承此方法注册）
   * @param options
   */
  private registerInteractions() {
    this.interactions.clear();

    this.interactions.set(
      InteractionName.DATA_CELL_CLICK,
      new DataCellClick(this.spreadsheet),
    );
    this.interactions.set(
      InteractionName.ROW_COLUMN_CLICK,
      new RowColumnClick(this.spreadsheet),
    );
    this.interactions.set(
      InteractionName.ROW_TEXT_CLICK,
      new RowTextClick(this.spreadsheet),
    );
    this.interactions.set(
      InteractionName.MERGED_CELLS_CLICK,
      new MergedCellsClick(this.spreadsheet),
    );
    this.interactions.set(
      InteractionName.HOVER,
      new HoverEvent(this.spreadsheet),
    );

    if (!isMobile()) {
      this.interactions.set(
        InteractionName.BRUSH_SELECTION,
        new BrushSelection(this.spreadsheet),
      );
      this.interactions.set(
        InteractionName.COL_ROW_RESIZE,
        new RowColResize(this.spreadsheet),
      );
      this.interactions.set(
        InteractionName.COL_ROW_MULTI_SELECTION,
        new DataCellMultiSelection(this.spreadsheet),
      );
    }

    const customInteractions = this.spreadsheet.options?.customInteractions;
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

  public reset() {
    this.spreadsheet.interaction.clearState();
    this.spreadsheet.hideTooltip();
    this.spreadsheet.interaction.intercept.clear();
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
      this.spreadsheet.interaction.intercept.add(interceptType);
    });
  }

  public hasIntercepts(interceptTypes: InterceptType[] = []) {
    return interceptTypes.some((interceptType) =>
      this.spreadsheet.interaction.intercept.has(interceptType),
    );
  }

  public removeIntercepts(interceptTypes: InterceptType[] = []) {
    interceptTypes.forEach((interceptType) => {
      this.spreadsheet.interaction.intercept.delete(interceptType);
    });
  }
}
