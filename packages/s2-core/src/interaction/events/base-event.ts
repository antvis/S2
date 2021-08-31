import { SpreadSheet } from 'src/sheet-type';
import { RootInteraction } from '../root';

export type EventConstructor = new (spreadsheet: SpreadSheet) => BaseEvent;

export interface BaseEventImplement {
  bindEvents: () => void;
}

export class BaseEvent {
  protected spreadsheet: SpreadSheet;

  protected interaction: RootInteraction;

  constructor(spreadsheet: SpreadSheet, interaction: RootInteraction) {
    this.spreadsheet = spreadsheet;
    this.interaction = interaction;
    this.bindEvents();
  }

  public bindEvents() {}
}
