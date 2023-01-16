import { Group, type IElement } from '@antv/g';
import { isEmpty } from 'lodash';

export const getAllChildCells = <T extends IElement>(
  children: T[] = [],
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
      const groupChildren = child.children as T[];

      groupChildren.forEach((item) => {
        if (item instanceof cellType) {
          cells.push(item);
        }
      });
    }
  });

  return cells;
};
