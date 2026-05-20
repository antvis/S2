/*
 * 判断是否是移动端。
 * 兼容场景：pc端但是使用mobile配置。
 */
import { DeviceType } from '../common';
import { hasNavigator, isSSR } from './ssr';

export function isMobile(device?: string) {
  if (device === DeviceType.MOBILE) {
    return true;
  }

  // SSR environment: treat as desktop
  if (isSSR() || !hasNavigator()) {
    return false;
  }

  return /(?:iPhone|iPad|SymbianOS|Windows Phone|iPod|iOS|Android|Mobile|Phone|Tablet)/i.test(
    navigator.userAgent,
  );
}

export function isIPhoneX() {
  // SSR environment: not iPhone X
  if (isSSR()) {
    return false;
  }

  // eslint-disable-next-line no-restricted-globals
  return (
    /iPhone/gi.test(navigator.userAgent) &&
    window.screen.height === 812 &&
    window.screen.width === 375
  );
}

export function isWindows() {
  // SSR environment: not Windows
  if (isSSR()) {
    return false;
  }

  return /windows/i.test(navigator.userAgent);
}
