/**
 * 文本位置算法，让文字始终处于视区中央。
 * @param rectLeft       矩形左边
 * @param rectWidth      矩形宽度
 * @param viewportLeft   视窗左边
 * @param viewportWidth  视窗宽度
 * @param textWidth
 * @returns 文本定位坐标 x 或者 y
 *
 * 画布元素：视窗矩形、矩形、文本，其中文本放置在矩形中
 * 矩形和视窗交集时，交互流程为（无交集代表视窗外，不需要处理，默认居中）：
 *  1. 矩形和视窗有交集
 *    1.1 交集宽度等于矩形 (矩形在视区内)：矩形居中
 *    1.2 交集宽度大于文字宽度：可视区域居中
 *    1.3 交集宽度小于文字宽度：贴左或者贴右
 *  2. 矩形和视窗无交集
 * **************************************************************
 *                    viewportLeft               rectLeft
 *                    ▲                          ▲   centerTextLeft
 *                    |                          |   ▲
 *                    +------------------+       |   |
 *                    |                  |       +------------+
 *                    |                  |       |   +----+   |
 *                    |                  |       |   |Text|   |
 *                    |                  |       |   +----+   |
 *                    |                  |       +------------+
 *                    +------------------+       ◀- rectWidth -▶
 *                    ◀- viewportWidth  -▶
 * ****************************************************************
 */
import { vennArr } from './veen-arr';

export const getAdjustPosition = (
  rectLeft: number,
  rectWidth: number,
  viewportLeft: number,
  viewportWidth: number,
  textWidth: number,
): number => {
  let textX = 0;
  const rectRight = rectLeft + rectWidth;
  const viewportRight = viewportLeft + viewportWidth;
  const viewCenter = viewportLeft + viewportWidth / 2;
  const rectCenter = rectLeft + rectWidth / 2;
  const preferLeft = rectCenter <= viewCenter; // 是偏左还是偏右
  const intersectionArr = vennArr(
    [rectLeft, rectRight],
    [viewportLeft, viewportRight],
  );
  if (intersectionArr.length) {
    // 1. 有交集
    const intersectionWith = intersectionArr[1] - intersectionArr[0];
    if (intersectionWith > textWidth) {
      if (intersectionWith === rectWidth) {
        // 1.1 有交集，且交集宽度等于矩形宽度
        textX = rectLeft + (rectWidth - textWidth) / 2;
      } else {
        // 1.2 有交集，且交集宽度大于文字宽度: 可视区域居中.
        // eslint-disable-next-line no-lonely-if
        if (preferLeft) {
          // 1.2.1 有交集，且宽度大于文字宽度，且偏左
          if (rectRight > viewportRight) {
            // 1.2.1.1 特殊场景，矩形可视区域宽度已经大于视窗宽度
            textX =
              viewportLeft + (viewportRight - viewportLeft - textWidth) / 2;
          } else {
            textX = viewportLeft + (rectRight - viewportLeft - textWidth) / 2;
          }
        } else {
          // 1.2.2 有交集，且宽度大于文字宽度，且偏右
          // eslint-disable-next-line no-lonely-if
          if (rectLeft < viewportLeft) {
            // 1.2.2.1 特殊场景，矩形可视区域宽度已经大于视窗宽度
            textX =
              viewportLeft + (viewportRight - viewportLeft - textWidth) / 2;
          } else {
            textX = rectLeft + (viewportRight - rectLeft - textWidth) / 2;
          }
        }
      }
    } else {
      // 1.3 有交集，且交集宽度小于文字宽度
      // eslint-disable-next-line no-lonely-if
      if (preferLeft) {
        // 1.3.1 有交集，且交集宽度小于文字宽度，且偏左
        textX = rectRight - textWidth;
      } else {
        // 1.3.2 有交集，且交集宽度小于文字宽度，且偏右
        textX = rectLeft;
      }
    }
  } else {
    // 2. 没有交集，居中
    textX = rectLeft + (rectWidth - textWidth) / 2;
  }
  return textX;
};
