import { auto, parseNumberWithPrecision } from '../../../src/utils/formatter';

describe('Formatter Utils Tests', () => {
  test('should auto format number', () => {
    expect(auto('' as unknown as number)).toStrictEqual('');
    expect(auto(null as unknown as number)).toStrictEqual('');
    expect(auto(undefined as unknown as number)).toStrictEqual('');
    expect(auto(Number.NaN)).toStrictEqual('');
    expect(auto(0)).toStrictEqual('0 万');
    expect(auto(3459)).toStrictEqual('3,459 万');
    expect(auto(3459.1234)).toStrictEqual('3,459.12 万');
    expect(auto(3459.1234, 3)).toStrictEqual('3,459.123 万');
    expect(auto(34590000)).toStrictEqual('3,459 亿');
    expect(auto(34590000.1234)).toStrictEqual('3,459 亿');
    expect(auto(34590000.1234, 3)).toStrictEqual('3,459 亿');
  });

  test('should parse number with precision', () => {
    expect(parseNumberWithPrecision(0)).toStrictEqual(0);
    expect(parseNumberWithPrecision(0.12345)).toStrictEqual(0.12345);
    expect(parseNumberWithPrecision(0.1 + 0.2)).toStrictEqual(0.3);
    expect(parseNumberWithPrecision(Number.NaN)).toStrictEqual(0);
  });
});
