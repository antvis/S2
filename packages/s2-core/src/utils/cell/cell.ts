import {
  IconCfg,
  Padding,
  TextAlignCfg,
  TextBaseline,
} from '@/common/interface';
import { SimpleBBox } from '@antv/g-canvas';
import { merge } from 'lodash';
import { AreaRange } from './../../common/interface/scroll';

/**
 * -----------------------------
 * |           padding         |
 * |  |---------------------|  |
 * |  |                     |  |
 * |  |                     |  |
 * |  |---------------------|  |
 * |           padding         |
 * -----------------------------
 */
export const getContentArea = (bbox: SimpleBBox, padding: Padding) => {
  const { x, y, width, height } = bbox;

  const contentWidth: number = width - padding?.left - padding?.right;
  const contentHeight: number = height - padding?.top - padding?.bottom;

  return {
    x: x + padding?.left,
    y: y + padding?.top,
    width: contentWidth,
    height: contentHeight,
  };
};

/**
 * text 和 icon 之间布局关系：
 *    y轴： text 和 icon 高度上居中对齐
 *    x轴：
 *       1. text 和 icon 同为 left 或者 right 时，icon bbox 只需要简单放置在 left 或者 right 即可
 *       2. 其他的情况，需要根据实际 text width 确定 icon bbox 开始位置
 */

const normalizeIconCfg = (iconCfg?: IconCfg): IconCfg => {
  return merge(
    {
      size: 0,
      position: 'right',
      margin: {
        left: 0,
        right: 0,
      },
    },
    iconCfg,
  );
};

export const getMaxTextWidth = (contentWidth: number, iconCfg?: IconCfg) => {
  iconCfg = normalizeIconCfg(iconCfg);
  return (
    contentWidth -
    iconCfg.size -
    (iconCfg.position === 'left' ? iconCfg.margin.right : iconCfg.margin.left)
  );
};

export const getVerticalPosition = (
  { y, height }: SimpleBBox,
  textBaseline: TextBaseline,
  size = 0,
) => {
  let p = 0;
  switch (textBaseline) {
    case 'top':
      p = y;
      break;
    case 'middle':
      p = y + height / 2 - size / 2;
      break;
    default:
      p = y + height - size;
      break;
  }
  return p;
};

export const getTextAndFollowingIconPosition = (
  contentBox: SimpleBBox,
  textCfg: TextAlignCfg,
  textWidth = 0,
  iconCfg?: IconCfg,
) => {
  const { x, width } = contentBox;
  const { textAlign, textBaseline } = textCfg;
  const { size, margin, position: iconPosition } = normalizeIconCfg(iconCfg);

  let textX: number;
  let iconX: number;

  switch (textAlign) {
    case 'left':
      textX = x + (iconPosition === 'left' ? size + margin.right : 0);
      iconX = x + (iconPosition === 'left' ? 0 : textWidth + margin.left);
      break;
    case 'center': {
      const totalWidth =
        size +
        (iconPosition === 'left' ? margin.right : margin.left) +
        textWidth;
      const startX = x + width / 2 - totalWidth / 2;
      textX =
        startX +
        textWidth / 2 +
        (iconPosition === 'left' ? size + margin.right : 0);
      iconX = startX + (iconPosition === 'left' ? 0 : textWidth + margin.left);
      break;
    }

    default:
      textX = x + width - (iconPosition === 'right' ? size + margin.left : 0);
      iconX =
        x +
        width -
        (iconPosition === 'right' ? size : textWidth + size + margin.right);

      break;
  }

  const textY = getVerticalPosition(contentBox, textBaseline, 0);
  const iconY = getVerticalPosition(contentBox, textBaseline, size);

  return {
    text: { x: textX, y: textY },
    icon: { x: iconX, y: iconY },
  };
};

export const getTextPosition = (
  contentBox: SimpleBBox,
  textCfg: TextAlignCfg,
) => getTextAndFollowingIconPosition(contentBox, textCfg).text;

export const getTextPositionWhenHorizontalScrolling = (
  viewport: AreaRange,
  content: AreaRange,
  textWidth: number,
) => {
  const contentEnd = content.start + content.width;
  const viewportEnd = viewport.start + viewport.width;

  let position: number;
  if (content.start <= viewport.start && contentEnd >= viewportEnd) {
    position = viewport.start + viewport.width / 2;
  } else if (content.start <= viewport.start) {
    const restWidth = content.width - (viewport.start - content.start);
    position =
      restWidth < textWidth
        ? contentEnd - textWidth / 2
        : contentEnd - restWidth / 2;
  } else if (contentEnd >= viewportEnd) {
    const restWidth = content.width - (contentEnd - viewportEnd);
    position =
      restWidth < textWidth
        ? content.start + textWidth / 2
        : content.start + restWidth / 2;
  } else {
    position = content.start + content.width / 2;
  }
  return position;
};
