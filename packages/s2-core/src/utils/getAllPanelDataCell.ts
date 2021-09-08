import { DataCell } from 'src/cell/data-cell';
import { IElement } from '@antv/g-base';
import { Group } from '@antv/g-canvas';

export const getAllPanelDataCell = (children: IElement[]): DataCell[] => {
  const cells: DataCell[] = [];
  children.forEach((child) => {
    if (child instanceof DataCell) {
      cells.push(child);
    }
    // panel group has child group
    if (child instanceof Group) {
      const groupChildren = child.getChildren() as DataCell[];
      groupChildren.forEach((item) => {
        if (item instanceof DataCell) {
          cells.push(item);
        }
      });
    }
  });
  return cells;
};
