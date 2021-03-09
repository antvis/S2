import BaseSpreadSheet from '../../sheet-type/base-spread-sheet';

export type EventConstructor = new (
  spreadsheet: BaseSpreadSheet,
) => BaseEvent;

export class BaseEvent {
  protected spreadsheet: BaseSpreadSheet;

  constructor(spreadsheet: BaseSpreadSheet) {
    this.spreadsheet = spreadsheet;
    this.bindEvents();
  }

  protected bindEvents() {}

  protected draw() {
    this.spreadsheet.container.draw();
  }
}