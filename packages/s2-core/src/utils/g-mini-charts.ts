/**
 * 基于 g 绘制简单 mini 图工具库
 * https://github.com/antvis/g
 */

import { isEmpty, isNil, map, max, min } from 'lodash';
import type { DataCell } from '..';
import { CellType, MiniChartType } from '../common/constant';
import {
  CellClipBox,
  type BaseChartData,
  type BulletValue,
  type MiniChartData,
  type S2CellType,
} from '../common/interface';
import type {
  DefaultCellTheme,
  InternalFullyCellTheme,
  RangeColors,
} from '../common/interface/theme';
import { getIntervalScale } from '../utils/condition/condition';
import { parseNumberWithPrecision } from '../utils/formatter';
import {
  renderCircle,
  renderLine,
  renderPolyline,
  renderRect,
} from '../utils/g-renders';

interface FractionDigitsOptions {
  min: number;
  max: number;
}

/**
 *  坐标转换
 */
export const scale = (chartData: BaseChartData, cell: S2CellType) => {
  const { data, encode, type } = chartData;
  const { x, y, height, width } = cell.getMeta();
  const dataCellStyle = cell.getStyle(CellType.DATA_CELL) as DefaultCellTheme;
  const { cell: cellStyle, miniChart } = dataCellStyle;
  const measures: number[] = [];
  const encodedData = map(data, (item) => {
    measures.push(item?.[encode!.y] as number);

    return {
      x: item[encode!.x],
      y: item[encode!.y],
    };
  });
  const maxMeasure = max(measures) || 0;
  const minMeasure = min(measures) || 0;
  let measureRange = maxMeasure - minMeasure;

  const { left = 0, right = 0, top = 0, bottom = 0 } = cellStyle!.padding!;
  const xStart = x + left;
  const xEnd = x + width - right;
  const yStart = y + top;
  const yEnd = y + height - bottom;

  const heightRange = yEnd - yStart;
  const intervalPadding = miniChart?.bar?.intervalPadding!;

  const intervalX =
    type === MiniChartType.Bar
      ? (xEnd - xStart - (measures.length - 1) * intervalPadding) /
          measures.length +
        intervalPadding
      : (xEnd - xStart) / (measures.length - 1) ?? 0;

  const box: number[][] = [];
  const points = map(
    encodedData,
    (item: { x: number; y: number }, key: number) => {
      const positionX: number = xStart + key * intervalX;
      let positionY: number;

      if (measureRange !== 0) {
        positionY =
          yEnd - ((item?.y - minMeasure) / measureRange) * heightRange;
      } else {
        positionY = minMeasure > 0 ? yStart : yEnd;
      }

      if (type === MiniChartType.Bar) {
        let baseLinePositionY: number;
        let barHeight: number;

        if (minMeasure < 0 && maxMeasure > 0 && measureRange !== 0) {
          // 基准线（0 坐标）在中间
          baseLinePositionY =
            yEnd - ((0 - minMeasure) / measureRange) * heightRange;
          barHeight = Math.abs(positionY - baseLinePositionY);
          if (item?.y < 0) {
            // 如果值小于 0 需要从基准线为起始 y 坐标开始绘制
            positionY = baseLinePositionY;
          }
        } else {
          baseLinePositionY = minMeasure < 0 ? yStart : yEnd;
          measureRange = max([Math.abs(maxMeasure), Math.abs(minMeasure)])!;
          barHeight =
            measureRange === 0
              ? heightRange
              : (Math.abs(item?.y - 0) / measureRange) * heightRange;
          positionY = baseLinePositionY;
        }

        const barWidth = intervalX - intervalPadding;

        box.push([barWidth, barHeight]);
      }

      return [positionX, positionY];
    },
  ) as unknown as [number, number][];

  return {
    points,
    box,
  };
};

// ========================= mini 折线相关 ==============================

/**
 *  绘制单元格内的 mini 折线图
 */
