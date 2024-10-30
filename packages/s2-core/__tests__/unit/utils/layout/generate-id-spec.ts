import { generateId } from '../../../../src/utils/layout/generate-id';

describe('generate-id test', () => {
  test('should get correctly id', () => {
    expect(generateId('parent', 'value')).toEqual('parent[&]value');
  });
});
