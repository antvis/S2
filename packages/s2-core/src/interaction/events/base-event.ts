import { SpreadSheet } from 'src/sheet-type';
import { RootInteraction } from '../root';

export type EventConstructor = new (spreadsheet: SpreadSheet) => BaseEvent;

export class BaseEvent {
  protected spreadsheet: SpreadSheet;

  protected interaction: RootInteraction;

  private eventListeners: any[] = [];

  constructor(spreadsheet: SpreadSheet, interaction: RootInteraction) {
    this.spreadsheet = spreadsheet;
    this.interaction = interaction;
    this.bindEvents();
  }

  protected bindEvents() {}

  protected addEventListener(
    target: EventTarget,
    type: keyof HTMLElementEventMap,
    handler: EventListenerOrEventListenerObject,
  ) {
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
