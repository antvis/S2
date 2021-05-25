import { Event } from '@antv/g-canvas';
/* formate the base Event data */
export const getBaseCellData = (ev: Event) => {
  const currentCellData = ev.target?.attrs?.appendInfo?.cellData;
  const target = ev.target.get('parent');
  const meta = target?.getMeta?.() || currentCellData;

  const baseCellData = {
    viewMeta: meta,
    event: ev,
  };
  return baseCellData;
};
