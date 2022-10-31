import { renderToMountedElement } from '@antv/g2';
import type { S2CellType } from '@/common/interface';

export const renderByG2 = (cell: S2CellType) => {
  const { fieldValue } = cell.getMeta();
  const { x, y, width, height } = cell.getContentArea();
  renderToMountedElement(
    {
      x,
      y,
      width,
      height,
      ...fieldValue,
    },
    { group: cell },
  );
};
