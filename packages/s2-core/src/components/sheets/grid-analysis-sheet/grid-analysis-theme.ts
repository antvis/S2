import { FONT_FAMILY } from '@/common/constant/theme';
import { DefaultCellTheme } from '@/common/interface/theme';

import { isWindows } from '@/utils/is-mobile';

export const FONT_SIZE = 12;
export const FONT_SIZE_MINOR = 11;

/* 交叉表的样式 */
export const GridAnalysisTheme = {
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
      fontWeight: isWindows() ? 'bold' : '520',
      textBaseline: 'middle',
      textAlign: 'left',
    },
  },
} as DefaultCellTheme;
