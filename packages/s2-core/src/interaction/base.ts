import { Canvas } from '@antv/g-canvas';
import { each } from 'lodash';
import { SpreadSheet } from 'src/sheet-type';

/**
 * Base interaction for SpreadSheet/ListSheet
 * There are three events we need care, override them to DIY
 * 1. startEvent control by {@link getStarEvent}, handle callback in {@link start}
 * 2. processEvent control by {@link getProcessEvent}, handle callback in {@link process}
 * 3. endEvent control by {@link getEndEvent}, handle callback in {@link end}
 *
 * All above events trigger group determined by
 * {@link triggerGroup}
 *
 * Tow ways register event(both don't need unregister by hands)
 * 1. {@link addEvent} -- for custom emit events
 * 2. {@link addEventListener} -- for event listeners(DOM type)
 *
 * Redraw:
 * Use {@link draw} to redraw the canvas
 */
export abstract class BaseInteraction {
  protected spreadsheet: SpreadSheet;

  private eventHandlers: any[] = [];

  private eventListeners: any[] = [];

  public constructor(spreadsheet: SpreadSheet) {
    this.spreadsheet = spreadsheet;
    this.bindEvents();
  }

  public destroy() {
    this.unbindEvents();
  }

  protected bindEvents() {}

  protected unbindEvents() {
    this.clearEvents();
  }

  /**
   * Determine which group trigger the event
   *   public container: Canvas;  --- works all area in canvas
   *   backgroundGroup: Group;  --- forget it.
   *   panelGroup: Group;  --- only works in panel area
   *   foregroundGroup: Group;  --- works in row,col,corner header
   */
  protected triggerGroup(): Canvas {
    return this.spreadsheet.container;
  }

  /**
   * Re-Draw the canvas by hand
   */
  protected draw() {
    this.spreadsheet.container.draw();
  }

  /**
   * Add emit listeners for better release control
   * @param target
   * @param eventType
   * @param handler
   */
  protected addEvent(target, eventType, handler) {
    target.on(eventType, handler);
    this.eventHandlers.push({ target, type: eventType, handler });
  }

  /**
   * Add event listener to ignore ts lint check
   * @param target
   * @param type
   * @param handler
   */
  protected addEventListener(target, type, handler) {
    if (target.addEventListener) {
      target.addEventListener(type, handler);
      this.eventListeners.push({ target, type, handler });
    } else {
      console.error(`Please make sure ${target} has addEventListener function`);
    }
  }

  /**
   * Auto clear all emit and event listeners, don't need clear by hand
   * @private
   */
  private clearEvents() {
    // clear Emit listener
    const eventHandlers = this.eventHandlers;
    each(eventHandlers, (eh) => {
      eh.target.off(eh.type, eh.handler);
    });
    this.eventHandlers.length = 0;

    // clear Event listener
    const eventListeners = this.eventListeners;
    each(eventListeners, (eh) => {
      eh.target.removeEventListener(eh.type, eh.handler);
    });
    this.eventListeners.length = 0;
  }
}