export const drawLine = (chartData: BaseChartData, cell: S2CellType) => {
  if (isEmpty(chartData?.data) || isEmpty(cell)) {
    return;
  }

  const dataCellStyle = cell.getStyle(CellType.DATA_CELL) as DefaultCellTheme;
  const { miniChart } = dataCellStyle;
  const { point, linkLine } = miniChart?.line!;

  const { points } = scale(chartData, cell);

  renderPolyline(cell, {
    points,
    stroke: linkLine?.fill,
    lineWidth: linkLine?.size,
    opacity: linkLine?.opacity,
  });

  for (let i = 0; i < points.length; i++) {
    renderCircle(cell, {
      cx: points[i][0],
      cy: points[i][1],
      r: point!.size,
      fill: point!.fill,
      fillOpacity: point?.opacity,
    });
  }
};

// ========================= mini 柱状图相关 ==============================

/**
 *  绘制单元格内的 mini 柱状图
 */
export const drawBar = (chartData: BaseChartData, cell: S2CellType) => {
  if (isEmpty(chartData?.data) || isEmpty(cell)) {
    return;
  }

  const dataCellStyle = cell.getStyle(CellType.DATA_CELL);
  const { miniChart } = dataCellStyle;
  const { bar } = miniChart;

  const { points, box } = scale(chartData, cell);

  for (let i = 0; i < points.length; i++) {
    renderRect(cell, {
      x: points[i][0],
      y: points[i][1],
      width: box[i][0],
      height: box[i][1],
      fill: bar.fill,
      fillOpacity: bar.opacity,
    });
  }
};

// ======================== mini 子弹图相关 ==============================

/**
 * 根据当前值和目标值获取子弹图填充色
 */
export const getBulletRangeColor = (
  measure: number | string,
  target: number | string,
  rangeColors: RangeColors,
) => {
  const delta = Number(target) - Number(measure);

  if (Number.isNaN(delta) || Number(measure) < 0) {
    return rangeColors.bad;
  }

  if (delta <= 0.1) {
    return rangeColors.good;
  }

  if (delta > 0.1 && delta <= 0.2) {
    return rangeColors.satisfactory;
  }

  return rangeColors.bad;
};

// 比率转百分比, 简单解决计算精度问题
export const transformRatioToPercent = (
  ratio: number | string,
  fractionDigits: FractionDigitsOptions | number = { min: 0, max: 0 },
) => {
  const value = Number(ratio);

  if (Number.isNaN(value)) {
    return ratio;
  }

  const minimumFractionDigits =
    (fractionDigits as FractionDigitsOptions)?.min ??
    (fractionDigits as number);
  const maximumFractionDigits =
    (fractionDigits as FractionDigitsOptions)?.max ??
    (fractionDigits as number);

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
    // 禁用自动分组: "12220%" => "12,220%"
    useGrouping: false,
    style: 'percent',
  });

  return formatter.format(value);
};

// ========================= 条件格式柱图相关 ==============================

/**
 * 绘制单元格内的 条件格式 柱图
 */
export const drawInterval = (cell: DataCell) => {
  if (isEmpty(cell)) {
    return;
  }

  const { x, y, height, width } = cell.getBBoxByType(CellClipBox.PADDING_BOX);

  const intervalCondition = cell.findFieldCondition(
    cell.cellConditions?.interval!,
  );

  if (intervalCondition?.mapping!) {
    const attrs = cell.mappingValue(intervalCondition);

    if (!attrs) {
      return;
    }

    const valueRange = attrs.isCompare ? attrs : cell.valueRangeByField;

    const minValue = parseNumberWithPrecision(valueRange.minValue!);
    const maxValue = parseNumberWithPrecision(valueRange.maxValue!);

    const fieldValue = isNil(attrs?.fieldValue)
      ? parseNumberWithPrecision(cell.getMeta().fieldValue as number)
      : parseNumberWithPrecision(attrs?.fieldValue);

    // 对于超出设定范围的值不予显示
    if (fieldValue < minValue || fieldValue > maxValue) {
      return;
    }

    const cellStyle = cell.getStyle();

    const barChartHeight = cellStyle?.miniChart?.interval?.height;
    const barChartFillColor = cellStyle?.miniChart?.interval?.fill;

    const getScale = getIntervalScale(minValue, maxValue);
    const { zeroScale, scale: intervalScale } = getScale(fieldValue);

    const fill = attrs.fill ?? barChartFillColor;

    return renderRect(cell, {
      x: x + width * zeroScale,
      y: y + height / 2 - barChartHeight! / 2,
      width: width * intervalScale,
      height: barChartHeight!,
      fill,
    });
  }
};

