import {
  clone,
  isArray,
  isEmpty,
  isFunction,
  isNil,
  isNumber,
  isString,
  map,
  size,
  toString,
  trim,
} from 'lodash';
import type { ColCell } from '../cell';
import {
  CellType,
  ELLIPSIS_SYMBOL,
  EMPTY_FIELD_VALUE,
  EMPTY_PLACEHOLDER,
} from '../common/constant';
import {
  CellClipBox,
  type DataCellStyle,
  type MultiData,
  type S2CellType,
  type S2Options,
  type SimpleData,
  type TextCondition,
  type ViewMeta,
} from '../common/interface';
import type {
  InternalFullyCellTheme,
  Padding,
  TextTheme,
} from '../common/interface/theme';
import type { SimpleBBox } from '../engine';
import { renderIcon } from '../utils/g-renders';
import {
  getHorizontalTextIconPosition,
  getVerticalIconPosition,
  getVerticalTextPosition,
} from './cell/cell';
import type { GroupedIcons } from './cell/header-cell';
import { getIconPosition } from './condition/condition';
import { renderMiniChart } from './g-mini-charts';

export const getDisplayText = (
  text: string | number | null | undefined,
  placeholder?: string,
) => {
  const empty = placeholder ?? EMPTY_PLACEHOLDER;

  // [null, undefined, ''] will return empty
  return isNil(text) || text === '' ? empty : `${text}`;
};

/**
 * 获取文本的 ... 文本。
 * 算法（减少每次 measureText 的长度，measureText 的性能跟字符串时间相关）：
 * 1. 先通过 STEP 逐步计算，找到最后一个小于 maxWidth 的字符串
 * 2. 然后对最后这个字符串二分计算
 * @param measureTextWidth 文本宽度预估函数
 * @param text 需要计算的文本, 由于历史原因 除了支持string，还支持空值,number和数组等
 * @param maxWidth
 * @param font
 * @deprecated
 */
