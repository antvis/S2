import type { DisplayObject, FederatedPointerEvent as Event } from '@antv/g';
import type { S2CellType, TargetCellInfo } from '../../common/interface';
import type { SpreadSheet } from '../../sheet-type';
import { getAppendInfo } from './common';

/* formate the base Event data */
export const getBaseCellData = (
  event: Event,
  s2?: SpreadSheet,
): TargetCellInfo => {
  const targetElement = event?.target as unknown as DisplayObject;
  const currentCellMeta = getAppendInfo(targetElement)?.meta;
  // https://github.com/antvis/S2/issues/2985
  const target =
    s2?.getCell?.(targetElement)! || (targetElement?.parentNode as S2CellType);
  const viewMeta = target?.getMeta?.() || currentCellMeta;

  return {
    target,
    viewMeta,
    event,
  };
};
