import type { SpreadSheet } from '../sheet-type';

export interface BaseEventImplement {
  bindEvents: () => void;
}

export abstract class BaseEvent {
  public spreadsheet: SpreadSheet;

  constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
    this.bindEvents();
  }

  reset() {}

  public abstract bindEvents(): void;
}
