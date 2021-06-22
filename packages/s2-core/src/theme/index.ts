import { SpreadSheetTheme, Palette } from '../common/interface';
import { isWindows } from '../utils/is-mobile';
import { getPalette } from '../utils/theme';
import { FONT_FAMILY, MINI_BAR_CHART_HEIGHT } from '../common/constant';

/**
 * @describe generate the theme according to the type
 * @param  type
 */
export const getTheme = (type: string, hueInvert?: boolean) => {
  const palette: Palette = getPalette(type, hueInvert);
  const { brandColors, grayColors, semanticColors } = palette;

  return {
    // ------------- Header -------------------
    corner: {
      bolderText: {
        fontFamily: FONT_FAMILY,
        fontSize: 14,
        fontWeight: isWindows() ? 'bold' : '520',
        fill: brandColors[0],
        opacity: 1,
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 14,
        fontWeight: 'normal',
        fill: brandColors[0],
        opacity: 1,
        textIndent: 12,
        textAlign: 'left',
        textBaseline: 'middle',
      },
      cell: {
        // ----------- background color -----------
        backgroundColor: brandColors[6],
        backgroundColorOpacity: 1,
        hoverBackgroundColor: brandColors[7],
        selectedBackgroundColor: brandColors[7],
        // ----------- border color --------------
        horizontalBorderColor: grayColors[3],
        horizontalBorderColorOpacity: 1,
        verticalBorderColor: grayColors[3],
        verticalBorderColorOpacity: 1,
        hoverBorderColor: grayColors[9],
        selectedBorderColor: grayColors[9],
        // ----------- border width --------------
        horizontalBorderWidth: 1,
        verticalBorderWidth: 1,
        hoverBorderWidth: 1,
        selectedBorderWidth: 2,
        // -------------- layout -----------------
        padding: {
          top: 12,
          right: 8,
          bottom: 12,
          left: 8,
        },
      },
      icon: {
        fill: brandColors[0],
        radius: 4,
        size: 14,
        margin: {
          top: 0,
          right: 8,
          bottom: 0,
          left: 0,
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
    colHeader: {
      bolderText: {
        fontFamily: FONT_FAMILY,
        fontSize: 14,
        fontWeight: isWindows() ? 'bold' : '520',
        fill: brandColors[0],
        opacity: 1,
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 14,
        fontWeight: 'normal',
        fill: brandColors[0],
        opacity: 1,
        textAlign: 'center',
        textBaseline: 'middle',
        textIndent: 12,
      },
      cell: {
        // ----------- background color -----------
        backgroundColor: brandColors[6],
        backgroundColorOpacity: 1,
        hoverBackgroundColor: brandColors[7],
        selectedBackgroundColor: brandColors[7],
        // ----------- border color --------------
        horizontalBorderColor: grayColors[3],
        horizontalBorderColorOpacity: 1,
        verticalBorderColor: grayColors[3],
        verticalBorderColorOpacity: 1,
        hoverBorderColor: grayColors[9],
        selectedBorderColor: grayColors[9],
        // ----------- border width --------------
        horizontalBorderWidth: 1,
        verticalBorderWidth: 1,
        hoverBorderWidth: 1,
        selectedBorderWidth: 2,
        // -------------- layout -----------------
        padding: {
          top: 12,
          right: 8,
          bottom: 12,
          left: 8,
        },
      },
      icon: {
        downIconColor: semanticColors.red,
        upIconColor: semanticColors.green,
        radius: 4,
        size: 14,
        margin: {
          top: 4,
          right: 4,
          bottom: 4,
          left: 4,
        },
        padding: {
          top: 2,
          right: 2,
          bottom: 2,
          left: 2,
        },
      },
    },
    rowHeader: {
      bolderText: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: isWindows() ? 'bold' : '520',
        fill: grayColors[9],
        opacity: '1',
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: 'normal',
        fill: grayColors[9],
        opacity: '1',
        textAlign: 'left',
        textBaseline: 'middle',
        textIndent: 12,
      },
      cell: {
        // ----------- background color -----------
        backgroundColor: brandColors[6],
        backgroundColorOpacity: 1,
        hoverBackgroundColor: brandColors[2],
        selectedBackgroundColor: brandColors[2],
        // ----------- border color --------------
        horizontalBorderColor: grayColors[3],
        horizontalBorderColorOpacity: 1,
        verticalBorderColor: grayColors[3],
        verticalBorderColorOpacity: 1,
        hoverBorderColor: grayColors[9],
        selectedBorderColor: grayColors[9],
        // ----------- border width --------------
        horizontalBorderWidth: 1,
        verticalBorderWidth: 0,
        hoverBorderWidth: 1,
        selectedBorderWidth: 2,
        // -------------- layout -----------------
        padding: {
          top: 12,
          right: 8,
          bottom: 12,
          left: 8,
        },
      },
      icon: {
        fill: brandColors[0],
        radius: 4,
        size: 14,
        margin: {
          top: 4,
          right: 4,
          bottom: 4,
          left: 4,
        },
        padding: {
          top: 2,
          right: 2,
          bottom: 2,
          left: 2,
        },
      },
      seriesNumberWidth: 80,
    },
    // ------------- DataCell -------------------
    dataCell: {
      bolderText: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: isWindows() ? 'bold' : '520',
        fill: grayColors[8],
        opacity: 1,
        textAlign: 'right',
        textBaseline: 'middle',
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: 'normal',
        fill: grayColors[8],
        opacity: 1,
        textAlign: 'right',
        textBaseline: 'middle',
        textIndent: 12,
      },
      cell: {
        // ----------- background color -----------
        crossBackgroundColor: brandColors[1],
        backgroundColor: grayColors[0],
        backgroundColorOpacity: 1,
        hoverBackgroundColor: brandColors[2],
        hoverLinkageBackgroundColor: brandColors[2],
        selectedBackgroundColor: brandColors[2],
        // ----------- border color --------------
        horizontalBorderColor: grayColors[3],
        horizontalBorderColorOpacity: 0,
        verticalBorderColor: grayColors[3],
        verticalBorderColorOpacity: 1,
        hoverBorderColor: grayColors[9],
        selectedBorderColor: grayColors[9],
        prepareSelectBorderColor: brandColors[3],
        // ----------- border width --------------
        horizontalBorderWidth: 1,
        verticalBorderWidth: 0,
        hoverBorderWidth: 1,
        selectedBorderWidth: 2,
        // -------------- layout -----------------
        padding: {
          top: 12,
          right: 8,
          bottom: 12,
          left: 8,
        },
        // ------------- mini chart ---------------
        miniBarChartHeight: MINI_BAR_CHART_HEIGHT,
      },
      icon: {
        fill: brandColors[0],
        radius: 4,
        size: 10,
        margin: {
          top: 4,
          right: 4,
          bottom: 4,
          left: 4,
        },
        padding: {
          top: 2,
          right: 2,
          bottom: 2,
          left: 2,
        },
      },
    },
    // ------------- scrollBar -------------------
    scrollBar: {
      trackColor: 'rgba(0,0,0,0)',
      thumbHoverColor: 'rgba(0,0,0,0.2)',
      thumbColor: 'rgba(0,0,0,0.15)',
      size: 6,
      hoverSize: 16,
    },
    // ------------- split line -----------------
    splitLine: {
      horizontalBorderColor: grayColors[5],
      horizontalBorderColorOpacity: 1,
      horizontalBorderWidth: 1,
      verticalBorderColor: grayColors[5],
      verticalBorderColorOpacity: 1,
      verticalBorderWidth: 2,
      showRightShadow: true,
      shadowWidth: 8,
      shadowColors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.04)'],
    },
  } as SpreadSheetTheme;
};
