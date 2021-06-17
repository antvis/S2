import { SpreadSheetTheme, Palette } from '../common/interface';
import { isWindows } from '../utils/is-mobile';
import { getPaletteByType } from '../utils/theme';
import { FONT_FAMILY, MINI_BAR_CHART_HEIGHT } from '../common/constant';

/**
 * @describe generate the theme according to the type
 * @param  type
 */
export const getTheme = (type: string) => {
  const palette: Palette = getPaletteByType(type);
  const { brandColors, grayColors, semanticColors } = palette;

  return {
    // ------------- Header -------------------
    corner: {
      bolderText: {
        fontFamily: FONT_FAMILY,
        fontSize: 14,
        fontWeight: isWindows() ? 'bold' : '520',
        fill: brandColors[0],
        textAlign: 'left',
        textBaseline: 'middle',
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 14,
        fontWeight: 'normal',
        fill: brandColors[0],
        textAlign: 'left',
        textBaseline: 'middle',
        textIndent: 12,
      },
      cell: {
        // ----------- background color -----------
        backgroundColor: brandColors[5],
        hoverBackgroundColor: brandColors[6],
        selectedBackgroundColor: brandColors[6],
        // ----------- border color --------------
        horizontalBorderColor: grayColors[5],
        verticalBorderColor: grayColors[3],
        hoverBorderColor: grayColors[9],
        selectedBorderColor: grayColors[9],
        // ----------- border width --------------
        horizontalBorderWidth: 2,
        verticalBorderWidth: 1,
        hoverBorderWidth: 1,
        selectedBorderWidth: 2,
        // -------------- padding -----------------
        padding: {
          top: 12,
          right: 4,
          bottom: 12,
          left: 4,
        },
      },
      icon: {
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
    colHeader: {
      bolderText: {
        fontFamily: FONT_FAMILY,
        fontSize: 14,
        fontWeight: isWindows() ? 'bold' : '520',
        fill: brandColors[0],
        textAlign: 'middle',
        textBaseline: 'middle',
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 14,
        fontWeight: 'normal',
        fill: brandColors[0],
        textAlign: 'middle',
        textBaseline: 'middle',
        textIndent: 12,
      },
      cell: {
        // ----------- background color -----------
        backgroundColor: brandColors[5],
        hoverBackgroundColor: brandColors[6],
        selectedBackgroundColor: brandColors[6],
        // ----------- border color --------------
        horizontalBorderColor: grayColors[5],
        verticalBorderColor: grayColors[3],
        hoverBorderColor: grayColors[9],
        selectedBorderColor: grayColors[9],
        // ----------- border width --------------
        horizontalBorderWidth: 2,
        verticalBorderWidth: 1,
        hoverBorderWidth: 1,
        selectedBorderWidth: 2,
        // -------------- padding -----------------
        padding: {
          top: 12,
          right: 4,
          bottom: 12,
          left: 4,
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
        textAlign: 'left',
        textBaseline: 'middle',
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: 'normal',
        fill: grayColors[9],
        textAlign: 'left',
        textBaseline: 'middle',
        textIndent: 12,
      },
      cell: {
        // ----------- background color -----------
        backgroundColor: brandColors[0],
        hoverBackgroundColor: brandColors[1],
        selectedBackgroundColor: brandColors[1],
        // ----------- border color --------------
        horizontalBorderColor: grayColors[4],
        verticalBorderColor: grayColors[5],
        hoverBorderColor: grayColors[9],
        selectedBorderColor: grayColors[9],
        // ----------- border width --------------
        horizontalBorderWidth: 1,
        verticalBorderWidth: 2,
        hoverBorderWidth: 1,
        selectedBorderWidth: 2,
        // -------------- padding -----------------
        padding: {
          top: 12,
          right: 4,
          bottom: 12,
          left: 4,
        },
      },
      icon: {
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
      seriesNumberWidth: 50,
    },
    // ------------- DataCell -------------------
    dataCell: {
      bolderText: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: isWindows() ? 'bold' : '520',
        fill: grayColors[8],
        textAlign: 'right',
        textBaseline: 'middle',
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: 'normal',
        fill: grayColors[8],
        textAlign: 'right',
        textBaseline: 'middle',
        textIndent: 12,
      },
      cell: {
        // ----------- background color -----------
        crossColor: brandColors[0],
        backgroundColor: grayColors[0],
        hoverBackgroundColor: brandColors[1],
        hoverLinkageBackgroundColor: brandColors[1],
        selectedBackgroundColor: brandColors[1],
        // ----------- border color --------------
        horizontalBorderColor: grayColors[3],
        verticalBorderColor: grayColors[0],
        hoverBorderColor: grayColors[9],
        selectedBorderColor: grayColors[9],
        prepareSelectBorderColor: brandColors[2],

        // ----------- border width --------------
        horizontalBorderWidth: 1,
        verticalBorderWidth: 2,
        hoverBorderWidth: 1,
        selectedBorderWidth: 2,

        // -------------- padding -----------------
        padding: {
          top: 12,
          right: 4,
          bottom: 12,
          left: 4,
        },
        // ------------- mini chart ---------------
        miniBarChartHeight: MINI_BAR_CHART_HEIGHT,
      },
      icon: {
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
  } as SpreadSheetTheme;
};
