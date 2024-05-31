import {
  layoutArrange,
  layoutCoordinate,
  layoutHierarchy,
} from '@/facet/layout/layout-hooks';
import { Hierarchy, Node } from '@/index';
import { createFakeSpreadSheet } from 'tests/util/helpers';

describe('layout-hooks test', () => {
  const s2 = createFakeSpreadSheet({
    width: 600,
    height: 480,
  });

  const node = new Node({
    id: '',
    key: '',
    value: '',
  });

  const hierarchy = new Hierarchy();

  test('#layoutArrange()', () => {
    const layoutArrangeFn = jest.fn(() => ['b']);

    expect(layoutArrange(s2, ['a'], node, '')).toEqual(['a']);

    expect(
      layoutArrange(
        { options: { layoutArrange: layoutArrangeFn } },
        ['a'],
        node,
        '',
      ),
    ).toEqual(['b']);
    expect(layoutArrangeFn).toHaveBeenCalledTimes(1);
  });

  test('#layoutHierarchy()', () => {
    const colNode = new Node({
      id: 'test',
      key: 'test',
      value: 'test',
    });

    const layoutHierarchyFn = jest.fn(() => {
      return {
        push: [node],
        unshift: [colNode],
      };
    });

    expect(
      layoutHierarchy(
        {
          options: {
            layoutHierarchy: layoutHierarchyFn,
          },
          facet: {
            getHiddenColumnsInfo: () => colNode,
          },
          columns: [colNode.id],
        },
        node,
        colNode,
        hierarchy,
      ),
    ).toEqual(true);

    expect(
      layoutHierarchy(
        {
          options: {
            layoutHierarchy: layoutHierarchyFn,
          },
          facet: {
            getHiddenColumnsInfo: () => {},
          },
          columns: [],
        },
        node,
        colNode,
        hierarchy,
      ),
    ).toEqual(true);
  });

  test('#layoutCoordinate()', () => {
    const layoutCoordinateFn = jest.fn();
    const rowNode = new Node({
      id: 'rowNode',
      key: 'rowNode',
      value: 'rowNode',
    });
    const colNode = new Node({
      id: 'colNode',
      key: 'colNode',
      value: 'colNode',
    });

    layoutCoordinate(
      { options: { layoutCoordinate: layoutCoordinateFn } },
      rowNode,
      colNode,
    );

    expect(layoutCoordinateFn).toHaveBeenCalledTimes(0);

    layoutCoordinate(
      { options: { layoutCoordinate: layoutCoordinateFn } },
      { ...rowNode, isLeaf: true },
      { ...colNode, isLeaf: true },
    );

    expect(layoutCoordinateFn).toHaveBeenCalledTimes(1);
  });
});
