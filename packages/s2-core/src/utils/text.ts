import {
  clone,
  get,
  isArray,
  isNil,
  isNumber,
  isString,
  memoize,
  toString,
  values,
} from 'lodash';
import { customMerge } from '@/utils/merge';
import { CellCfg, MultiData } from '@/common/interface';
import { S2Options } from '@/common/interface/s2Options';
import { DefaultCellTheme } from '@/common/interface/theme';
import { renderText } from '@/utils/g-renders';
import { DataCell } from '@/cell/data-cell';
import { CellTypes, EMPTY_PLACEHOLDER } from '@/common/constant';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

/**
 * 计算文本在画布中的宽度
 */
export const measureTextWidth = memoize(
  (text: number | string = '', font: unknown): number => {
    if (!font) {
      return 0;
    }
    const { fontSize, fontFamily, fontWeight, fontStyle, fontVariant } =
      font as CSSStyleDeclaration;
    // copy G 里面的处理逻辑
    ctx.font = [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily]
      .join(' ')
      .trim();

    return ctx.measureText(`${text}`).width;
  },
  (text: any, font) => [text, ...values(font)].join(''),
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
export const getEllipsisTextInner = (
  text: any,
  maxWidth: number,
  font: CSSStyleDeclaration,
) => {
  const STEP = 16; // 每次 16，调参工程师
  const DOT_WIDTH = measureTextWidth('...', font);

  let leftText;

  if (!isString(text)) {
    leftText = toString(text);
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

  let runningStep1 = true;
  // 首先通过 step 计算，找出最大的未超出长度的
  while (runningStep1) {
    // 更新字符串
    currentText = leftText.substr(0, STEP);

    // 计算宽度
    currentWidth = measureTextWidth(currentText, font);

    // 超出剩余宽度，则停止
    if (currentWidth + DOT_WIDTH > leftWidth) {
      if (currentWidth > leftWidth) {
        runningStep1 = false;
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

  let runningStep2 = true;
  // 最下的最后一个 STEP，使用 1 递增（用二分效果更高）
  while (runningStep2) {
    // 更新字符串
    currentText = leftText.substr(0, 1);

    // 计算宽度
    currentWidth = measureTextWidth(currentText, font);

    // 超出剩余宽度，则停止
    if (currentWidth + DOT_WIDTH > leftWidth) {
      runningStep2 = false;
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
export const measureTextWidthRoughly = (text: any, font: any = {}): number => {
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
export const getEllipsisText = ({
  text,
  maxWidth,
  fontParam,
  priorityParam,
  placeholder,
}: {
  text: string;
  maxWidth: number;
  fontParam?: unknown;
  priorityParam?: string[];
  placeholder?: string;
}) => {
  let font = {};
  const empty = placeholder ?? EMPTY_PLACEHOLDER;
  // [null, undefined, ''] will return empty
  const finalText = isNil(text) || text === '' ? empty : text;
  let priority = priorityParam;
  if (fontParam && isArray(fontParam)) {
    priority = fontParam as string[];
  } else {
    font = fontParam || {};
  }
  if (!priority || !priority.length) {
    return getEllipsisTextInner(
      finalText,
      maxWidth,
      font as CSSStyleDeclaration,
    );
  }

  const leftSubTexts = [];
  let subTexts = [finalText];
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

  let result = finalText;
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
        const ellipsis = getEllipsisTextInner(
          subText,
          remainWidth,
          font as CSSStyleDeclaration,
        );
        result = result.replace(subText, ellipsis);
        remainWidth = 0;
      } else {
        remainWidth -= subWidth;
      }
    }
  });

  return result;
};

/**
 * To decide whether the data is positive or negative.
 * Two cases needed to be considered since  the derived value could be number or string.
 * @param value
 * @param font
 */
export const isUpDataValue = (value: number | string): boolean => {
  if (isNumber(value)) {
    return value >= 0;
  }
  return !/^-/.test(value);
};

const calX = (x: number, paddingRight: number, total?: number) => {
  const extra = total || 0;
  return x + paddingRight / 2 + extra;
};

const getStyle = (
  rowIndex: number,
  colIndex: number,
  value: string | number,
  options: S2Options,
  dataCellTheme: DefaultCellTheme,
) => {
  const cellCfg = get(options, 'style.cellCfg', {}) as Partial<CellCfg>;
  const derivedMeasureIndex = cellCfg?.firstDerivedMeasureRowIndex;
  const minorMeasureIndex = cellCfg?.minorMeasureRowIndex;
  const isMinor = rowIndex === minorMeasureIndex;
  const isDerivedMeasure = colIndex >= derivedMeasureIndex;
  const style = isMinor
    ? clone(dataCellTheme?.minorText)
    : clone(dataCellTheme.text);
  const derivedMeasureText = dataCellTheme.derivedMeasureText;
  const upFill = isMinor
    ? derivedMeasureText?.minorUp
    : derivedMeasureText?.mainUp;
  const downFill = isMinor
    ? derivedMeasureText?.minorDown
    : derivedMeasureText?.mainDown;
  if (isDerivedMeasure) {
    const isUp = isUpDataValue(value);
    return customMerge(style, {
      fill: isUp ? upFill : downFill,
    });
  }
  return style;
};

/**
 * @desc draw text shape of object
 * @param cell
 */
export const drawObjectText = (cell: DataCell) => {
  const { x, y, height, width } = cell.getContentArea();
  const text = cell.getMeta().fieldValue as MultiData;
  const dataCellStyle = cell.getStyle(CellTypes.DATA_CELL);

  const padding = dataCellStyle.cell.padding;
  // 指标个数相同，任取其一即可
  const realWidth = width / (text.values[0].length + 1);
  const realHeight = height / (text.values.length + 1);
  let labelHeight = 0;
  // 绘制单元格主标题
  if (text?.label) {
    labelHeight = realHeight / 2;
    const labelStyle = dataCellStyle.bolderText;

    renderText(
      cell,
      [],
      calX(x, padding.right),
      y + labelHeight,
      getEllipsisText({
        text: text.label,
        maxWidth: width - padding.left,
        fontParam: labelStyle,
      }),
      labelStyle,
    );
  }

  // 绘制指标
  const { values: textValues } = text;
  let curText: string | number;
  let curX: number;
  let curY: number = y + realHeight / 2;
  let curWidth: number;
  let totalWidth = 0;
  for (let i = 0; i < textValues.length; i += 1) {
    curY = y + realHeight * (i + 1) + labelHeight; // 加上label的高度
    totalWidth = 0;
    for (let j = 0; j < textValues[i].length; j += 1) {
      curText = textValues[i][j] || '-';
      const curStyle = getStyle(
        i,
        j,
        curText,
        cell?.getMeta().spreadsheet.options,
        dataCellStyle,
      );
      curWidth = j === 0 ? realWidth * 2 : realWidth;
      curX = calX(x, padding.right, totalWidth);
      totalWidth += curWidth;
      renderText(
        cell,
        [],
        curX,
        curY,
        getEllipsisText({
          text: `${curText}`,
          maxWidth: curWidth,
          fontParam: curStyle,
        }),
        curStyle,
      );
    }
  }
};
