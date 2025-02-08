import { escapeField, keyEqualTo } from '../../../../src/utils/export/method';

describe('method test', () => {
  test('#keyEqualTo', () => {
    expect(keyEqualTo('a', 'a')).toBeTruthy();
    expect(keyEqualTo('a', 'b')).toBeFalsy();
    expect(keyEqualTo('a', '')).toBeFalsy();
    expect(keyEqualTo('A', 'a')).toBeTruthy();
  });
});

describe('escapeField', () => {
  it.each([42, null, undefined, 'hello', '123', 'test'])(
    'should return the same value for non-string and normal types %s',
    (input) => {
      expect(escapeField(input)).toBe(input);
    },
  );

  it('should escape double quotes by replacing with two double quotes', () => {
    const input = 'hello "world"';
    const expected = '"hello ""world"""';

    expect(escapeField(input)).toBe(expected);
  });

  it('should wrap strings containing commas in double quotes', () => {
    const input = 'hello,world';
    const expected = '"hello,world"';

    expect(escapeField(input)).toBe(expected);
  });

  it('should replace \n to \r in double quotes', () => {
    const input = 'hello\nworld';
    const inputRN = 'hello\r\nworld';
    const expected = '"hello\r\nworld"';
    const expectedRN = '"hello\r\nworld"';

    expect(escapeField(input)).toBe(expected);
    expect(escapeField(inputRN)).toBe(expectedRN);
  });

  it('should wrap strings containing tabs in double quotes', () => {
    const input = 'hello\tworld';
    const expected = '"hello\tworld"';

    expect(escapeField(input)).toBe(expected);
  });
});
