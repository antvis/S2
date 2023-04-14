import type { AreaRange } from '../../common/interface';
import { NormalizedAlign } from '../normalize';

/**
 * 动态调整滚动过程中列头的可视区域
 */
export const adjustTextIconPositionWhileScrolling = (
  viewportArea: AreaRange,
  contentArea: AreaRange,
  style: {
    align: NormalizedAlign;
    size: {
      textSize: number;
      iconStartSize?: number;
      iconEndSize?: number;
    };
    padding: {
      start: number;
      end: number;
      betweenTextAndEndIcon?: number;
    };
  },
) => {
  const { align, size, padding } = style;
  const { textSize, iconStartSize = 0, iconEndSize = 0 } = size;
  let { betweenTextAndEndIcon = 0 } = padding;

  betweenTextAndEndIcon = iconEndSize ? betweenTextAndEndIcon : 0;

  const totalSize = textSize + iconStartSize + iconEndSize;

  const paddingArea: AreaRange = {
    start: contentArea.start - padding.start,
    size: contentArea.size + padding.start + padding.end,
  };
  const paddingAreaEnd = paddingArea.start + paddingArea.size;
  const contentAreaEnd = contentArea.start + contentArea.size;
  const viewportAreaEnd = viewportArea.start + viewportArea.size;

  function getTextIconPosition(area: AreaRange) {
    switch (align) {
      case NormalizedAlign.Start:
        return {
          iconStart: area.start,
          textStart: area.start + iconStartSize,
          iconEnd:
            area.start + iconStartSize + textSize + betweenTextAndEndIcon,
        };

      case NormalizedAlign.Center:
        const start = area.start + area.size / 2 - totalSize / 2;

        return {
          iconStart: start,
          textStart: start + iconStartSize + textSize / 2,
          iconEnd: start + iconStartSize + textSize + betweenTextAndEndIcon,
        };

      default:
        const areaEnd = area.start + area.size;

        return {
          iconStart: areaEnd - iconEndSize - textSize - iconStartSize,
          textStart: areaEnd - iconEndSize,
          iconEnd: areaEnd - iconEndSize + betweenTextAndEndIcon,
        };
    }
  }

  if (
    paddingArea.start >= viewportArea.start &&
    paddingAreaEnd <= viewportAreaEnd
  ) {
    /**
     *   +----------------------------+
     *   |  +-------------+           |
     *   |  | text | icon |  viewport |
     *   |  +-------------+           |
     *   +----------------------------+
     */

    return getTextIconPosition(contentArea);
  }

  if (
    paddingArea.start < viewportArea.start &&
    paddingAreaEnd <= viewportAreaEnd
  ) {
    /**
     *         +-------------------+
     *  +------|------+            |
     *  | text | icon |   viewport |
     *  +------|------+            |
     *         +-------------------+
     */
    const area: AreaRange = {
      start:
        viewportArea.start +
        (align !== NormalizedAlign.End ? padding.start : 0),
      size:
        contentArea.size -
        (viewportArea.start - contentArea.start) -
        (align !== NormalizedAlign.End ? padding.start : 0),
    };

    if (area.size < totalSize) {
      area.size = totalSize;
      area.start = contentAreaEnd - totalSize;
    }

    return getTextIconPosition(area);
  }

  if (
    paddingArea.start >= viewportArea.start &&
    paddingAreaEnd > viewportAreaEnd
  ) {
    /**
     *   +-------------------+
     *   |            +------|------+
     *   | viewport   | text | icon |
     *   |            +------|------+
     *   +-------------------+
     */
    const area: AreaRange = {
      start: contentArea.start,
      size:
        contentArea.size -
        (contentAreaEnd - viewportAreaEnd) -
        (align !== NormalizedAlign.Start ? padding.end : 0),
    };

    if (area.size < totalSize) {
      area.size = totalSize;
      area.start = contentArea.start;
    }

    return getTextIconPosition(area);
  }
  /**
   *     +----------------------+
   *     |      viewport        |
   *  +--|----------------------|--+
   *  |  |    text | icon       |  |
   *  +--|----------------------|--+
   *     +----------------------+
   */

  const area: AreaRange = {
    start: viewportArea.start + padding.start,
    size: viewportArea.size - padding.start - padding.end,
  };

  /**
   * 这种情况下需要考虑文本内容超级长，超过了可视区域范围的情况，在这情况下，文字的对齐方式无论是啥都没有意义，为了使内容能随着滚动完全被显示出来（以向左滚动为例）：
   *   1. 将文字和 icon 在单元格内居中对齐，以对齐后的文字和 icon 内容的起始点做作为左边界，结束点作为右边界
   *   2. 如果当前左边界还在可视范围内，则以内容左边界贴边显示
   *   3. 如果左边界滚出可视范围，则内容以左边界为界限，文字也跟随一起滚动
   *   4. 直到右边界进入可以范围内，则以内容右边界贴边显示
   *     +----------------------+
   *     |      viewport        |
   *  +--|----------------------|----------------------+
   *  |      | super super super| super long text   |  |
   *  +--|---|------------------|-------------------|--+
   *     +---|------------------|                   |
   *         v                  v                   v
   *       start              center               end
   */
  if (area.size < totalSize) {
    const contentStart =
      contentArea.start + contentArea.size / 2 - totalSize / 2;
    const contentEnd = contentStart + totalSize;

    // eslint-disable-next-line no-empty
    if (contentStart > area.start) {
    } else if (contentEnd > area.start + area.size) {
      area.start = contentStart;
    } else {
      area.start -= totalSize - area.size;
    }

    area.size = totalSize;
  }

  return getTextIconPosition(area);
};
