import type { DisplayObject } from '@antv/g';
import { CustomRect } from '../../engine';
import type { CellAppendInfo } from '../../common';

export const getAppendInfo = <T extends Record<string, any> = CellAppendInfo>(
  eventTarget: DisplayObject,
) => {
  if (!eventTarget) {
    return {} as T;
  }

  if (eventTarget instanceof CustomRect) {
    return eventTarget.appendInfo as T;
  }

  // TODO: g5.0 没有 attrs 了，另外需要适配 textShape 下划线的那个，resize 应该都用 CustomRect 解决了
  return (eventTarget?.attr?.('appendInfo') || {}) as T;
};
