import { clearState, setState } from '@/utils/interaction/state-controller';
import { isMobile } from '@/utils/is-mobile';
import { ColHeader, RowHeader } from 'src/facet/header';
import { get, includes, isEmpty, concat, merge, isEqual, filter } from 'lodash';
import { BrushSelection, DataCellMultiSelection, RowColResize } from './';
import {
  BaseEvent,
  CornerTextClick,
  DataCell,
  DataCellClick,
  InterceptEvent,
  InteractionEvent,
  HoverEvent,
  InteractionNames,
  InteractionStateInfo,
  InteractionStateName,
  INTERACTION_STATE_INFO_KEY,
  MergedCellsClick,
  RowColumnClick,
  RowTextClick,
  S2CellType,
  SpreadSheet,
  ColCell,
  RowCell,
} from '@/index';
import { BaseInteraction } from './base';
import { EventController } from './events/event-controller';
import { BaseCell } from '@/cell';

export class RootInteraction {
  public spreadsheet: SpreadSheet;

  public interactions = new Map<string, BaseInteraction>();

  // 用来标记需要拦截的事件，interaction和本身的hover等事件可能会有冲突，有冲突时在此屏蔽
  public interceptEvent = new Set<InterceptEvent>();

  public events = new Map<string, BaseEvent>();

  // hover有keep-hover态，是个计时器，hover后800毫秒还在当前cell的情况下，该cell进入keep-hover状态
  // 在任何触发点击，或者点击空白区域时，说明已经不是hover了，因此需要取消这个计时器。
  public hoverTimer: number = null;

  public eventController: EventController;

  private defaultState: InteractionStateInfo = {};

  public constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
    this.registerEventController();
    // 注意这俩的顺序，不要反过来，因为interaction中会屏蔽event，但是event不会屏蔽interaction
    this.registerInteractions();
    this.registerEvents();
  }

  public destroy() {
    this.events.clear();
    this.eventController.clear();
    this.resetState();
  }

  public setState(interactionStateInfo: InteractionStateInfo) {
    setState(interactionStateInfo, this.spreadsheet);
  }

  public getState() {
    return (
      this.spreadsheet.store.get(INTERACTION_STATE_INFO_KEY) ||
      this.defaultState
    );
  }

  public setChangedCells(cell: S2CellType) {
    const changedCells = this.getChangedCells().concat([cell]);
    const interactionInfo = merge(
      this.getState(),
      { changedCells: changedCells },
      {},
    );
    this.setState(interactionInfo);
  }

  public getChangedCells() {
    const currentState = this.getState();
    return currentState?.changedCells || [];
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

  public isSelectedCell(cell: S2CellType) {
    return this.isSelectedState() && includes(this.getActiveCells(), cell);
  }

  public getActiveCells() {
    const currentState = this.getState();
    return currentState?.cells || [];
  }

  public updateCellStyleByState() {
    const cells = this.getActiveCells();
    cells.forEach((cell) => {
      cell.updateByState(this.getCurrentStateName(), cell);
    });
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
      (cell) => !this.getActiveCells().includes(cell),
    );
  }

  public getPanelGroupAllDataCells(): DataCell[] {
    const children = this.spreadsheet.panelGroup.getChildren();
    return children.filter((cell) => cell instanceof DataCell) as DataCell[];
  }

  public getAllRowHeaderCells() {
    const children = this.spreadsheet.foregroundGroup.getChildren();
    const rowHeader = children.filter((group) => group instanceof RowHeader)[0];
    const rowCells = rowHeader?.cfg?.children || [];
    return rowCells.filter(
      (cell: S2CellType) => cell instanceof RowCell,
    ) as RowCell[];
  }

  public getAllColHeaderCells() {
    const children = this.spreadsheet.foregroundGroup.getChildren();
    const colHeader = children.filter((group) => group instanceof ColHeader)[0];
    const colCells = colHeader?.cfg?.children || [];
    return colCells.filter(
      (cell: S2CellType) => cell instanceof ColCell,
    ) as ColCell[];
  }

  public getAllCells() {
    return concat<S2CellType>(
      this.getPanelGroupAllDataCells(),
      this.getAllRowHeaderCells(),
      this.getAllColHeaderCells(),
    );
  }

  /**
   * 注册交互（组件按自己的场景写交互，继承此方法注册）
   * @param options
   */
  private registerInteractions() {
    this.interactions.clear();
    if (
      get(this.spreadsheet.options, 'registerDefaultInteractions', true) &&
      !isMobile()
    ) {
      this.interactions.set(
        InteractionNames.BRUSH_SELECTION_INTERACTION,
        new BrushSelection(this.spreadsheet, this),
      );
      this.interactions.set(
        InteractionNames.COL_ROW_RESIZE_INTERACTION,
        new RowColResize(this.spreadsheet, this),
      );
      this.interactions.set(
        InteractionNames.COL_ROW_MULTI_SELECTION_INTERACTION,
        new DataCellMultiSelection(this.spreadsheet, this),
      );
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
    const { cells } = interactionStateInfo;
    if (!isEmpty(cells)) {
      this.clearState();
      this.setState(interactionStateInfo);
      this.updatePanelAllCellsStyle();
      this.draw();
    }
  }

  updatePanelAllCellsStyle() {
    const cells = this.getPanelGroupAllDataCells();
    cells.forEach((cell: DataCell) => {
      cell.update();
    });
  }

  protected registerEvents() {
    this.events.clear();
    this.events.set(
      InteractionEvent.DATA_CELL_CLICK_EVENT,
      new DataCellClick(this.spreadsheet, this),
    );
    this.events.set(
      InteractionEvent.CORNER_TEXT_CLICK_EVENT,
      new CornerTextClick(this.spreadsheet, this),
    );
    this.events.set(
      InteractionEvent.ROW_COLUMN_CLICK_EVENT,
      new RowColumnClick(this.spreadsheet, this),
    );
    this.events.set(
      InteractionEvent.ROW_TEXT_CLICK_EVENT,
      new RowTextClick(this.spreadsheet, this),
    );
    this.events.set(
      InteractionEvent.MERGED_CELLS_CLICK_EVENT,
      new MergedCellsClick(this.spreadsheet, this),
    );
    this.events.set(
      InteractionEvent.HOVER_EVENT,
      new HoverEvent(this.spreadsheet, this),
    );
  }
}
