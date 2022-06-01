import { FONT_FAMILY, type S2Theme, isWindows } from '@antv/s2';

export const FONT_SIZE = 12;
export const FONT_SIZE_MINOR = 11;

/* 网格分析表主题 */
export const GridAnalysisTheme: S2Theme = {
  // 表头
  dataCell: {
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
      fontWeight: isWindows() ? 'bold' : 520,
      textBaseline: 'middle',
      textAlign: 'left',
    },
  },
};
