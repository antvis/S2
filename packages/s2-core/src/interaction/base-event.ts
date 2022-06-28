import type { Event as CanvasEvent } from '@antv/g-canvas';
import type { CellAppendInfo } from '../common';
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

  public getCellAppendInfo<T extends Record<string, any> = CellAppendInfo>(
    eventTarget: CanvasEvent['target'],
  ): T {
    return (
      eventTarget?.attr?.('appendInfo') || eventTarget?.attrs?.appendInfo || {}
    );
  }

  public isLinkFieldText = (eventTarget: CanvasEvent['target']) => {
    const cellAppendInfo = this.getCellAppendInfo(eventTarget);
    return cellAppendInfo?.isLinkFieldText;
  };

  public reset() {}

  public abstract bindEvents(): void;
}
