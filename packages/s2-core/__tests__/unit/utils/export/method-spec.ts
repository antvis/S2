import { SimpleData } from '../../../../src';
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
  it('should return the same value for non-string types', () => {
    const testData: SimpleData[] = [42, null, undefined];

    testData.forEach((input) => {
      expect(escapeField(input)).toBe(input);
    });
  });

  it('should return the same string if no special characters are present', () => {
    const testStrings = ['hello', '123', 'test'];

    testStrings.forEach((str) => {
      expect(escapeField(str)).toBe(str);
    });
  });

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
    const expected = '"hello\rworld"';
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
