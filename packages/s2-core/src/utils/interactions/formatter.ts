import { Event } from '@antv/g-canvas';
import { Node } from 'src/facet/layout/node';
import { TargetCellData } from 'src/common/interface';

/* formate the base Event data */
export const getBaseCellData = (ev: Event): TargetCellData => {
  const currentCellData: Node = ev.target?.attrs?.appendInfo?.cellData;
  const target = ev.target.get('parent');
  const meta: Node = target?.getMeta?.() || currentCellData;

  return {
    target,
    viewMeta: meta,
    event: ev,
  };
};
