import { SpreadSheet } from 'src/sheet-type';
import { RootInteraction } from './root';

export abstract class BaseInteraction {
  protected spreadsheet: SpreadSheet;

  protected interaction: RootInteraction;

  public constructor(spreadsheet: SpreadSheet, interaction: RootInteraction) {
    this.spreadsheet = spreadsheet;
    this.interaction = interaction;
    this.bindEvents();
  }

  protected bindEvents() {}

  /**
   * Re-Draw the canvas by hand
   */
  protected draw() {
    this.spreadsheet.container.draw();
  }
}
