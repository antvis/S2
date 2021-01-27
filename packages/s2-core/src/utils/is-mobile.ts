/*
 * 判断是否是移动端。
 * 兼容场景：pc端但是使用mobile配置。
 */
export function isMobile(device?) {
  if (device === 'mobile') {
    return true;
  }
  return /(iPhone|iPad|SymbianOS|Windows Phone|iPod|iOS|Android)/i.test(
    navigator.userAgent,
  );
}

export function isIphoneX() {
  // eslint-disable-next-line no-restricted-globals
  return (
    /iphone/gi.test(navigator.userAgent) &&
    screen.height === 812 &&
    screen.width === 375
  );
}

export function isWindows() {
  return /windows/i.test(navigator.userAgent);
}
