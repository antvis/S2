import { Node } from '@/facet/layout/node';
import { SERIES_NUMBER_FIELD } from '../../../../src';

describe('Node Test', () => {
  const root = new Node({
    id: 'root',
    value: 'root',
    children: [],
  });
  const child = new Node({
    id: 'child',
    value: 'child',
    isLeaf: true,
    children: [],
  });
  const node = new Node({
    id: 'root[&]country',
    value: '',
    field: 'country',
    parent: root,
  });

  node.children = [child];

  test('should get correct field path', () => {
    expect(Node.getFieldPath(node)).toEqual(['country']);
  });

  test('#getAllLeaveNodes()', () => {
    expect(Node.getAllLeaveNodes(node)).toHaveLength(1);
  });

  test('#getAllChildrenNodes()', () => {
    expect(Node.getAllChildrenNodes(node)).toHaveLength(1);
  });

  test('#getAllBranch()', () => {
    expect(Node.getBranchNodes(node)).toHaveLength(1);
  });

  test('#rootNode()', () => {
    expect(Node.rootNode().id).toEqual('root');
  });

  test('#getHeadLeafChild()', () => {
    expect(node.getHeadLeafChild()?.id).toEqual('child');
  });

  test('#getTotalHeightForTreeHierarchy()', () => {
    expect(node.getTotalHeightForTreeHierarchy()).toEqual(0);
  });

  test('#isSeriesNumberNode()', () => {
    expect(node.isSeriesNumberNode()).toBeFalsy();

    node.field = SERIES_NUMBER_FIELD;
    expect(node.isSeriesNumberNode()).toBeTruthy();
  });
});
