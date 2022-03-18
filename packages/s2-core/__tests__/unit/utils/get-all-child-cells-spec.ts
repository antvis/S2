/* eslint-disable max-classes-per-file */
import { getAllChildCells } from 'src/utils/get-all-child-cells';
import { Group, IElement } from '@antv/g-canvas';

class MockDataCell extends Group {}
class MockTableRowCell extends Group {}

describe('getAllChildCells test', () => {
  const scrollGroup = new Group({
    name: 'panelScrollGroup',
  });

  Array.from(new Array(10)).forEach(() => {
    scrollGroup.add(new MockDataCell({}));
  });

  const group = new Group({
    name: 'panelGroup',
  });

  group.add(scrollGroup);
  Array.from(new Array(5)).forEach(() => {
    group.add(new MockDataCell({}));
  });
  Array.from(new Array(5)).forEach(() => {
    group.add(new MockTableRowCell({}));
  });

  test('should return getAllChildCells of DataCell', () => {
    expect(
      getAllChildCells(group.getChildren() as IElement[], MockDataCell).length,
    ).toBe(15);
  });

  test('should return getAllChildCells of TableRowCell', () => {
    expect(
      getAllChildCells(group.getChildren() as IElement[], MockTableRowCell)
        .length,
    ).toBe(5);
  });
});
