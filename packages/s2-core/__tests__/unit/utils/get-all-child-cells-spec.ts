/* eslint-disable max-classes-per-file */
import { Group } from '@antv/g';
import { getAllChildCells } from '@/utils/get-all-child-cells';

class MockDataCell extends Group {}
class MockTableRowCell extends Group {}

describe('getAllChildCells test', () => {
  const scrollGroup = new Group({
    name: 'panelScrollGroup',
  });

  Array.from(new Array(10)).forEach(() => {
    scrollGroup.appendChild(new MockDataCell({}));
  });

  const group = new Group({
    name: 'panelGroup',
  });

  group.appendChild(scrollGroup);
  Array.from(new Array(5)).forEach(() => {
    group.appendChild(new MockDataCell({}));
  });
  Array.from(new Array(5)).forEach(() => {
    group.appendChild(new MockTableRowCell({}));
  });

  test('should return getAllChildCells of DataCell', () => {
    expect(
      getAllChildCells(group.children as Group[], MockDataCell).length,
    ).toBe(15);
  });

  test('should return getAllChildCells of TableRowCell', () => {
    expect(
      getAllChildCells(group.children as Group[], MockTableRowCell).length,
    ).toBe(5);
  });
});
