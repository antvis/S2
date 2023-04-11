import { merge } from 'lodash';
import type { SimpleBBox } from '../../engine';
import {
  CellClipBox,
  type CellTheme,
  type IconStyle,
  type TextAlignStyle,
  type TextBaseline,
} from '../../common/interface';
import { CellBorderPosition } from '../../common/interface';

/**
 * text 和 icon 之间布局关系：
 *    y轴： text 和 icon 高度上居中对齐
 *    x轴：
 *       1. text 和 icon 同为 left 或者 right 时，icon bbox 只需要简单放置在 left 或者 right 即可
 *       2. 其他的情况，需要根据实际 text width 确定 icon bbox 开始位置
 */

const normalizeIconStyle = (iconStyle?: IconStyle): IconStyle =>
  merge(
    {
      size: 0,
      position: 'right',
      margin: {
        left: 0,
        right: 0,
      },
    },
    iconStyle,
  );

export const getMaxTextWidth = (contentWidth: number, iconCfg?: IconStyle) => {
  iconCfg = normalizeIconStyle(iconCfg);

  return (
    contentWidth -
    iconCfg.size! -
    iconCfg!.margin!.right! -
    iconCfg!.margin!.left!
  );
};

export const getVerticalPosition = (
  bbox: SimpleBBox,
  textBaseline: TextBaseline,
  size = 0,
) => {
  const { y, height } = bbox;

  switch (textBaseline) {
    case 'top':
      return y;
    case 'middle':
      return y + height / 2 - size / 2;
    default:
      return y + height - size;
  }
};

export const getVerticalIconPositionByText = (
  iconSize: number,
  textY: number,
  textFontSize: number,
  textBaseline: TextBaseline,
) => {
  const offset = (textFontSize - iconSize) / 2;

  switch (textBaseline) {
    case 'top':
      return textY + offset;
    case 'middle':
      return textY - iconSize / 2;
    default:
      return textY - offset - iconSize;
  }
};

// 获取text及其跟随icon的位置坐标
export const getTextIconPosition = (options: {
  bbox: SimpleBBox;
  textStyle: TextAlignStyle | undefined;
  textWidth?: number;
  iconStyle?: IconStyle;
  iconCount?: number;
}) => {
  const { bbox, textStyle, textWidth = 0, iconStyle, iconCount = 1 } = options;
  const { x, width } = bbox;
  const { textAlign, textBaseline } = textStyle!;
  const {
    size,
    margin,
    position: iconPosition,
  } = normalizeIconStyle(iconStyle);

  const iconSpace =
    iconCount * (size! + margin!.left!) + (iconCount ? margin!.right! : 0);
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
        x +
        (iconPosition === 'left' ? margin!.left! : textWidth + margin!.left!);
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
        (iconPosition === 'left' ? margin!.left! : margin!.right!) +
        textWidth;
      const startX = x + width / 2 - totalWidth / 2;

      textX =
        startX +
        textWidth / 2 +
        (iconPosition === 'left' ? iconSpace - margin!.left! : 0);
      iconX =
        startX + (iconPosition === 'left' ? 0 : textWidth + margin!.left!);
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
          ? iconSpace - margin?.left!
          : textWidth + iconSpace - margin?.left!);
      break;
    }
  }

  const textY = getVerticalPosition(bbox, textBaseline!, 0);
  const iconY = getVerticalPosition(bbox, textBaseline!, size);

  return {
    text: { x: textX, y: textY },
    icon: { x: iconX, y: iconY },
  };
};

/**
 * 类似 background-clip 属性: https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip
 * 分为三种类型：
 * borderBox: 整个 cell 的范围
 * paddingBox: cell 去除 border 的范围
 * contentBox: cell 去除 (border + padding) 的范围
 * -------------------------------
 * |b|           padding         |
 * |o|  |---------------------|  |
 * |r|  |                     |  |
 * |d|  |                     |  |
 * |e|  |---------------------|  |
 * |r|           padding         |
 * -------------------------------
 * -------border-bottom-----------
 * -------------------------------
 */
export const getCellBoxByType = (
  bbox: SimpleBBox,
  borderPositions: CellBorderPosition[],
  cellStyle: CellTheme,
  boxType: CellClipBox,
) => {
  if (boxType === CellClipBox.BORDER_BOX) {
    return bbox;
  }

  let { x, y, width, height } = bbox;
  const {
    padding,
    horizontalBorderWidth = 0,
    verticalBorderWidth = 0,
  } = cellStyle;

  borderPositions.forEach((position) => {
    const borderWidth = [
      CellBorderPosition.BOTTOM,
      CellBorderPosition.TOP,
    ].includes(position)
      ? horizontalBorderWidth
      : verticalBorderWidth;

    switch (position) {
      case CellBorderPosition.TOP:
        y += borderWidth;
        height -= borderWidth;
        break;
      case CellBorderPosition.BOTTOM:
        height -= borderWidth;
        break;
      case CellBorderPosition.LEFT:
        x += borderWidth;
        width -= borderWidth;
        break;
      default:
        width -= borderWidth;
        break;
    }
  });

  if (boxType === CellClipBox.CONTENT_BOX) {
    x += padding?.left!;
    y += padding?.top!;
    width -= padding?.left! + padding?.right!;
    height -= padding?.top! + padding?.bottom!;
  }

  return {
    x,
    y,
    width,
    height,
  };
};

export const getBorderPositionAndStyle = (
  position: CellBorderPosition,
  bbox: SimpleBBox,
  style: CellTheme,
) => {
  const { x, y, width, height } = bbox;
  const {
    horizontalBorderWidth = 0,
    horizontalBorderColorOpacity,
    horizontalBorderColor,
    verticalBorderWidth = 0,
    verticalBorderColor,
    verticalBorderColorOpacity,
  } = style;

  const borderStyle = [
    CellBorderPosition.TOP,
    CellBorderPosition.BOTTOM,
  ].includes(position)
    ? {
        lineWidth: horizontalBorderWidth,
        stroke: horizontalBorderColor,
        strokeOpacity: horizontalBorderColorOpacity,
      }
    : {
        lineWidth: verticalBorderWidth,
        stroke: verticalBorderColor,
        strokeOpacity: verticalBorderColorOpacity,
      };

  let x1 = 0;
  let y1 = 0;
  let x2 = 0;
  let y2 = 0;

  // horizontal
  if (
    position === CellBorderPosition.TOP ||
    position === CellBorderPosition.BOTTOM
  ) {
    let yPosition = y;

    if (position === CellBorderPosition.TOP) {
      // 完全绘制在 Cell 内，否则会导致 Border 粗细不一： https://github.com/antvis/S2/issues/426
      yPosition = y + horizontalBorderWidth / 2;
    } else {
      yPosition = y + height - horizontalBorderWidth / 2;
    }

    y1 = yPosition;
    y2 = yPosition;
    x1 = x;
    x2 = x + width;
  }

  // vertical
  if (
    position === CellBorderPosition.LEFT ||
    position === CellBorderPosition.RIGHT
  ) {
    let xPosition = x;

    if (position === CellBorderPosition.LEFT) {
      xPosition = x + verticalBorderWidth / 2;
    } else {
      xPosition = x + width - verticalBorderWidth / 2;
    }

    x1 = xPosition;
    x2 = xPosition;
    y1 = y;
    y2 = y + height;
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
