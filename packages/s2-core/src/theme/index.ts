import { SpreadSheetTheme, Palette, ThemeCfg } from '../common/interface';
import { isWindows } from '../utils/is-mobile';
import { getPalette } from '../utils/theme';
import { FONT_FAMILY, MINI_BAR_CHART_HEIGHT } from '../common/constant';

/**
 * @describe generate the theme according to the type
 * @param  name
 */
export const getTheme = (themeCfg: ThemeCfg) => {
  const themePalette: Palette =
    themeCfg?.palette || getPalette(themeCfg?.name, themeCfg?.hueInvert);
  const { brandColors, grayColors, semanticColors } = themePalette;

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
        textAlign: 'left',
      },
      cell: {
        // ----------- background color -----------
        backgroundColor: brandColors[4],
        backgroundColorOpacity: 1,
        hoverBackgroundColor: brandColors[5],
        selectedBackgroundColor: brandColors[5],
        // ----------- border color --------------
        horizontalBorderColor: grayColors[2],
        horizontalBorderColorOpacity: 1,
        verticalBorderColor: grayColors[2],
        verticalBorderColorOpacity: 1,
        hoverBorderColor: grayColors[6],
        selectedBorderColor: grayColors[6],
        // ----------- border width --------------
        horizontalBorderWidth: 1,
        verticalBorderWidth: 1,
        hoverBorderWidth: 0,
        selectedBorderWidth: 1,
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
          right: 4,
          left: 0,
        },
      },
    },
    rowHeader: {
      bolderText: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: isWindows() ? 'bold' : '520',
        fill: grayColors[6],
        opacity: 1,
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: 'normal',
        fill: grayColors[6],
        opacity: 1,
        textAlign: 'right',
      },
      cell: {
        // ----------- background color -----------
        backgroundColor: brandColors[1],
        backgroundColorOpacity: 1,
        hoverBackgroundColor: brandColors[2],
        selectedBackgroundColor: brandColors[2],
        // ----------- bottom border color --------------
        horizontalBorderColor: grayColors[1],
        horizontalBorderColorOpacity: 1,
        verticalBorderColor: grayColors[1],
        verticalBorderColorOpacity: 1,
        hoverBorderColor: grayColors[6],
        selectedBorderColor: grayColors[6],
        // ----------- bottom border width --------------
        horizontalBorderWidth: 1,
        verticalBorderWidth: 0,
        hoverBorderWidth: 0,
        selectedBorderWidth: 1,
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
          right: 4,
          left: 0,
        },
      },
      seriesNumberWidth: 80,
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
      },
      cell: {
        // ----------- background color -----------
        backgroundColor: brandColors[4],
        backgroundColorOpacity: 1,
        hoverBackgroundColor: brandColors[5],
        selectedBackgroundColor: brandColors[5],
        // ----------- border color --------------
        horizontalBorderColor: grayColors[2],
        horizontalBorderColorOpacity: 1,
        verticalBorderColor: grayColors[2],
        verticalBorderColorOpacity: 1,
        hoverBorderColor: grayColors[6],
        selectedBorderColor: grayColors[6],
        // ----------- border width --------------
        horizontalBorderWidth: 1,
        verticalBorderWidth: 1,
        hoverBorderWidth: 0,
        selectedBorderWidth: 1,
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
          right: 4,
          left: 0,
        },
      },
    },
    // ------------- DataCell -------------------
    dataCell: {
      bolderText: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: isWindows() ? 'bold' : '520',
        fill: grayColors[5],
        opacity: 1,
        textAlign: 'right',
        textBaseline: 'middle',
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: 'normal',
        fill: grayColors[5],
        opacity: 1,
        textAlign: 'right',
        textBaseline: 'middle',
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
        horizontalBorderColor: grayColors[1],
        horizontalBorderColorOpacity: 1,
        verticalBorderColor: grayColors[1],
        verticalBorderColorOpacity: 1,
        hoverBorderColor: grayColors[6],
        selectedBorderColor: grayColors[6],
        prepareSelectBorderColor: brandColors[3],
        // ----------- border width --------------
        horizontalBorderWidth: 1,
        verticalBorderWidth: 0,
        hoverBorderWidth: 0,
        selectedBorderWidth: 1,
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
        downIconColor: semanticColors.red,
        upIconColor: semanticColors.green,
        radius: 4,
        size: 10,
        margin: {
          right: 4,
          left: 0,
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
      horizontalBorderColor: grayColors[4],
      horizontalBorderColorOpacity: 1,
      horizontalBorderWidth: 2,
      verticalBorderColor: grayColors[3],
      verticalBorderColorOpacity: 1,
      verticalBorderWidth: 2,
      showRightShadow: true,
      shadowWidth: 8,
      shadowColors: {
        left: 'rgba(0,0,0,0.04)',
        right: 'rgba(0,0,0,0)',
      },
    },
  } as SpreadSheetTheme;
};

export const TABLE_THEME_FALLBACK = {
  corner: {
    bolderText: {
      textAlign: 'center',
    },
  },
};
