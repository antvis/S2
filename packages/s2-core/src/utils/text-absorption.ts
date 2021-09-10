/**
 * 文本吸附定位计算
 * @param rectLeft       矩形左边
 * @param rectWidth      矩形宽度
 * @param viewportLeft   视窗左边
 * @param viewportWidth  视窗宽度
 * @param textWidth
 * @returns 文本定位坐标 x 或者 y
 *
 * 画布元素：视窗矩形、矩形、文本，其中文本放置在矩形中
 * 矩形从右进入视窗时，交互流程为：
 *  1. 文本开始显示，文本贴左边
 *  2. 文本还未达到矩形中心位置，继续贴左边
 *  3. 文本显示全时，文本贴右边
 *  4. 文本居于矩形中心时，文本贴中间
 *  5. 文本贴近视窗左边还能显示全，文本贴左边
 *  6. 文本开始显示不全时，文本贴右边
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
export const getAdjustPosition = (
  rectLeft: number,
  rectWidth: number,
  viewportLeft: number,
  viewportWidth: number,
  textWidth: number,
): number => {
  let textX = 0;

  // 文本居于矩形中间时的坐标
  const centerTextLeft = rectLeft + (rectWidth - textWidth) / 2;
  const centerTextRight = rectLeft + (rectWidth + textWidth) / 2;
  const viewportRight = viewportLeft + viewportWidth;

  if (rectLeft + textWidth >= viewportRight) {
    // 1. 文本开始显示，文本贴左边
    textX = rectLeft;
  } else if (viewportRight < centerTextRight) {
    // 2. 文本还未达到矩形中心位置，继续贴左边
    textX = viewportLeft + viewportWidth - textWidth;
  } else if (viewportLeft > centerTextLeft) {
    // 3. 文本显示全时，文本贴右边
    if (rectLeft + rectWidth - viewportLeft > textWidth) {
      // 5. 文本贴近视窗左边还能显示全，文本贴左边
      textX = viewportLeft;
    } else {
      // 6. 文本开始显示不全时，文本贴右边
      textX = rectLeft + rectWidth - textWidth;
    }
  } else {
    // 4. 文本居于矩形中心时，文本贴中间
    textX = rectLeft + (rectWidth - textWidth) / 2;
  }

  return textX;
};
