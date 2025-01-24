import {
  convertString,
  keyEqualTo,
  trimTabSeparator,
} from '../../../../src/utils/export/method';

describe('method test', () => {
  test('#keyEqualTo', () => {
    expect(keyEqualTo('a', 'a')).toBeTruthy();
    expect(keyEqualTo('a', 'b')).toBeFalsy();
    expect(keyEqualTo('a', '')).toBeFalsy();
    expect(keyEqualTo('A', 'a')).toBeTruthy();
  });

  test('#convertString', () => {
    expect(convertString('a')).toBe('a');
    expect(convertString('a\nb')).toBe('"a\nb"');
    expect(convertString('a\nb"c')).toBe('"a\nb\'c"');
    expect(convertString(null)).toBe(null);
  });

  test('#trimTabSeparator', () => {
    expect(trimTabSeparator('a\tb')).toBe('ab');
    expect(trimTabSeparator('a\tb\t')).toBe('ab');
    expect(trimTabSeparator('')).toBe('');
    expect(trimTabSeparator('a')).toBe('a');
    expect(trimTabSeparator('\ta')).toBe('a');
    expect(trimTabSeparator(null as unknown as string)).toBe(null);
    expect(trimTabSeparator(1 as unknown as string)).toBe(1);
  });
});
