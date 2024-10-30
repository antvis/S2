import { Node } from '@/facet/layout/node';

describe('Node Test', () => {
  const root = new Node({
    id: 'root',
    key: 'root',
    value: 'root',
    children: [],
  });
  const child = new Node({
    id: 'child',
    key: 'child',
    value: 'child',
    isLeaf: true,
    children: [],
  });
  const node = new Node({
    id: 'root[&]country',
    key: '',
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
    expect(Node.getAllBranch(node)).toHaveLength(1);
  });

  test('#rootNode()', () => {
    expect(Node.rootNode().id).toEqual('root');
  });

  test('#getHeadLeafChild()', () => {
    expect(node.getHeadLeafChild().id).toEqual('child');
  });

  test('#getTotalHeightForTreeHierarchy()', () => {
    expect(node.getTotalHeightForTreeHierarchy()).toEqual(0);
  });

  test('#toJSON()', () => {
    expect(node.toJSON()).toMatchInlineSnapshot(`
      Object {
        "belongsCell": undefined,
        "children": Array [
          Object {
            "belongsCell": undefined,
            "children": Array [],
            "colIndex": -1,
            "extra": undefined,
            "field": undefined,
            "height": 0,
            "id": "child",
            "inCollapseNode": undefined,
            "isCollapsed": undefined,
            "isGrandTotals": undefined,
            "isLeaf": true,
            "isPivotMode": undefined,
            "isSubTotals": undefined,
            "isTotalMeasure": undefined,
            "isTotalRoot": undefined,
            "isTotals": undefined,
            "key": "child",
            "label": "child",
            "level": undefined,
            "padding": 0,
            "query": undefined,
            "rowIndex": undefined,
            "seriesNumberWidth": undefined,
            "value": "child",
            "width": 0,
            "x": 0,
            "y": 0,
          },
        ],
        "colIndex": -1,
        "extra": undefined,
        "field": "country",
        "height": 0,
        "id": "root[&]country",
        "inCollapseNode": undefined,
        "isCollapsed": undefined,
        "isGrandTotals": undefined,
        "isLeaf": undefined,
        "isPivotMode": undefined,
        "isSubTotals": undefined,
        "isTotalMeasure": undefined,
        "isTotalRoot": undefined,
        "isTotals": undefined,
        "key": "",
        "label": "",
        "level": undefined,
        "padding": 0,
        "query": undefined,
        "rowIndex": undefined,
        "seriesNumberWidth": undefined,
        "value": "",
        "width": 0,
        "x": 0,
        "y": 0,
      }
    `);
  });
});
