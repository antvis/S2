import { floor, round } from '../../../src/utils/math';

describe('math test', () => {
  test('#floor()', () => {
    expect(floor(1.234)).toBe(1.23);
    expect(floor(1.230123)).toBe(1.23);
    expect(floor(1.234, 3)).toBe(1.234);
  });

  test('#round()', () => {
    expect(round(1.234)).toBe(1);
    expect(round(1.9)).toBe(1);
    expect(round(12)).toBe(12);
    expect(round(null as unknown as number)).toBe(null);
    expect(round(undefined as unknown as number)).toBe(undefined);
  });
});
