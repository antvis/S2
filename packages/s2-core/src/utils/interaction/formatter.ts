/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Node } from '@/facet/layout/node';
import { CanvasEvent, S2CellType, TargetCellInfo } from '@/common/interface';

/* formate the base CanvasEvent data */
export const getBaseCellData = (ev: CanvasEvent): TargetCellInfo => {
  // @ts-ignore
  const currentCellData: Node =
    ev.target?.getAttribute?.('appendInfo')?.cellData;
  // @ts-ignore
  const target = ev.target?.parent as S2CellType;
  const meta = (target?.getMeta?.() as Node) || currentCellData;

  return {
    target,
    viewMeta: meta,
    event: ev,
  };
};
