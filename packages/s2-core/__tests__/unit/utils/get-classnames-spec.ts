import { getClassNameWithPrefix } from '../../../src/utils/get-classnames';

describe('get-classnames test', () => {
  test('should get className with prefix', () => {
    expect(getClassNameWithPrefix()).toEqual('antv-s2-');
    expect(getClassNameWithPrefix('a')).toEqual('antv-s2-a');
    expect(getClassNameWithPrefix('a', 'b')).toEqual('antv-s2-a-b');
  });
});
