import * as _ from 'lodash';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

/**
 * 计算文本在画布中的宽度
 */
export const measureTextWidth = _.memoize(
  (text: any, font): number => {
    const { fontSize, fontFamily, fontWeight, fontStyle, fontVariant } = font;
    ctx.font = [
      fontStyle,
      fontVariant,
      fontWeight,
      `${fontSize}px`,
      fontFamily,
    ].join(' ');
    return ctx.measureText(_.isString(text) ? text : '').width;
  },
  (text: any, font) => [text, ..._.values(font)].join(''),
);

/**
 * 获取文本的 ... 文本。
 * 算法（减少每次 measureText 的长度，measureText 的性能跟字符串时间相关）：
 * 1. 先通过 STEP 逐步计算，找到最后一个小于 maxWidth 的字符串
 * 2. 然后对最后这个字符串二分计算
 * @param text 需要计算的文本, 由于历史原因 除了支持string，还支持空值,number和数组等
 * @param maxWidth
 * @param font
 */
export const getEllipsisTextInner = (text: any, maxWidth: number, font) => {
  const STEP = 16; // 每次 16，调参工程师
  const DOT_WIDTH = measureTextWidth('...', font);

  let leftText;

  if (!_.isString(text)) {
    leftText = _.toString(text);
  } else {
    leftText = text;
  }

  let leftWidth = maxWidth;

  const r = []; // 最终的分段字符串
  let currentText;
  let currentWidth;

  if (measureTextWidth(text, font) <= maxWidth) {
    return text;
  }

  // 首先通过 step 计算，找出最大的未超出长度的
  while (true) {
    // 更新字符串
    currentText = leftText.substr(0, STEP);

    // 计算宽度
    currentWidth = measureTextWidth(currentText, font);

    // 超出剩余宽度，则停止
    if (currentWidth + DOT_WIDTH > leftWidth) {
      if (currentWidth > leftWidth) {
        break;
      }
    }

    r.push(currentText);

    // 没有超出，则计算剩余宽度
    leftWidth -= currentWidth;
    leftText = leftText.substr(STEP);

    // 字符串整体没有超出
    if (!leftText) {
      return r.join('');
    }
  }

  // 最下的最后一个 STEP，使用 1 递增（用二分效果更高）
  while (true) {
    // 更新字符串
    currentText = leftText.substr(0, 1);

    // 计算宽度
    currentWidth = measureTextWidth(currentText, font);

    // 超出剩余宽度，则停止
    if (currentWidth + DOT_WIDTH > leftWidth) {
      break;
    }

    r.push(currentText);
    // 没有超出，则计算剩余宽度
    leftWidth -= currentWidth;
    leftText = leftText.substr(1);

    if (!leftText) {
      return r.join('');
    }
  }

  return `${r.join('')}...`;
};

/**
 * 追求性能，粗略的计算文本的宽高！
 *
 * 算法逻辑：
 * 计算一个字符串中，符号[0-255]，中文（其他）的个数
 * 然后分别乘以中文、符号的宽度
 * @param text
 * @param font
 */
export const measureTextWidthRoughly = (text: any, font = {}): number => {
  const alphaWidth = measureTextWidth('a', font);
  const chineseWidth = measureTextWidth('蚂', font);

  let w = 0;
  if (!text) {
    return w;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const char of text) {
    const code = char.charCodeAt(0);

    // /[\u0000-\u00ff]/
    w += code >= 0 && code <= 255 ? alphaWidth : chineseWidth;
  }

  return w;
};

/**
 * @desc 改良版 获取文本的 ... 文本（可传入 优先文本片段）
 * @param text 需要计算的文本
 * @param maxWidth
 * @param font optional 文本字体 或 优先显示的文本
 * @param priority optional 优先显示的文本
 */
export const getEllipsisText = (
  text: string,
  maxWidth: number,
  fontParam?,
  priorityParam?: string[],
) => {
  let font = {};
  let priority = priorityParam;
  if (fontParam && _.isArray(fontParam)) {
    priority = fontParam as string[];
  } else {
    font = fontParam || {};
  }
  if (!priority || !priority.length) {
    return getEllipsisTextInner(text, maxWidth, font);
  }

  const leftSubTexts = [];
  let subTexts = [text];
  priority.forEach((priorityItem) => {
    subTexts.forEach((tempSubText, index) => {
      // 处理 leftText
      let startIdx = -1;
      const matched = tempSubText.match(new RegExp(priorityItem));
      if (matched) {
        const matchedText = matched[0];
        startIdx = matched.index;
        leftSubTexts.push(matchedText);
        const endIdx = startIdx + matchedText.length;
        const left = tempSubText.slice(0, startIdx);
        const right = tempSubText.slice(endIdx);
        const tmp = [left, right].filter((v) => !!v);
        subTexts.splice(index, 1, ...tmp);
      }
    });
  });

  // original text is split into serval texts by priority
  subTexts = leftSubTexts.concat(subTexts);

  let result = text;
  const DOT_WIDTH = measureTextWidth('...', font);
  let remainWidth = maxWidth;
  subTexts.forEach((subText) => {
    if (remainWidth <= 0) {
      const originIdx = result.indexOf(subText);
      const prev = result.slice(originIdx - 3, originIdx);
      if (prev && prev !== '...') {
        const subWidth = measureTextWidth(subText, font);
        // fix-边界处理: when subWidth <= DOT_WIDTH 不做 ... 处理
        result = result.replace(
          subText,
          subWidth > DOT_WIDTH ? '...' : subText,
        );
      } else {
        result = result.replace(subText, '');
      }
      remainWidth -= DOT_WIDTH;
    } else {
      const subWidth = measureTextWidth(subText, font);
      // fix-边界处理: when subWidth <= DOT_WIDTH 不做 ... 处理
      if (remainWidth < subWidth && subWidth > DOT_WIDTH) {
        const ellipsis = getEllipsisTextInner(subText, remainWidth, font);
        result = result.replace(subText, ellipsis);
        remainWidth = 0;
      } else {
        remainWidth -= subWidth;
      }
    }
  });

  return result;
};
