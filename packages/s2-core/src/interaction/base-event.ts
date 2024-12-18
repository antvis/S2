import type {
  FederatedPointerEvent as CanvasEvent,
  DisplayObject,
} from '@antv/g';
import {
  type CellAppendInfo,
  type TooltipOperatorMenuItems,
  type TooltipOperatorOptions,
} from '../common';
import type { SpreadSheet } from '../sheet-type';
import { getAppendInfo } from '../utils/interaction/common';
import { getTooltipOptions, getTooltipVisibleOperator } from '../utils/tooltip';

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

  protected getTooltipOperator(
    event: CanvasEvent,
    defaultMenus: TooltipOperatorMenuItems = [],
  ): TooltipOperatorOptions {
    const cell = this.spreadsheet.getCell(event.target)!;
    const { operation } = getTooltipOptions(this.spreadsheet, event)!;

    return getTooltipVisibleOperator(operation!, {
      defaultMenus,
      cell,
    });
  }

  public reset() {}

  public abstract bindEvents(): void;
}
