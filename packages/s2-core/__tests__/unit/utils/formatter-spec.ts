import { auto, parseNumberWithPrecision } from '../../../src/utils/formatter';

describe('Formatter Utils Tests', () => {
  test('should auto format number', () => {
    expect(auto('' as unknown as number)).toStrictEqual('');
    expect(auto(null as unknown as number)).toStrictEqual('');
    expect(auto(undefined as unknown as number)).toStrictEqual('');
    expect(auto(Number.NaN)).toStrictEqual('');
    expect(auto(0)).toStrictEqual('0');
    expect(auto(3459)).toStrictEqual('3,459');
    expect(auto(3459.1234)).toStrictEqual('3,459.12');
    expect(auto(3459.1234, 3)).toStrictEqual('3,459.123');
    expect(auto(32000)).toStrictEqual('3.2 万');
    expect(auto(34590000)).toStrictEqual('3,459 万');
    expect(auto(34590000.1234)).toStrictEqual('3,459 万');
    expect(auto(34590000.1234, 3)).toStrictEqual('3,459 万');
    expect(auto(340000000)).toStrictEqual('3.4 亿');
    expect(auto(1e9)).toStrictEqual('10 亿');
    expect(auto(1e13)).toStrictEqual('100,000 亿');
  });

  test('should carry to the next unit after rounding', () => {
    expect(auto(9999.999)).toStrictEqual('1 万');
    expect(auto(99999999.9)).toStrictEqual('1 亿');
    expect(
      auto(999999.999, 2, [
        ['K', 'M'],
        [1e3, 1e3],
      ]),
    ).toStrictEqual('1 M');
    expect(
      auto(999.999, 2, [
        ['K', 'M'],
        [1e3, 1e3],
      ]),
    ).toStrictEqual('1 K');
  });

  test('should parse number with precision', () => {
    expect(parseNumberWithPrecision(0)).toStrictEqual(0);
    expect(parseNumberWithPrecision(0.12345)).toStrictEqual(0.12345);
    expect(parseNumberWithPrecision(0.1 + 0.2)).toStrictEqual(0.3);
    expect(parseNumberWithPrecision(Number.NaN)).toStrictEqual(0);
  });
});
