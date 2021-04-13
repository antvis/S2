import { SpreadSheetTheme } from './interface';
import { isWindows } from '../utils/is-mobile';

const FONT_FAMILY =
  'Roboto, PingFangSC, -apple-system, BlinkMacSystemFont, Microsoft YaHei, Arial, sans-serif';

export const FONT_SIZE = 12;
/* 交叉表的样式 */
export default {
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
      interactiveBgColor: '#F5F7FA',
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
      textAlign: 'right',
    },
    bolderText: {
      fontSize: FONT_SIZE,
      fontFamily: FONT_FAMILY,
      fill: 'rgba(0, 0, 0, 1)',
      fontWeight: isWindows() ? 'bold' : '520',
      textBaseline: 'middle',
      textAlign: 'right',
    },
    cell: {
      borderColor: ['#E8E8E8', 'transparent'],
      borderWidth: [1, 0],
      // crossColor: '#F5F7FA',
      backgroundColor: '#fff',
      backgroundHoverColor: '#F5F7FA',
      interactiveBgColor: '#1890ff',
      interactiveFillOpacity: [0, 0.25],
      padding: [12, 4, 12, 4],
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
    horizontalBorderWidth: 2,
    showCenterRightShadow: false,
    centerRightShadowWidth: 12,
  },
  themeByState: {
    dataCell: {
      selected: {
        backgroundColor: '#d8d8d8',
        hoverBorderColor: '#000000'
      },
      hover: {
        backgroundColor: '#d8d8d8',
      },
      keepHover: {
        backgroundColor: '#d8d8d8',
        hoverBorderColor: '#000000'
      },
      prepareSelect: {
        prepareSelectBorderColor: '#002329',
      },
      hoverLinkage: {
        backgroundColor: '#F3F7FF',
      }
    },
    colCell: {
      hover: {
        backgroundColor: '#b5f5ec',
      },
      colSelected: {
        backgroundColor: '#f759ab',
      },
    },
    rowCell: {
      hover: {
        backgroundColor: '#d4b106',
      },
      rowSelected: {
        backgroundColor: '#f759ab',
      },
    },
  },
} as SpreadSheetTheme;
