import { SpreadSheetTheme } from 'src';
import { isWindows } from 'src/utils/is-mobile';

const FONT_FAMILY =
  'Roboto, PingFangSC, -apple-system, BlinkMacSystemFont, Microsoft YaHei, Arial, sans-serif';

export const FONT_SIZE = 12;
export const FONT_SIZE_MINOR = 11;

/* 交叉表的样式 */
export const TabularTheme = {
  fontFamily: FONT_FAMILY,
  // 表头
  header: {
    cell: {
      borderColor: ['#E8E8E8', '#E8E8E8'],
      borderWidth: [1, 1],
      backgroundColor: '#fff',
      rowBackgroundColor: '#fff',
      colBackgroundColor: '#fff',
      cornerBackgroundColor: '#fff',
      interactiveBgColor: '#ebf2ff',
      interactiveFillOpacity: [0, 1],
      padding: [12, 4, 12, 4],
      textIndent: 12,
    },
    text: {
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMILY,
      fill: 'rgba(0,0,0,1)',
      textBaseline: 'middle',
    },
    bolderText: {
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMILY,
      fill: 'rgba(0,0,0,0.85)',
      fontWeight: isWindows() ? 'bold' : '520',
      textBaseline: 'middle',
    },
    icon: {
      radius: 6,
    },
    seriesNumberWidth: 50,
  },
  // 视窗内
  view: {
    text: {
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMILY,
      fill: 'rgba(0, 0, 0, 0.85)',
      fontWeight: 'normal',
      textBaseline: 'middle',
      textAlign: 'left',
    },
    // 次级文本，如副指标
    minorText: {
      fontSize: FONT_SIZE_MINOR,
      fontFamily: FONT_FAMILY,
      fill: 'rgba(0, 0, 0, 0.45)',
      fontWeight: 'normal',
      textBaseline: 'middle',
      textAlign: 'left',
    },
    // 衍生指标
    derivedMeasureText: {
      mainUp: '#F46649',
      mainDown: '#2AA491',
      minorUp: '#f9ae9e',
      minorDown: '#a9dad2',
    },
    bolderText: {
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMILY,
      fill: 'rgba(0, 0, 0, 1)',
      fontWeight: isWindows() ? 'bold' : '520',
      textBaseline: 'middle',
      textAlign: 'left',
    },
    cell: {
      borderColor: ['#E8E8E8', '#BBBBBB'],
      borderWidth: [1, 1],
      crossColor: '#fff',
      backgroundColor: '#fff',
      backgroundHoverColor: '#ebf2ff',
      interactiveBgColor: '#ebf2ff',
      interactiveFillOpacity: [0, 1],
      padding: [16, 12, 16, 12],
      intervalBgHeight: 12,
    },
  },
  scrollBar: {
    trackColor: 'rgba(0,0,0,0)',
    thumbHoverColor: 'rgba(0,0,0,0.2)',
    thumbColor: 'rgba(0,0,0,0.15)',
    size: 8,
  },
  center: {
    verticalBorderColor: '#BBBBBB',
    verticalBorderWidth: 1,
    horizontalBorderColor: '#BBBBBB',
    horizontalBorderWidth: 1,
    showCenterRightShadow: false,
    centerRightShadowWidth: 0,
  },
} as SpreadSheetTheme;
