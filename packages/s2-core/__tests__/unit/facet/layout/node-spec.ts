/**
 * Node test.
 */

import { Node } from '@/facet/layout/node';

describe('Node Test', () => {
  const root = new Node({ id: `root`, key: '', value: '', children: [] });
  const node = new Node({
    id: `root[&]country`,
    key: '',
    value: '',
    field: 'country',
    parent: root,
  });
  test('should get correct field path', () => {
    expect(Node.getFieldPath(node)).toEqual(['country']);
  });
});
