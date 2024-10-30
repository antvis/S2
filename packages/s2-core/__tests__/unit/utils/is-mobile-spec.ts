import { isIPhoneX, isMobile, isWindows } from '../../../src/utils/is-mobile';

describe('is-mobile test', () => {
  test('should get mobile status', () => {
    expect(isMobile()).toEqual(false);
    expect(isMobile('mobile')).toEqual(true);

    Object.defineProperty(navigator, 'userAgent', {
      value: 'iPhone',
      configurable: true,
    });

    expect(isMobile()).toEqual(true);
  });

  test('should get iPhoneX status', () => {
    expect(isIPhoneX()).toEqual(false);

    Object.defineProperty(navigator, 'userAgent', {
      value: 'iPhone',
      configurable: true,
    });
    Object.defineProperty(window.screen, 'width', {
      value: 375,
      configurable: true,
    });
    Object.defineProperty(window.screen, 'height', {
      value: 812,
      configurable: true,
    });

    expect(isIPhoneX()).toEqual(true);
  });

  test('should get windows status', () => {
    expect(isWindows()).toEqual(false);

    Object.defineProperty(navigator, 'userAgent', {
      value: 'windows',
      configurable: true,
    });

    expect(isWindows()).toEqual(true);
  });
});
