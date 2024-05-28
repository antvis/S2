import { createFakeSpreadSheet } from 'tests/util/helpers';
import {
  layoutArrange,
  layoutCoordinate,
  layoutDataPosition,
  layoutHierarchy,
} from '@/facet/layout/layout-hooks';
import { Hierarchy, Node, type LayoutResult } from '@/index';

describe('layout-hooks test', () => {
  const s2 = createFakeSpreadSheet({
    width: 600,
    height: 480,
  });

  const facetCfg = {
    spreadsheet: s2,
  };

  const node = new Node({
    id: '',
    key: '',
    value: '',
  });

  const hierarchy = new Hierarchy();

  test('#layoutArrange()', () => {
    const layoutArrangeFn = jest.fn(() => ['b']);

    expect(layoutArrange(['a'], facetCfg, node, '')).toEqual(['a']);

    expect(
      layoutArrange(
        ['a'],
        { ...facetCfg, layoutArrange: layoutArrangeFn },
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
          ...facetCfg,
          spreadsheet: {
            facet: {
              getHiddenColumnsInfo: () => colNode,
            },
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
          ...facetCfg,
          spreadsheet: {
            facet: {
              getHiddenColumnsInfo: () => {},
            },
          },
          layoutHierarchy: layoutHierarchyFn,
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
      { ...facetCfg, layoutCoordinate: layoutCoordinateFn },
      rowNode,
      colNode,
    );

    expect(layoutCoordinateFn).toHaveBeenCalledTimes(0);

    layoutCoordinate(
      { ...facetCfg, layoutCoordinate: layoutCoordinateFn },
      { ...rowNode, isLeaf: true },
      { ...colNode, isLeaf: true },
    );

    expect(layoutCoordinateFn).toHaveBeenCalledTimes(1);
  });

  test('#layoutDataPosition()', () => {
    const colNode = new Node({
      id: 'colNode',
      key: 'colNode',
      value: 'colNode',
    });
    const getCellMeta = () => ({
      colNodes: [colNode],
    });
    const layoutDataPositionFn = jest.fn(() => getCellMeta);

    expect(
      layoutDataPosition(
        { ...facetCfg, layoutDataPosition: layoutDataPositionFn },
        {} as LayoutResult,
      ),
    ).toEqual({
      getCellMeta,
    });

    expect(layoutDataPositionFn).toHaveBeenCalledTimes(1);
  });
});
