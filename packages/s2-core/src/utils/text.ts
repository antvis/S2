import {
  clone,
  isArray,
  isEmpty,
  isFunction,
  isNil,
  isNumber,
  isString,
  map,
  memoize,
  size,
  toString,
  trim,
  values,
} from 'lodash';
import type { SimpleBBox } from '@antv/g-canvas';
import type { ColCell } from '../cell';
import {
  CellTypes,
  ELLIPSIS_SYMBOL,
  EMPTY_PLACEHOLDER,
} from '../common/constant';
import type {
  CellCfg,
  Condition,
  MultiData,
  S2CellType,
  SimpleDataItem,
  ViewMeta,
} from '../common/interface';
import type { Padding, TextTheme } from '../common/interface/theme';
import { renderIcon, renderText } from '../utils/g-renders';
import { getOffscreenCanvas } from './canvas';
import { renderMiniChart } from './g-mini-charts';
import { getMaxTextWidth, getTextAndFollowingIconPosition } from './cell/cell';

/**
 * 计算文本在画布中的宽度
 * @deprecated 已废弃，1.30.0 版本后移除。该方法计算宽度不准确，请使用 spreadsheet 实例上的同名方法
 */
export const measureTextWidth = memoize(
  (text: number | string = '', font: unknown): number => {
    if (!font) {
      return 0;
    }
    const ctx = getOffscreenCanvas().getContext('2d');

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
 * @param measureTextWidth 文本宽度预估函数
 * @param text 需要计算的文本, 由于历史原因 除了支持string，还支持空值,number和数组等
 * @param maxWidth
 * @param font
 */
export const getEllipsisTextInner = (
  measureTextWidth: (text: number | string, font: unknown) => number,
  text: any,
  maxWidth: number,
  font: CSSStyleDeclaration,
) => {
  const STEP = 16; // 每次 16，调参工程师
  const DOT_WIDTH = measureTextWidth(ELLIPSIS_SYMBOL, font);

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
 * @deprecated 已废弃，1.30.0 版本后移除。该方法计算宽度不准确，请使用 spreadsheet 实例上的同名方法
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
 * @param measureTextWidth 文本长度计算函数
 * @param text 需要计算的文本
 * @param maxWidth
 * @param font optional 文本字体 或 优先显示的文本
 * @param priority optional 优先显示的文本
 */
export const getEllipsisText = ({
  measureTextWidth,
  text,
  maxWidth,
  fontParam,
  priorityParam,
  placeholder,
}: {
  measureTextWidth: (text: number | string, font: unknown) => number;
  text: string | number;
  maxWidth: number;
  fontParam?: unknown;
  priorityParam?: string[];
  placeholder?: string;
}) => {
  let font = {};
  const empty = placeholder ?? EMPTY_PLACEHOLDER;
  // [null, undefined, ''] will return empty
  const finalText = isNil(text) || text === '' ? empty : `${text}`;
  let priority = priorityParam;
  if (fontParam && isArray(fontParam)) {
    priority = fontParam as string[];
  } else {
    font = fontParam || {};
  }
  if (!priority || !priority.length) {
    return getEllipsisTextInner(
      measureTextWidth,
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
  const DOT_WIDTH = measureTextWidth(ELLIPSIS_SYMBOL, font);
  let remainWidth = maxWidth;
  subTexts.forEach((subText) => {
    if (remainWidth <= 0) {
      const originIdx = result.indexOf(subText);
      const prev = result.slice(originIdx - 3, originIdx);
      if (prev && prev !== ELLIPSIS_SYMBOL) {
        const subWidth = measureTextWidth(subText, font);
        // fix-边界处理: when subWidth <= DOT_WIDTH 不做 ... 处理
        result = result.replace(
          subText,
          subWidth > DOT_WIDTH ? ELLIPSIS_SYMBOL : subText,
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
          measureTextWidth,
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
  return !!value && !trim(value).startsWith('-');
};

/**
 * 根据单元格对齐方式计算文本的 x 坐标
 * @param x 单元格的 x 坐标
 * @param paddingRight
 * @param extraWidth 额外的宽度
 * @param textAlign 文本对齐方式
 */
const calX = (
  x: number,
  padding: Padding,
  extraWidth?: number,
  textAlign = 'left',
) => {
  const { right, left } = padding;
  const extra = extraWidth || 0;
  if (textAlign === 'left') {
    return x + right / 2 + extra;
  }
  if (textAlign === 'right') {
    return x - right / 2 - extra;
  }

  return x + left / 2 + extra;
};

/**
 * 返回需要绘制的 cell 主题
 * @param cell 目标 cell
 * @returns cell 主题和具体 text 主题
 */
const getDrawStyle = (cell: S2CellType) => {
  const { isTotals } = cell.getMeta();
  const isMeasureField = (cell as ColCell).isMeasureField?.();
  const cellStyle = cell.getStyle(
    isMeasureField ? CellTypes.COL_CELL : CellTypes.DATA_CELL,
  );

  let textStyle: TextTheme;
  if (isMeasureField) {
    textStyle = cellStyle.measureText;
  } else if (isTotals) {
    textStyle = cellStyle.bolderText;
  } else {
    textStyle = cellStyle.text;
  }

  return {
    cellStyle,
    textStyle,
  };
};

/**
 * 获取当前文字的绘制样式
 */
const getCurrentTextStyle = ({
  rowIndex,
  colIndex,
  meta,
  data,
  textStyle,
  textCondition,
}: {
  rowIndex: number;
  colIndex: number;
  meta: ViewMeta;
  data: string | number;
  textStyle: TextTheme;
  textCondition?: Condition;
}) => {
  let fill = textStyle.fill;
  if (textCondition?.mapping) {
    fill = textCondition?.mapping(data, {
      rowIndex,
      colIndex,
      meta,
    }).fill;
  }
  return { ...textStyle, fill };
};

/**
 * 获取自定义空值占位符
 */
export const getEmptyPlaceholder = (
  meta: Record<string, any>,
  placeHolder: ((meta: Record<string, any>) => string) | string,
) => {
  return isFunction(placeHolder) ? placeHolder(meta) : placeHolder;
};

/**
 * @desc 获取多指标情况下每一个指标的内容包围盒
 * --------------------------------------------
 * |  text icon  |  text icon  |  text icon  |
 * |-------------|-------------|-------------|
 * |  text icon  |  text icon  |  text icon  |
 * --------------------------------------------
 * @param box SimpleBBox 整体绘制内容包围盒
 * @param texts  SimpleDataItem[][] 指标集合
 * @param widthPercent number[] 每行指标的宽度百分比
 */
export const getContentAreaForMultiData = (
  box: SimpleBBox,
  textValues: SimpleDataItem[][],
  widthPercent?: number[],
) => {
  const { x, y, width, height } = box;
  const avgHeight = height / size(textValues);
  const boxes: SimpleBBox[][] = [];
  let curX: number;
  let curY: number;
  let avgWidth: number;
  let totalWidth = 0;

  const percents = map(widthPercent, (item) => (item > 1 ? item / 100 : item));

  for (let i = 0; i < size(textValues); i++) {
    curY = y + avgHeight * i;
    const rows: SimpleBBox[] = [];
    curX = x;
    totalWidth = 0;
    for (let j = 0; j < size(textValues[i]); j++) {
      avgWidth = !isEmpty(percents)
        ? width * percents[j]
        : width / size(textValues[0]); // 指标个数相同，任取其一即可

      curX = calX(x, { left: 0, right: 0 }, totalWidth, 'left');
      totalWidth += avgWidth;
      rows.push({
        x: curX,
        y: curY,
        width: avgWidth,
        height: avgHeight,
      });
    }
    boxes.push(rows);
  }
  return boxes;
};

/**
 * @desc draw text shape of object
 * @param cell
 * @multiData 自定义文本内容
 * @useCondition 是否使用条件格式
 */
export const drawObjectText = (
  cell: S2CellType,
  multiData?: MultiData,
  useCondition = true,
) => {
  const {
    x,
    y,
    height: totalTextHeight,
    width: totalTextWidth,
  } = cell.getContentArea();
  const text = multiData || (cell.getMeta().fieldValue as MultiData);
  const { values: textValues } = text;
  const { options, measureTextWidth } = cell.getMeta().spreadsheet;
  const { valuesCfg } = options.style.cellCfg;
  // 趋势分析表默认只作用一个条件（因为指标挂行头，每列都不一样，直接在回调里判断是否需要染色即可）
  const textCondition = options?.conditions?.text?.[0];
  const iconCondition = options?.conditions?.icon?.[0];

  if (!isArray(textValues)) {
    renderMiniChart(cell, textValues);
    return;
  }

  const widthPercent = valuesCfg?.widthPercent;

  let labelHeight = 0;
  // 绘制单元格主标题
  if (text?.label) {
    const dataCellStyle = cell.getStyle(CellTypes.DATA_CELL);
    const labelStyle = dataCellStyle.bolderText;
    // TODO 把padding计算在内
    // const { padding } = dataCellStyle.cell;
    labelHeight = totalTextHeight / (textValues.length + 1);

    const textShape = renderText(
      cell,
      [],
      x,
      y + labelHeight / 2,
      getEllipsisText({
        measureTextWidth,
        text: text.label,
        maxWidth: totalTextWidth,
        fontParam: labelStyle,
      }),
      labelStyle,
    );

    cell.addTextShape(textShape);
  }

  // 绘制指标
  const { cellStyle, textStyle } = getDrawStyle(cell);

  const iconStyle = cellStyle?.icon;
  const iconCfg = iconCondition &&
    iconCondition.mapping && {
      size: iconStyle?.size,
      margin: iconStyle?.margin,
      position: iconCondition?.position,
    };

  let curText: string | number;

  const contentBoxes = getContentAreaForMultiData(
    {
      x,
      y: y + labelHeight,
      height: totalTextHeight - labelHeight,
      width: totalTextWidth,
    },
    textValues,
    widthPercent,
  );

  for (let i = 0; i < textValues.length; i++) {
    const measures = clone(textValues[i]);

    for (let j = 0; j < measures.length; j++) {
      curText = measures[j];
      const curStyle = useCondition
        ? getCurrentTextStyle({
            rowIndex: i,
            colIndex: j,
            meta: cell?.getMeta() as ViewMeta,
            data: curText,
            textStyle,
            textCondition,
          })
        : textStyle;
      const { placeholder } = cell?.getMeta().spreadsheet.options;
      const emptyPlaceholder = getEmptyPlaceholder(
        cell?.getMeta(),
        placeholder,
      );

      const maxTextWidth = getMaxTextWidth(contentBoxes[i][j].width, iconStyle);
      const ellipsisText = getEllipsisText({
        measureTextWidth,
        text: curText,
        maxWidth: maxTextWidth,
        fontParam: curStyle,
        placeholder: emptyPlaceholder,
      });
      const actualTextWidth = measureTextWidth(ellipsisText, textStyle);

      const position = getTextAndFollowingIconPosition(
        contentBoxes[i][j],
        textStyle,
        actualTextWidth,
        iconCfg,
        iconCondition ? 1 : 0,
      );

      const textShape = renderText(
        cell,
        [],
        position.text.x,
        position.text.y,
        ellipsisText,
        curStyle,
        {},
        curText?.toString(),
      );
      cell.addTextShape(textShape);

      // 绘制条件格式的 icon
      if (iconCondition && useCondition) {
        const attrs = iconCondition?.mapping(curText, {
          rowIndex: i,
          colIndex: j,
          meta: cell?.getMeta() as ViewMeta,
        });
        if (attrs) {
          const iconShape = renderIcon(cell, {
            ...position.icon,
            name: attrs.icon,
            width: iconStyle?.size,
            height: iconStyle?.size,
            fill: attrs.fill,
          });
          cell.addConditionIconShape(iconShape);
        }
      }
    }
  }
};

/**
 * 根据 cellCfg 配置获取当前单元格宽度
 */
export const getCellWidth = (cellCfg: CellCfg, labelSize = 1) => {
  return cellCfg?.width * labelSize;
};

export const safeJsonParse = (val: string) => {
  try {
    return JSON.parse(val);
  } catch (err) {
    return null;
  }
};
