import type { DisplayObject, FederatedPointerEvent as Event } from '@antv/g';
import type { S2CellType, TargetCellInfo } from '../../common/interface';
import type { Node } from '../../facet/layout/node';
import { getAppendInfo } from './common';

/* formate the base Event data */
export const getBaseCellData = (event: Event): TargetCellInfo => {
  const targetElement = event as unknown as DisplayObject;
  const currentCellData = getAppendInfo(targetElement)?.cellData;
  const target = targetElement.parentNode as S2CellType;
  const meta = (target?.getMeta?.() as Node) || currentCellData;

  return {
    target,
    viewMeta: meta,
    event,
  };
};