export const getEllipsisTextInner = (
  measureTextWidth: (text: number | string, font: unknown) => number,
  text: any,
  maxWidth: number,
  font: TextTheme,
) => {
  // 每次 16，调参工程师
  const STEP = 16;
  const DOT_WIDTH = measureTextWidth(ELLIPSIS_SYMBOL, font);

  let leftText;

  if (!isString(text)) {
    leftText = toString(text);
  } else {
    leftText = text;
  }

  let leftWidth = maxWidth;

  // 最终的分段字符串
  const r = [];
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
 * @desc 改良版 获取文本的 ... 文本（可传入 优先文本片段）
 * @param measureTextWidth 文本长度计算函数
 * @param text 需要计算的文本
 * @param maxWidth
 * @param font optional 文本字体 或 优先显示的文本
 * @param priority optional 优先显示的文本
 * @deprecated
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
  text: string | number | null | undefined;
  maxWidth: number;
  fontParam?: TextTheme;
  priorityParam?: string[];
  placeholder?: string;
}) => {
<<<<<<< HEAD
  let font: TextTheme = {} as TextTheme;
=======
  let font = {};
  const emptyPlaceholder = placeholder ?? EMPTY_PLACEHOLDER;
  // 对应维度缺少维度数据时, 会使用 EMPTY_FIELD_VALUE 填充, 实际渲染时统一转成 "-"
  const isEmptyText = isNil(text) || text === '' || text === EMPTY_FIELD_VALUE;
  const finalText = isEmptyText ? emptyPlaceholder : `${text}`;

>>>>>>> origin/master
  let priority = priorityParam;

  const finalText = getDisplayText(text, placeholder);

  if (fontParam && isArray(fontParam)) {
    priority = fontParam as string[];
  } else {
    font = fontParam || ({} as TextTheme);
  }

  if (!priority || !priority.length) {
    return getEllipsisTextInner(measureTextWidth, finalText, maxWidth, font);
  }

  const leftSubTexts: string[] = [];
  let subTexts = [finalText];

  priority.forEach((priorityItem) => {
    subTexts.forEach((tempSubText, index) => {
      // 处理 leftText
      let startIdx = -1;
      const matched = tempSubText.match(new RegExp(priorityItem));

      if (matched?.index) {
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
          font,
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
 */
export const isUpDataValue = (value: number | string): boolean => {
  if (isNumber(value)) {
    return value >= 0;
  }

  return !!value && !trim(value).startsWith('-');
};

/**
 * Determines whether the data is actually equal to 0 or empty or nil
 * example: "0.00%" => true
 * @param value
 */
export const isZeroOrEmptyValue = (value: number | string): boolean => {
  return (
    isNil(value) ||
    value === '' ||
    Number(String(value).replace(/[^0-9.]+/g, '')) === 0
  );
};

/**
 * Determines whether the data is actually equal to 0 or empty or nil or equals to compareValue
 * example: "0.00%" => true
 * @param value
 * @param compareValue
 */
export const isUnchangedValue = (
  value: number | string,
  compareValue: number | string,
): boolean => {
  return isZeroOrEmptyValue(value) || value === compareValue;
};

/**
 * 根据单元格对齐方式计算文本的 x 坐标
 * @param x 单元格的 x 坐标
 * @param padding @Padding
 * @param extraWidth 额外的宽度
 * @param textAlign 文本对齐方式
 */
const calX = (
  x: number,
  padding: Padding,
  extraWidth?: number,
  textAlign = 'left',
) => {
  const { right = 0, left = 0 } = padding;
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
<<<<<<< HEAD
  const cellStyle: InternalFullyCellTheme = cell.getStyle(
    isMeasureField ? CellType.COL_CELL : CellType.DATA_CELL,
  );
=======
  const cellStyle = cell.getStyle(cell.cellType || CellTypes.DATA_CELL);
>>>>>>> origin/master

  let textStyle: TextTheme | undefined;

  if (isMeasureField) {
    textStyle = cellStyle?.measureText;
  } else if (isTotals) {
    textStyle = cellStyle?.bolderText;
  } else {
    textStyle = cellStyle?.text;
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
  textStyle?: TextTheme;
  textCondition?: TextCondition;
}): TextTheme => {
  const style = textCondition?.mapping?.(data, {
    rowIndex,
    colIndex,
    meta,
  });

  return { ...textStyle, ...style };
};

/**
 * 获取自定义空值占位符
 */
export const getEmptyPlaceholder = (
  meta: Record<string, any>,
  placeHolder: S2Options['placeholder'],
) => (isFunction(placeHolder) ? placeHolder(meta) : placeHolder);

/**
 * @desc 获取多指标情况下每一个指标的内容包围盒
 * --------------------------------------------
 * |  text icon  |  text icon  |  text icon  |
 * |-------------|-------------|-------------|
 * |  text icon  |  text icon  |  text icon  |
 * --------------------------------------------
 * @param box SimpleBBox 整体绘制内容包围盒
 * @param textValues  SimpleDataItem[][] 指标集合
 * @param widthPercent number[] 每行指标的宽度百分比
 */
export const getContentAreaForMultiData = (
  box: SimpleBBox,
  textValues: SimpleData[][],
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
      // 指标个数相同，任取其一即可
      avgWidth = !isEmpty(percents)
        ? width * percents[j]
        : width / size(textValues[0]);

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
// eslint-disable-next-line max-lines-per-function
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
  } = cell.getBBoxByType(CellClipBox.CONTENT_BOX);
  const meta = cell.getMeta() as ViewMeta;
  const text = multiData || (meta.fieldValue as MultiData);
  const { values: textValues } = text;
  const { options } = meta.spreadsheet;

  // 趋势分析表默认只作用一个条件（因为指标挂行头，每列都不一样，直接在回调里判断是否需要染色即可）
  const textCondition = options?.conditions?.text?.[0];
  const iconCondition = options?.conditions?.icon?.[0];

  if (!isArray(textValues)) {
    renderMiniChart(cell, textValues);

    return;
  }

  const widthPercent = options.style?.dataCell?.valuesCfg?.widthPercent;

  let labelHeight = 0;

  // 绘制单元格主标题
  if (text?.label) {
    const dataCellStyle: InternalFullyCellTheme = cell.getStyle(
      CellType.DATA_CELL,
    );
    const labelStyle = dataCellStyle.bolderText;

    labelHeight = totalTextHeight / (textValues.length + 1);

    cell.renderTextShape(
      {
        ...labelStyle,
        x,
        y: y + labelHeight / 2,
        text: text.label,
        maxLines: 1,
        wordWrapWidth: totalTextWidth,
        wordWrap: true,
        textOverflow: 'ellipsis',
      },
      { shallowRender: true },
    );
  }

  // 绘制指标
  const { cellStyle, textStyle } = getDrawStyle(cell);

  const iconStyle = cellStyle?.icon;
  const iconCfg = iconCondition &&
    iconCondition.mapping! && {
      name: '',
      size: iconStyle?.size,
      margin: iconStyle?.margin,
      position: getIconPosition(iconCondition),
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
      curText = measures[j]!;
      const curStyle = useCondition
        ? getCurrentTextStyle({
            rowIndex: i,
            colIndex: j,
            meta,
            data: curText,
            textStyle,
            textCondition,
          })
        : textStyle!;

      const maxTextWidth =
        contentBoxes[i][j].width -
        iconStyle.size -
        (iconCfg?.position === 'left'
          ? iconStyle.margin.right
          : iconStyle.margin.left);

      const groupedIcons: GroupedIcons = {
        left: [],
        right: [],
      };

      if (iconCfg) {
        groupedIcons[iconCfg.position].push(iconCfg);
      }

      cell.renderTextShape(
        {
          ...curStyle,
          x: 0,
          y: 0,
          // 多列文本不换行
          maxLines: 1,
          text: curText,
          wordWrapWidth: maxTextWidth,
        },
        {
          shallowRender: true,
        },
      );

      const actualTextWidth = cell.getActualTextWidth();
      const { textX, leftIconX, rightIconX } = getHorizontalTextIconPosition({
        bbox: contentBoxes[i][j],
        textAlign: curStyle.textAlign!,
        textWidth: actualTextWidth,
        iconStyle,
        groupedIcons,
      });
      const textY = getVerticalTextPosition(
        contentBoxes[i][j],
        curStyle!.textBaseline!,
      );

      cell.updateTextPosition({ x: textX, y: textY });

      // 绘制条件格式的 icon
      if (iconCondition && useCondition) {
        const attrs = iconCondition?.mapping?.(curText, {
          rowIndex: i,
          colIndex: j,
          meta: cell?.getMeta(),
        });

        const iconX = iconCfg?.position === 'left' ? leftIconX : rightIconX;
        const iconY = getVerticalIconPosition(
          iconStyle.size!,
          textY,
          curStyle.fontSize!,
          curStyle.textBaseline!,
        );

        if (attrs) {
          const iconShape = renderIcon(cell, {
            x: iconX,
            y: iconY,
            name: attrs.icon!,
            width: attrs.size ?? iconStyle?.size,
            height: attrs.size ?? iconStyle?.size,
            fill: attrs.fill,
          });

          cell.addConditionIconShape(iconShape);
        }
      }
    }
  }
};

/**
 * 根据 dataCell 配置获取当前单元格宽度
 */
export const getCellWidth = (dataCell: DataCellStyle, labelSize = 1) =>
  dataCell?.width! * labelSize;
