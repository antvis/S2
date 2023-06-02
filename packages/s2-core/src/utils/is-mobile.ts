/*
 * 判断是否是移动端。
 * 兼容场景：pc端但是使用mobile配置。
 */
import { DeviceType } from '../common';

export function isMobile(device?: string) {
  if (device === DeviceType.MOBILE) {
    return true;
  }

  return /(?:iPhone|iPad|SymbianOS|Windows Phone|iPod|iOS|Android)/i.test(
    navigator.userAgent,
  );
}

export function isIPhoneX() {
  // eslint-disable-next-line no-restricted-globals
  return (
    /iPhone/gi.test(navigator.userAgent) &&
    window.screen.height === 812 &&
    window.screen.width === 375
  );
}

export function isWindows() {
  return /windows/i.test(navigator.userAgent);
}
