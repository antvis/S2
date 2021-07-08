import { Event } from '@antv/g-canvas';
import { Node } from 'src/facet/layout/node';
import { TargetCellInfo } from 'src/common/interface';

/* formate the base Event data */
export const getBaseCellData = (ev: Event): TargetCellInfo => {
  const currentCellData: Node = ev.target?.attrs?.appendInfo?.cellData;
  const target = ev.target.get('parent');
  const meta: Node = target?.getMeta?.() || currentCellData;

  return {
    target,
    viewMeta: meta,
    event: ev,
  };
};
