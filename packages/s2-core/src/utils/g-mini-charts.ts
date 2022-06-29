/**
 * 基于 g 绘制简单 mini 图工具库
 * https://github.com/antvis/g
 */

import { get, isEmpty, map, max } from 'lodash';
import type {
  BaseChartData,
  BulletValue,
  MiniChartData,
  S2CellType,
} from '../common/interface';
import type { RangeColors } from '../common/interface/theme';
import {
  renderCircle,
  renderPolyline,
  renderLine,
  renderRect,
  renderText,
} from '../utils/g-renders';
import { CellTypes, MiniChartTypes } from '../common/constant';
import { getEllipsisText } from './text';

/**
 *  坐标转换
 */
export const scale = (chartData: BaseChartData, cell: S2CellType) => {
  const { data, encode, type } = chartData;
  const { x, y, height, width } = cell.getMeta();
  const dataCellStyle = cell.getStyle(CellTypes.DATA_CELL);
  const { cell: cellStyle, miniChart } = dataCellStyle;
  const measures = [];
  const encodedData = map(data, (item) => {
    measures.push(item?.[encode.y]);
    return {
      x: item[encode.x],
      y: item[encode.y],
    };
  });

  const maxMeasure = max(measures);

  const xStart = x + cellStyle.padding.left;
  const xEnd = x + width - cellStyle.padding.right;
  const yStart = y + cellStyle.padding.top;
  const yEnd = y + height - cellStyle.padding.bottom;

  const intervalX =
    type === MiniChartTypes.Bar
      ? (xEnd -
          xStart -
          (measures.length - 1) * miniChart?.bar?.intervalPadding) /
          measures.length +
        miniChart?.bar?.intervalPadding
      : (xEnd - xStart) / (measures.length - 1) ?? 0;

  const points = map(encodedData, (item: { x: number; y: number }, key) => {
    const positionX = xStart + key * intervalX;
    const positionY = yEnd - (item?.y / maxMeasure) * (yEnd - yStart);
    return [positionX, positionY];
  });
  return {
    range: {
      xStart,
      xEnd,
      yStart,
      yEnd,
    },
    points,
    intervalX,
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

  const dataCellStyle = cell.getStyle(CellTypes.DATA_CELL);
  const { miniChart } = dataCellStyle;
  const { point, linkLine } = miniChart.line;

  const { points } = scale(chartData, cell);

  renderPolyline(cell, {
    points,
    stroke: linkLine.fill,
    lineWidth: linkLine.size,
    opacity: linkLine.opacity,
  });

  for (let i = 0; i < points.length; i++) {
    renderCircle(cell, {
      x: points[i][0],
      y: points[i][1],
      r: point.size,
      fill: point.fill,
      fillOpacity: point.opacity,
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

  const dataCellStyle = cell.getStyle(CellTypes.DATA_CELL);
  const { miniChart } = dataCellStyle;
  const { bar } = miniChart;

  const { points, range, intervalX } = scale(chartData, cell);

  for (let i = 0; i < points.length; i++) {
    renderRect(cell, {
      x: points[i][0],
      y: points[i][1],
      width: intervalX - bar.intervalPadding,
      height: range.yEnd - points[i][1],
      fill: bar.fill, // TODO 支持色板配置
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
  fractionDigits = 0,
) => {
  const value = Number(ratio);
  if (Number.isNaN(value)) {
    return ratio;
  }
  return `${(value * 100).toFixed(fractionDigits)}%`;
};

/**
 *  绘制单元格内的 mini子弹图
 */
export const drawBullet = (value: BulletValue, cell: S2CellType) => {
  if (isEmpty(value)) {
    return;
  }
  const dataCellStyle = cell.getStyle(CellTypes.DATA_CELL);
  const bulletStyle = dataCellStyle.miniChart.bullet;
  const { x, y, height, width } = cell.getMeta();
  const { progressBar, comparativeMeasure, rangeColors, backgroundColor } =
    bulletStyle;
  const bulletWidth = progressBar.widthPercent * width;
  const measureWidth = width - bulletWidth;

  const padding = dataCellStyle.cell.padding;
  const { measure, target } = value;

  // TODO 先支持默认右对齐
  // 绘制子弹图
  // 1. 背景
  const positionX = x + width - padding.right - bulletWidth;
  const positionY = y + height / 2 - progressBar.height / 2;
  renderRect(cell, {
    x: positionX,
    y: positionY,
    width: bulletWidth,
    height: progressBar.height,
    fill: backgroundColor,
    textBaseline: dataCellStyle.text.textBaseline,
  });

  // 2. 进度条
  const getRangeColor = get(
    cell.getMeta(),
    'spreadsheet.options.bullet.getRangeColor',
  );
  renderRect(cell, {
    x: positionX,
    y: positionY + (progressBar.height - progressBar.innerHeight) / 2,
    width: Math.min(bulletWidth * Number(measure), bulletWidth),
    height: progressBar.innerHeight,
    fill:
      getRangeColor?.(measure, target) ??
      getBulletRangeColor(measure, target, rangeColors),
  });

  // 3.测量标记线
  const lineX = positionX + bulletWidth * Number(target);
  renderLine(
    cell,
    {
      x1: lineX,
      y1: y + (height - comparativeMeasure.height) / 2,
      x2: lineX,
      y2:
        y +
        (height - comparativeMeasure.height) / 2 +
        comparativeMeasure.height,
    },
    {
      stroke: comparativeMeasure.color,
      lineWidth: comparativeMeasure.width,
      opacity: comparativeMeasure?.opacity,
    },
  );

  const measurePercent = transformRatioToPercent(measure);

  // 绘制指标
  renderText(
    cell,
    [],
    positionX - padding.right,
    y + height / 2,
    getEllipsisText({
      text: measurePercent,
      maxWidth: measureWidth,
      fontParam: dataCellStyle.text,
    }),
    dataCellStyle.text,
  );
};

export const renderChart = (data: MiniChartData, cell: S2CellType) => {
  switch (data?.type) {
    case MiniChartTypes.Line:
      drawLine(data, cell);
      break;
    case MiniChartTypes.Bar:
      drawBar(data, cell);
      break;
    default:
      drawBullet(data as BulletValue, cell);
      break;
  }
};
