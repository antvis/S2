import { SimpleBBox } from '@antv/g-canvas';
import { merge } from 'lodash';
import { AreaRange } from './../../common/interface/scroll';
import {
  CellBorderPosition,
  CellTheme,
  IconCfg,
  Padding,
  TextAlignCfg,
  TextBaseline,
  TextAlign,
} from '@/common/interface';

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
    contentWidth - iconCfg.size - iconCfg.margin.right - iconCfg.margin.left
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

// 获取text及其跟随icon的位置坐标
export const getTextAndFollowingIconPosition = (
  contentBox: SimpleBBox,
  textCfg: TextAlignCfg,
  textWidth = 0,
  iconCfg?: IconCfg,
  iconCount = 1,
) => {
  const { x, width } = contentBox;
  const { textAlign, textBaseline } = textCfg;
  const { size, margin, position: iconPosition } = normalizeIconCfg(iconCfg);

  const iconSpace =
    iconCount * (size + margin.left) + (iconCount ? margin.right : 0);
  let textX: number;
  let iconX: number;

  switch (textAlign) {
    case 'left':
      /**
       * icon left -- text left
       * ------------------------------------------------------
       * | margin-left | icon | margin-right | text | padding |
       * ------------------------------------------------------
       *
       * text left - icon right
       * ------------------------------------------------------
       * | text | margin-left | icon | margin-right | padding |
       * ------------------------------------------------------
       */
      textX = x + (iconPosition === 'left' ? iconSpace : 0);
      iconX =
        x + (iconPosition === 'left' ? margin.left : textWidth + margin.left);
      break;
    case 'center': {
      /**
       * icon left -- text center
       * ----------------------------------------------------------------
       * | padding | margin-left | icon | margin-right | text | padding |
       * ----------------------------------------------------------------
       *
       * text center - icon right
       * ----------------------------------------------------------------
       * | padding | text | margin-left | icon | margin-right | padding |
       * ----------------------------------------------------------------
       */
      const totalWidth =
        iconSpace -
        (iconPosition === 'left' ? margin.left : margin.right) +
        textWidth;
      const startX = x + width / 2 - totalWidth / 2;
      textX =
        startX +
        textWidth / 2 +
        (iconPosition === 'left' ? iconSpace - margin.left : 0);
      iconX = startX + (iconPosition === 'left' ? 0 : textWidth + margin.left);
      break;
    }
    default: {
      /**
       * icon left -- text right
       * ------------------------------------------------------
       * | padding | margin-left | icon | margin-right | text |
       * ------------------------------------------------------
       *
       * text right - icon right
       * ------------------------------------------------------
       * | padding | text | margin-left | icon | margin-right |
       * ------------------------------------------------------
       */
      textX = x + width - (iconPosition === 'right' ? iconSpace : 0);
      iconX =
        x +
        width -
        (iconPosition === 'right'
          ? iconSpace - margin.left
          : textWidth + iconSpace - margin.left);
      break;
    }
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

/**
 * 在给定视窗和单元格的情况下，计算单元格文字实际绘制位置
 * 计算遵循原则：
 * 1. 若可视范围小，尽可能多展示文字
 * 2. 若可视范围大，居中展示文字
 * @param viewport 视窗坐标信息
 * @param content content 列头单元格 content 区域坐标信息
 * @param textWidth 文字实际绘制区域宽度（含icon）
 * @returns 文字绘制位置
 */
export const getTextAreaRange = (
  viewport: AreaRange,
  content: AreaRange,
  textWidth: number,
) => {
  const contentEnd = content.start + content.width;
  const viewportEnd = viewport.start + viewport.width;

  let position: number;
  let availableContentWidth: number;
  if (content.start <= viewport.start && contentEnd >= viewportEnd) {
    /**
     *     +----------------------+
     *     |      viewport        |
     *  +--|----------------------|--+
     *  |  |    cellContent       |  |
     *  +--|----------------------|--+
     *     +----------------------+
     */
    position = viewport.start + viewport.width / 2;
    availableContentWidth = viewport.width;
  } else if (content.start <= viewport.start) {
    /**
     *         +-------------------+
     *  +------|------+            |
     *  | cellContent |   viewport |
     *  +------|------+            |
     *         +-------------------+
     */
    const restWidth = content.width - (viewport.start - content.start);
    position =
      restWidth < textWidth
        ? contentEnd - textWidth / 2
        : contentEnd - restWidth / 2;
    availableContentWidth = restWidth;
  } else if (contentEnd >= viewportEnd) {
    /**
     *   +-------------------+
     *   |            +------|------+
     *   | viewport   | cellContent |
     *   |            +------|------+
     *   +-------------------+
     */
    const restWidth = content.width - (contentEnd - viewportEnd);
    position =
      restWidth < textWidth
        ? content.start + textWidth / 2
        : content.start + restWidth / 2;
    availableContentWidth = restWidth;
  } else {
    /**
     *   +----------------------------+
     *   |  +-------------+           |
     *   |  | cellContent |  viewport |
     *   |  +-------------+           |
     *   +----------------------------+
     */
    position = content.start + content.width / 2;
    availableContentWidth = content.width;
  }

  return { start: position, width: availableContentWidth } as AreaRange;
};

export const getBorderPositionAndStyle = (
  position: CellBorderPosition,
  contentBox: SimpleBBox,
  style: CellTheme,
) => {
  const { x, y, width, height } = contentBox;
  const {
    horizontalBorderWidth,
    horizontalBorderColorOpacity,
    horizontalBorderColor,
    verticalBorderWidth,
    verticalBorderColor,
    verticalBorderColorOpacity,
  } = style;
  let x1;
  let y1;
  let x2;
  let y2;
  let borderStyle;

  // horizontal
  if (
    position === CellBorderPosition.TOP ||
    position === CellBorderPosition.BOTTOM
  ) {
    let yPosition = y;
    if (position === CellBorderPosition.TOP) {
      // 完全绘制在 Cell 内，否则会导致 Border 粗细不一： https://github.com/antvis/S2/issues/426
      yPosition = y + verticalBorderWidth / 2;
    } else {
      yPosition = y + height - verticalBorderWidth / 2;
    }
    y1 = yPosition;
    y2 = yPosition;
    x1 = x;
    x2 = x + width;
    borderStyle = {
      lineWidth: horizontalBorderWidth,
      stroke: horizontalBorderColor,
      strokeOpacity: horizontalBorderColorOpacity,
    };
  }

  // vertical
  if (
    position === CellBorderPosition.LEFT ||
    position === CellBorderPosition.RIGHT
  ) {
    let xPosition = x;
    if (position === CellBorderPosition.LEFT) {
      xPosition = x + horizontalBorderWidth / 2;
    } else {
      xPosition = x + width - horizontalBorderWidth / 2;
    }
    x1 = xPosition;
    x2 = xPosition;
    y1 = y;
    y2 = y + height;
    borderStyle = {
      lineWidth: verticalBorderWidth,
      stroke: verticalBorderColor,
      strokeOpacity: verticalBorderColorOpacity,
    };
  }

  return {
    position: {
      x1,
      x2,
      y1,
      y2,
    },
    style: borderStyle,
  };
};

/**
 * 根据单元格文字样式调整 viewport range，使文字在滚动时不会贴边展示
 *
 * 以 textAlign=left 情况为例，由大到小的矩形分别是 viewport、cellContent、cellText
 * 左图是未调整前，滚动相交判定在 viewport 最左侧，即 colCell 滚动到 viewport 左侧后，文字会贴左边绘制
 * 右图是调整后，range.start 提前了 padding.left 个元素，文字与 viewport 有一定间隙更加美观
 *
 *    range.start                                   range.start
 *         |                                             |
 *         |      range.width                            |  range.width
 *         v<---------------------->                     v<------------------>
 *
 *         +-----------------------+                 +-----------------------+
 *         |       viewport        |                 |       viewport        |
 *     +-------------------+       |             +-------------------+       |
 *     |   +---------+     |       |             |   |   +---------+ |       |
 *     |   |  text   |     |       |             |   |   |  text   | |       |
 *     |   +---------+     |       |             |   |   +---------+ |       |
 *     +-------------------+       |             +-------------------+       |
 *         +-----------------------+                 +-----------------------+
 *
 *                                                   <-->
 *                                                padding.left
 *
 * @param viewport 原始 viewport
 * @param textAlign 文字样式
 * @param textPadding 单元格 padding 样式
 * @returns viewport range
 */
export const adjustColHeaderScrollingViewport = (
  viewport: AreaRange,
  textAlign: TextAlign,
  textPadding: Padding = { left: 0, right: 0 },
) => {
  const nextViewport = { ...viewport };

  if (textAlign === 'left') {
    nextViewport.start += textPadding.left;
    nextViewport.width -= textPadding.left;
  } else if (textAlign === 'right') {
    nextViewport.width -= textPadding.right;
  }

  return nextViewport;
};

/**
 * 根据文字样式调整绘制的起始点（底层g始终使用 center 样式绘制）
 * @param startX
 * @param restWidth
 * @param textAlign
 * @returns
 */
export const adjustColHeaderScrollingTextPostion = (
  startX: number,
  restWidth: number,
  textAlign: TextAlign,
) => {
  if (restWidth <= 0) {
    // 没有足够的空间用于调整
    return startX;
  }

  switch (textAlign) {
    case 'left':
      return startX - restWidth / 2;
    case 'right':
      return startX + restWidth / 2;
    case 'center':
    default:
      return startX;
  }
};
