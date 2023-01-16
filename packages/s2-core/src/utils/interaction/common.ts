import type { DisplayObject } from '@antv/g';
import type { CellAppendInfo } from '../../common';

export const getAppendInfo = <T extends Record<string, any> = CellAppendInfo>(
  eventTarget: DisplayObject,
) => {
  if (!eventTarget || !('appendInfo' in eventTarget)) {
    return {} as T;
  }

  return eventTarget.appendInfo as T;
};
