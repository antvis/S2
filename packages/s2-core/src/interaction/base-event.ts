import type {
  DisplayObject,
  FederatedPointerEvent as CanvasEvent,
} from '@antv/g';
import type { CellAppendInfo } from '../common';
import type { SpreadSheet } from '../sheet-type';
import { getAppendInfo } from '../utils/interaction/common';

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
    return getAppendInfo<T>(eventTarget as DisplayObject);
  }

  public isLinkFieldText = (eventTarget: CanvasEvent['target']) => {
    const cellAppendInfo = this.getCellAppendInfo(eventTarget as DisplayObject);

    return cellAppendInfo?.isLinkFieldText;
  };

  public reset() {}

  public abstract bindEvents(): void;
}
