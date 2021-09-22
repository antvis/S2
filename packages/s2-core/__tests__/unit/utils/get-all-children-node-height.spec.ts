import { getAllChildrenNodeHeight } from '@/utils/get-all-children-node-height';
import { Node } from '@/facet/layout/node';

function generateChildren(height?: number) {
  const children: Node[] = [];
  for (let i = 0; i < 10; i++) {
    const child = new Node({ id: `child${i}`, key: '', value: '' });
    child.height = height;
    children.push(child);
  }

  return children;
}

describe('get-all-children-node-height test', () => {
  test('should return total node height', () => {
    const root = Node.rootNode();
    root.children = generateChildren(20);

    expect(getAllChildrenNodeHeight(root)).toEqual(200);
  });

  test('should return zero when children have no height', () => {
    const root = Node.rootNode();
    root.children = generateChildren();

    expect(getAllChildrenNodeHeight(root)).toEqual(0);
  });
});
