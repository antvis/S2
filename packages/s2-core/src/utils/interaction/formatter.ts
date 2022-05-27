import { Event } from '@antv/g-canvas';
import { Node } from '@/facet/layout/node';
import { S2CellType, TargetCellInfo } from '@/common/interface';

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
