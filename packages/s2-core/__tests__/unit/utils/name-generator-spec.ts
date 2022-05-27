import { generateNodeName } from '@/utils/name-generator';
describe('name-generator test', () => {
  test('should generate name with separator', () => {
    expect(generateNodeName('name')).toEqual('root[&]name');
  });
});
