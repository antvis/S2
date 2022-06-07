import type { Event } from '@antv/g-canvas';
import type { S2CellType, TargetCellInfo } from '../../common/interface';
import type { Node } from '../../facet/layout/node';

/* formate the base Event data */
export const getBaseCellData = (ev: Event): TargetCellInfo => {
  const currentCellData: Node = ev.target?.attrs?.appendInfo?.cellData;
  const target = ev.target.get?.('parent') as S2CellType;
  const meta = (target?.getMeta?.() as Node) || currentCellData;

  return {
    target,
    viewMeta: meta,
    event: ev,
  };
};
