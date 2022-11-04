import { FONT_FAMILY, INTERVAL_BAR_HEIGHT } from '../common/constant';
import type { DefaultCellTheme, S2Theme, ThemeCfg } from '../common/interface';
import type { SpreadSheet } from '../sheet-type';
import { isMobile, isWindows } from '../utils/is-mobile';
import { getPalette } from '../utils/theme';

/**
 * @describe generate the theme according to the type
 * @param themeCfg
 */
export const getTheme = (
  themeCfg: Omit<ThemeCfg, 'theme'> & { spreadsheet?: SpreadSheet },
): S2Theme => {
  const {
    basicColors,
    semanticColors,
    others: otherColors,
  } = themeCfg?.palette || getPalette(themeCfg?.name);

  const isTable = themeCfg?.spreadsheet?.isTableMode();
  const boldTextDefaultFontWeight = isWindows() ? 'bold' : 700;

  const getDataCell = () =>
    ({
      bolderText: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: boldTextDefaultFontWeight,
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
          top: 8,
          right: 8,
          bottom: 8,
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
          // -------------- searchResult -------------------
          searchResult: {
            backgroundColor: otherColors?.results ?? basicColors[2],
            backgroundOpacity: 1,
          },
          // -------------- highlight -------------------
          highlight: {
            backgroundColor: otherColors?.highlight ?? basicColors[6],
            backgroundOpacity: 1,
          },
          // -------------- prepare select --------------
          prepareSelect: {
            borderColor: basicColors[14],
            borderOpacity: 1,
            borderWidth: 1,
          },
        },
      },
      // ------------- mini chart ---------------
      miniChart: {
        // ------------- line graph -----------------
        line: {
          point: {
            size: 2.2,
            fill: basicColors[6],
            opacity: 1,
          },
          linkLine: {
            size: 1.5,
            fill: basicColors[6],
            opacity: 0.6,
          },
        },
        // ------------- bar graph -----------------
        bar: {
          intervalPadding: 4,
          fill: basicColors[6],
          opacity: 1,
        },
        // ------------- bullet graph -----------------
        bullet: {
          progressBar: {
            widthPercent: 0.6,
            height: 10,
            innerHeight: 6,
          },
          comparativeMeasure: {
            width: 1,
            height: 12,
            fill: basicColors[13],
            opacity: 0.25,
          },
          rangeColors: {
            good: semanticColors?.green,
            satisfactory: semanticColors.yellow,
            bad: semanticColors.red,
          },
          backgroundColor: '#E9E9E9',
        },
        // ------------ interval bar graph -----------------
        interval: {
          height: INTERVAL_BAR_HEIGHT,
          fill: basicColors[7],
        },
      },
      icon: {
        fill: basicColors[13],
        downIconColor: semanticColors.red,
        upIconColor: semanticColors.green,
        size: 10,
        margin: {
          right: 4,
          left: 4,
        },
      },
    } as DefaultCellTheme);

  return {
    // ------------- Headers -------------------
    cornerCell: {
      bolderText: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: boldTextDefaultFontWeight,
        fill: basicColors[0],
        opacity: 1,
        textAlign: isTable ? 'center' : 'left',
        textBaseline: 'middle',
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: boldTextDefaultFontWeight,
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
      seriesText: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: 'normal',
        fill: basicColors[14],
        linkTextFill: basicColors[6],
        opacity: 1,
        textBaseline: 'middle',
        textAlign: 'center',
      },
      measureText: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: 'normal',
        fill: basicColors[14],
        linkTextFill: basicColors[6],
        opacity: 1,
        textAlign: isTable ? 'center' : 'left',
        textBaseline: 'top',
      },
      bolderText: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: boldTextDefaultFontWeight,
        fill: basicColors[14],
        linkTextFill: basicColors[6],
        opacity: 1,
        textAlign: isTable ? 'center' : 'left',
        textBaseline: 'top',
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: 'normal',
        fill: basicColors[14],
        linkTextFill: basicColors[6],
        opacity: 1,
        textBaseline: 'top',
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
          // -------------- searchResult -------------------
          searchResult: {
            backgroundColor: otherColors?.results ?? basicColors[2],
            backgroundOpacity: 1,
          },
          // -------------- highlight -------------------
          highlight: {
            backgroundColor: otherColors?.highlight ?? basicColors[6],
            backgroundOpacity: 1,
          },
        },
      },
      icon: {
        fill: basicColors[14],
        size: 10,
        margin: {
          right: 4,
          left: 4,
        },
      },
      seriesNumberWidth: 80,
    },
    colCell: {
      measureText: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: 'normal',
        fill: basicColors[0],
        opacity: 1,
        // 默认数值字段和 dataCell 数值对齐
        textAlign: 'right',
        textBaseline: 'middle',
      },
      bolderText: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: boldTextDefaultFontWeight,
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
          // -------------- prepare select --------------
          prepareSelect: {
            borderColor: basicColors[14],
            borderOpacity: 1,
            borderWidth: 1,
          },
          // -------------- searchResult -------------------
          searchResult: {
            backgroundColor: otherColors?.results ?? basicColors[2],
            backgroundOpacity: 1,
          },
          // -------------- highlight -------------------
          highlight: {
            backgroundColor: otherColors?.highlight ?? basicColors[6],
            backgroundOpacity: 1,
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
    dataCell: getDataCell(),
    // ------------- MergedCell -------------------
    mergedCell: getDataCell(),
    // resize active area
    resizeArea: {
      size: 3,
      background: basicColors[7],
      backgroundOpacity: 0,
      guideLineColor: basicColors[7],
      guideLineDisableColor: 'rgba(0,0,0,0.25)',
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