/**
 * 绘制单元格内的 mini 子弹图
 */
export const drawBullet = (value: BulletValue, cell: S2CellType) => {
  const dataCellStyle: InternalFullyCellTheme = cell.getStyle(
    CellType.DATA_CELL,
  );
  const { x, y, height, width } = cell.getMeta();

  if (isEmpty(value)) {
    cell.renderTextShape({
      ...dataCellStyle.text,
      x: x + width - dataCellStyle.cell.padding.right,
      y: y + height / 2,
      text: '',
    });

    return;
  }

  const bulletStyle = dataCellStyle.miniChart.bullet;
  const { progressBar, comparativeMeasure, rangeColors, backgroundColor } =
    bulletStyle;

  const { measure, target } = value;

  const displayMeasure = Math.max(Number(measure), 0);
  const displayTarget = Math.max(Number(target), 0);

  /*
   * 原本是 "0%", 需要精确到浮点数后两位, 保证数值很小时能正常显示, 显示的百分比格式为 "0.22%"
   * 所以子弹图需要为数值预留宽度
   * 对于负数, 进度条计算按照 0 处理, 但是展示还是要显示原来的百分比
   */
  const measurePercent = transformRatioToPercent(measure, 2);
  const widthPercent =
    progressBar?.widthPercent > 1
      ? progressBar?.widthPercent / 100
      : progressBar?.widthPercent;

  const padding = dataCellStyle.cell.padding;
  const contentWidth = width - padding.left - padding.right;

  // 子弹图先占位 (bulletWidth)，剩下空间给文字 (measureWidth)
  const bulletWidth = widthPercent * contentWidth;
  const measureWidth = contentWidth - bulletWidth;

  /**
   * 绘制子弹图 (右对齐)
   * 1. 背景
   */
  const positionX = x + width - padding.right - bulletWidth;
  const positionY = y + height / 2 - progressBar.height / 2;

  renderRect(cell, {
    x: positionX,
    y: positionY,
    width: bulletWidth,
    height: progressBar.height,
    fill: backgroundColor,
  });

  // 2. 进度条
  const displayBulletWidth = Math.max(
    Math.min(bulletWidth * displayMeasure, bulletWidth),
    0,
  );

  renderRect(cell, {
    x: positionX,
    y: positionY + (progressBar.height - progressBar.innerHeight) / 2,
    width: displayBulletWidth,
    height: progressBar.innerHeight,
    fill: getBulletRangeColor(displayMeasure, displayTarget, rangeColors),
  });

  // 3.测量标记线
  const lineX = positionX + bulletWidth * displayTarget;

  renderLine(cell, {
    x1: lineX,
    y1: y + (height - comparativeMeasure.height) / 2,
    x2: lineX,
    y2:
      y + (height - comparativeMeasure.height) / 2 + comparativeMeasure.height,
    stroke: comparativeMeasure?.fill,
    lineWidth: comparativeMeasure.width,
    opacity: comparativeMeasure?.opacity,
  });

  // 4.绘制指标
  const maxTextWidth = measureWidth - padding.right;

  cell.renderTextShape({
    ...dataCellStyle.text,
    x: positionX - padding.right,
    y: y + height / 2,
    text: measurePercent,
    wordWrapWidth: maxTextWidth,
  });
};

export const renderMiniChart = (cell: S2CellType, data?: MiniChartData) => {
  switch (data?.type) {
    case MiniChartType.Line:
      drawLine(data, cell);
      break;
    case MiniChartType.Bar:
      drawBar(data, cell);
      break;
    default:
      drawBullet(data as BulletValue, cell);
      break;
  }
};
