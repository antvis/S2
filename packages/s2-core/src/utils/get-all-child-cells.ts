import { Group, type IElement } from '@antv/g-canvas';
import { isEmpty } from 'lodash';

export const getAllChildCells = <T extends IElement>(
  children: IElement[] = [],
  cellType: any,
): T[] => {
  if (isEmpty(children)) {
    return [];
  }

  const cells: T[] = [];
  children.forEach((child) => {
    if (child instanceof cellType) {
      cells.push(child as T);
    }
    // panel group has child group
    if (child instanceof Group) {
      const groupChildren = child.getChildren() as T[];
      groupChildren.forEach((item) => {
        if (item instanceof cellType) {
          cells.push(item);
        }
      });
    }
  });
  return cells;
};
