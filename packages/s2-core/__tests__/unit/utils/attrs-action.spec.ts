import { detectAttrsChangeAndAction } from '@/utils/attrs-action';
describe('attrs-action test', () => {
  test('should execute callback when attribute changed', () => {
    const fn = jest.fn();
    detectAttrsChangeAndAction({ a: 'str1' }, { a: 'str2' }, 'a', fn);
    expect(fn).toBeCalledWith('a');
  });

  test('should execute callback when list of attributes changed', () => {
    const fn = jest.fn();
    detectAttrsChangeAndAction(
      { a: 'str1', b: 1, c: 3 },
      { a: 'str1', b: 2, c: 3 },
      ['a', 'b', 'c'],
      fn,
    );

    expect(fn).toBeCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('b');
  });

  test('should not execute callback when none of attribute changed', () => {
    const fn = jest.fn();
    detectAttrsChangeAndAction({ a: 'str1' }, { a: 'str1' }, ['a'], fn);
    expect(fn).not.toHaveBeenCalled();
  });
});
