import type { DisplayObject, FederatedPointerEvent as Event } from '@antv/g';
import type { S2CellType, TargetCellInfo } from '../../common/interface';
import { getAppendInfo } from './common';

/* formate the base Event data */
export const getBaseCellData = (event: Event): TargetCellInfo => {
  const targetElement = event?.target as unknown as DisplayObject;
  const currentCellMeta = getAppendInfo(targetElement)?.meta;
  const target = targetElement?.parentNode as S2CellType;
  const viewMeta = target?.getMeta?.() || currentCellMeta;

  return {
    target,
    viewMeta,
    event,
  };
};
