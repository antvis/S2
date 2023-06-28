/**
 * 注入 css
 * 反复注入到同一个 block
 */
export const injectCssText = (
  elementId: string,
  cssText = '',
): HTMLStyleElement => {
  let element = document.getElementById(elementId) as HTMLStyleElement;

  if (!element) {
    element = document.createElement('style');
    element.id = elementId;
    document.head.appendChild(element);
  }

  element.innerHTML = cssText;

  return element;
};
