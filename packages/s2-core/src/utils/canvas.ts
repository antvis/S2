const OFFSCREEN_CANVAS_DOM_ID = 's2-offscreen-canvas';

/**
 * 获取工具 canvas
 * 需要把 canvas 插入到 body 下，继承全局的 css 样式（如 letter-spacing）
 * 否则后续的 measureText 与实际渲染会有较大差异
 */
export const getOffscreenCanvas = () => {
  let canvas = document.getElementById(
    OFFSCREEN_CANVAS_DOM_ID,
  ) as HTMLCanvasElement;

  if (canvas) {
    return canvas;
  }

  canvas = document.createElement('canvas');
  canvas.id = OFFSCREEN_CANVAS_DOM_ID;
  canvas.style.display = 'none';

  document.body.appendChild(canvas);

  return canvas;
};

/**
 * 移除工具 canvas
 */
export const removeOffscreenCanvas = () => {
  document.getElementById(OFFSCREEN_CANVAS_DOM_ID)?.remove();
};
