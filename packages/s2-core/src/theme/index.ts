import { FONT_FAMILY, MINI_BAR_CHART_HEIGHT } from '../common/constant';
import { Palette, S2Theme, ThemeCfg } from '../common/interface';
import { SpreadSheet } from '../sheet-type';
import { isMobile, isWindows } from '../utils/is-mobile';
import { getPalette } from '../utils/theme';

/**
 * @describe generate the theme according to the type
 * @param  name
 */
export const getTheme = (
  themeCfg: Omit<ThemeCfg, 'theme'> & { spreadsheet?: SpreadSheet },
): S2Theme => {
  const themePalette: Palette = themeCfg?.palette || getPalette(themeCfg?.name);
  const { basicColors, semanticColors } = themePalette;
  const isTable = themeCfg?.spreadsheet?.isTableMode();

  return {
    // ------------- Headers -------------------
    cornerCell: {
      bolderText: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: isWindows() ? 'bold' : 500,
        fill: basicColors[0],
        opacity: 1,
        textAlign: isTable ? 'center' : 'left',
        textBaseline: 'middle',
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: isWindows() ? 'bold' : 500,
        fill: basicColors[0],
        opacity: 1,
        textAlign: 'right',
        textBaseline: 'middle',
      },
      cell: {
        // ----------- background color -----------
        backgroundColor: basicColors[3],
        backgroundColorOpacity: 1,
        // ----------- border color --------------
        horizontalBorderColor: basicColors[10],
        horizontalBorderColorOpacity: 1,
        verticalBorderColor: basicColors[10],
        verticalBorderColorOpacity: 1,
        // ----------- border width --------------
        horizontalBorderWidth: 1,
        verticalBorderWidth: 1,
        // -------------- layout -----------------
        padding: {
          top: 0,
          right: 8,
          bottom: 0,
          left: 8,
        },
      },
      icon: {
        fill: basicColors[0],
        size: 10,
        margin: {
          right: 4,
          left: 4,
        },
      },
    },
    rowCell: {
      bolderText: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: isWindows() ? 'bold' : 520,
        fill: basicColors[14],
        linkTextFill: basicColors[14],
        opacity: 1,
        textAlign: isTable ? 'center' : 'left',
        textBaseline: 'middle',
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: 'normal',
        fill: basicColors[14],
        linkTextFill: basicColors[6],
        opacity: 1,
        textBaseline: 'middle',
        textAlign: isTable ? 'center' : 'left', // default align center for row cell in table mode
      },
      cell: {
        // ----------- background color -----------
        backgroundColor: basicColors[1],
        backgroundColorOpacity: 1,
        // ----------- bottom border color --------------
        horizontalBorderColor: basicColors[9],
        horizontalBorderColorOpacity: 1,
        verticalBorderColor: basicColors[9],
        verticalBorderColorOpacity: 1,
        // ----------- bottom border width --------------
        horizontalBorderWidth: 1,
        verticalBorderWidth: 1,
        // -------------- layout -----------------
        padding: {
          top: 0,
          right: 10,
          bottom: 0,
          left: 10,
        },
        /* ---------- interaction state ----------- */
        interactionState: {
          // -------------- hover -------------------
          hover: {
            backgroundColor: basicColors[2],
            backgroundOpacity: 0.6,
          },
          // -------------- selected -------------------
          selected: {
            backgroundColor: basicColors[2],
            backgroundOpacity: 0.6,
          },
          // -------------- unselected -------------------
          unselected: {
            backgroundOpacity: 0.3,
            textOpacity: 0.3,
            opacity: 0.3,
          },
        },
      },
      icon: {
        fill: basicColors[0],
        size: 10,
        margin: {
          right: 4,
          left: 4,
        },
      },
      seriesNumberWidth: 80,
    },
    colCell: {
      bolderText: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: isWindows() ? 'bold' : 520,
        fill: basicColors[0],
        opacity: 1,
        textAlign: 'center',
        textBaseline: 'middle',
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: 'normal',
        fill: basicColors[0],
        opacity: 1,
        textAlign: 'center',
        textBaseline: 'middle',
      },
      cell: {
        // ----------- background color -----------
        backgroundColor: basicColors[3],
        backgroundColorOpacity: 1,
        // ----------- border color --------------
        horizontalBorderColor: basicColors[10],
        horizontalBorderColorOpacity: 1,
        verticalBorderColor: basicColors[10],
        verticalBorderColorOpacity: 1,
        // ----------- border width --------------
        horizontalBorderWidth: 1,
        verticalBorderWidth: 1,
        // -------------- layout -----------------
        padding: {
          top: 0,
          right: 8,
          bottom: 0,
          left: 8,
        },
        /* ---------- interaction state ----------- */
        interactionState: {
          // -------------- hover -------------------
          hover: {
            backgroundColor: basicColors[4],
            backgroundOpacity: 0.6,
          },
          // -------------- selected -------------------
          selected: {
            backgroundColor: basicColors[4],
            backgroundOpacity: 0.6,
          },
          // -------------- unselected -------------------
          unselected: {
            backgroundOpacity: 0.3,
            textOpacity: 0.3,
            opacity: 0.3,
          },
        },
      },
      icon: {
        fill: basicColors[0],
        size: 10,
        margin: {
          top: 6,
          right: 4,
          bottom: 6,
          left: 4,
        },
      },
    },
    // ------------- DataCell -------------------
    dataCell: {
      bolderText: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: isWindows() ? 'bold' : 520,
        fill: basicColors[13],
        opacity: 1,
        textAlign: 'right',
        textBaseline: 'middle',
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: 'normal',
        fill: basicColors[13],
        opacity: 1,
        textAlign: 'right',
        textBaseline: 'middle',
      },
      cell: {
        // ----------- background color -----------
        crossBackgroundColor: basicColors[1],
        backgroundColor: basicColors[8],
        backgroundColorOpacity: 1,
        // ----------- border color --------------
        horizontalBorderColor: basicColors[9],
        horizontalBorderColorOpacity: 1,
        verticalBorderColor: basicColors[9],
        verticalBorderColorOpacity: 1,
        // ----------- border width --------------
        horizontalBorderWidth: 1,
        verticalBorderWidth: 1,
        // -------------- layout -----------------
        padding: {
          top: 0,
          right: 8,
          bottom: 0,
          left: 8,
        },
        /* ---------- interaction state ----------- */
        interactionState: {
          // -------------- hover -------------------
          hover: {
            backgroundColor: basicColors[2],
            backgroundOpacity: 0.6,
          },
          // -------------- keep hover -------------------
          hoverFocus: {
            backgroundColor: basicColors[2],
            backgroundOpacity: 0.6,
            borderColor: basicColors[14],
            borderWidth: 1,
            borderOpacity: 1,
          },
          // -------------- selected -------------------
          selected: {
            backgroundColor: basicColors[2],
            backgroundOpacity: 0.6,
          },
          // -------------- unselected -------------------
          unselected: {
            backgroundOpacity: 0.3,
            textOpacity: 0.3,
            opacity: 0.3,
          },
          // -------------- prepare select --------------
          prepareSelect: {
            borderColor: basicColors[14],
            borderOpacity: 1,
            borderWidth: 1,
          },
        },

        // ------------- mini chart ---------------
        miniBarChartHeight: MINI_BAR_CHART_HEIGHT,
        miniBarChartFillColor: basicColors[7],
      },
      icon: {
        fill: basicColors[0],
        downIconColor: semanticColors.red,
        upIconColor: semanticColors.green,
        size: 10,
        margin: {
          right: 4,
          left: 4,
        },
      },
    },
    // resize active area
    resizeArea: {
      size: 3,
      background: basicColors[7],
      backgroundOpacity: 0,
      guideLineColor: basicColors[7],
      guideLineDash: [3, 3],
      /* ---------- interaction state ----------- */
      interactionState: {
        hover: {
          backgroundColor: basicColors[7],
          backgroundOpacity: 1,
        },
      },
    },
    // ------------- scrollBar -------------------
    scrollBar: {
      trackColor: 'rgba(0,0,0,0.01)',
      thumbHoverColor: 'rgba(0,0,0,0.25)',
      thumbColor: 'rgba(0,0,0,0.15)',
      size: isMobile() ? 3 : 6,
      hoverSize: isMobile() ? 4 : 8,
      lineCap: 'round',
    },
    // ------------- split line -----------------
    splitLine: {
      horizontalBorderColor: basicColors[12],
      horizontalBorderColorOpacity: 0.2,
      horizontalBorderWidth: 2,
      verticalBorderColor: basicColors[11],
      verticalBorderColorOpacity: 0.25,
      verticalBorderWidth: 2,
      showShadow: true,
      shadowWidth: 8,
      shadowColors: {
        left: 'rgba(0,0,0,0.1)',
        right: 'rgba(0,0,0,0)',
      },
    },
    // ------------- prepareSelectMask -----------------
    prepareSelectMask: {
      backgroundColor: basicColors[5],
      backgroundOpacity: 0.3,
    },
    // ------------- canvas background
    background: {
      color: basicColors[8],
      opacity: 1,
    },
  };
};
