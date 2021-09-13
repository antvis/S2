import { customTreeItems } from '../../data/custom-tree-items';
import { transformCustomTreeItems } from '@/utils/layout/transform-custom-tree-items';

describe('Transform custom tree test', () => {
  test('transform result', () => {
    const result = transformCustomTreeItems(customTreeItems);
    expect(result).toBeArrayOfSize(2);
    expect(result[0].title).toEqual('自定义节点A');
    expect(result[0].children).toBeArrayOfSize(2);
    expect(result[1].children[1].collapsed).toBe(true);
  });
});
