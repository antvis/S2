import {
  clone,
  isArray,
  isEmpty,
  isFunction,
  isNil,
  isNumber,
  map,
  size,
  trim,
} from 'lodash';
import type { ColCell } from '../cell';
import {
  CellType,
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
  placeholder?: string | undefined | null,
) => {
  const emptyPlaceholder = placeholder ?? EMPTY_PLACEHOLDER;
  // 对应维度缺少维度数据时, 会使用 EMPTY_FIELD_VALUE 填充, 实际渲染时统一转成 "-"
  const isEmptyText = isNil(text) || text === '' || text === EMPTY_FIELD_VALUE;

  return isEmptyText ? emptyPlaceholder : `${text}`;
};

/**
 * To decide whether the data is positive or negative.
 * Two cases needed to be considered since  the derived value could be number or string.
 * @param value
 */
export const isUpDataValue = (value: SimpleData): boolean => {
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
export const isZeroOrEmptyValue = (value: SimpleData): boolean => {
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
  value: SimpleData,
  compareValue: SimpleData,
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

  const cellStyle = cell.getStyle(cell.cellType || CellType.DATA_CELL);

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
export const drawCustomContent = (
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
 * 根据 dataCell 配置获取当前单元格宽度
 */
export const getCellWidth = (dataCell: DataCellStyle, labelSize = 1) =>
  dataCell?.width! * labelSize;
