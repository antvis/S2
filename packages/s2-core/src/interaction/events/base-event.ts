import { SpreadSheet } from "src/sheet-type";

export type EventConstructor = new (spreadsheet: SpreadSheet) => BaseEvent;

export class BaseEvent {
  protected spreadsheet: SpreadSheet;

  private eventListeners: any[] = [];

  constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
    this.bindEvents();
  }

  protected bindEvents() {}

  protected addEventListener(target, type, handler) {
    if (target.addEventListener) {
      target.addEventListener(type, handler);
      this.eventListeners.push({ target, type, handler });
    } else {
      console.error(`Please make sure ${target} has addEventListener function`);
    }
  }

  protected draw() {
    this.spreadsheet.container.draw();
  }
}
