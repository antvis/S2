import { SpreadSheetTheme, StyleConfig } from '../common/interface';
import { isWindows } from '../utils/is-mobile';
import { getStyleConfig, calcColorByOpacity } from '../utils/theme';
import { FONT_FAMILY, MINI_BAR_CHART_HEIGHT } from '../common/constant';

/**
 * @describe generate the theme according to the type
 * @param  type
 */
export const getTheme = (type: string) => {
  const styleConfig: StyleConfig = getStyleConfig(type);
  const {
    brandColor,
    neutralColor,
    backgroundColor,
    paletteSemanticRed,
    paletteSemanticGreen,
    fontSize,
    fontOpacity,
    textIndent,
    iconRadius,
    iconSize,
    iconMargin,
    iconpadding,
    borderWidth,
    borderOpacity,
    cellPadding,
  } = styleConfig;

  return {
    rowHeader: {
      cell: {
        horizontalBorderColor: calcColorByOpacity(
          neutralColor,
          borderOpacity.h2,
        ),
        verticalBorderColor: calcColorByOpacity(neutralColor, borderOpacity.h2),
        horizontalBorderWidth: borderWidth.h2,
        verticalBorderWidth: borderWidth.h1,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: calcColorByOpacity(brandColor, 0.32),
        selectedBackgroundColor: calcColorByOpacity(neutralColor, 0.32),
        padding: cellPadding,
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontColor: calcColorByOpacity(neutralColor, fontOpacity.h3),
        fontSize: fontSize.h3,
        textIndent: textIndent,
        textAlign: 'middle',
      },
      bolderText: {
        fontSize: fontSize,
        fontFamily: FONT_FAMILY,
        fill: calcColorByOpacity(neutralColor, borderOpacity.h2),
        fontWeight: isWindows() ? 'bold' : '520',
        textBaseline: 'middle',
      },
      icon: {
        radius: iconRadius,
        size: iconSize.h1,
        margin: iconMargin,
      },
      seriesNumberWidth: 50,
    },
    colHeader: {
      cell: {
        horizontalBorderColor: calcColorByOpacity(
          neutralColor,
          borderOpacity.h2,
        ),
        verticalBorderColor: calcColorByOpacity(neutralColor, borderOpacity.h2),
        horizontalBorderWidth: borderWidth.h1,
        verticalBorderWidth: borderWidth.h2,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: calcColorByOpacity(brandColor, 0.32),
        selectedBackgroundColor: calcColorByOpacity(neutralColor, 0.32),
        padding: cellPadding,
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontColor: calcColorByOpacity(neutralColor, fontOpacity.h2),
        fontSize: fontSize.h2,
        textIndent: textIndent,
        textAlign: 'middle',
      },
      bolderText: {
        fontSize: fontSize.h2,
        fontFamily: FONT_FAMILY,
        fill: calcColorByOpacity(neutralColor, borderOpacity.h2),
        fontWeight: isWindows() ? 'bold' : '520',
        textBaseline: 'middle',
      },
      icon: {
        radius: iconRadius,
        size: iconSize.h1,
        margin: iconMargin,
        padding: iconpadding,
      },
    },
    corner: {
      cell: {
        horizontalBorderColor: calcColorByOpacity(
          neutralColor,
          borderOpacity.h1,
        ),
        verticalBorderColor: calcColorByOpacity(neutralColor, borderOpacity.h1),
        horizontalBorderWidth: borderWidth.h1,
        verticalBorderWidth: borderWidth.h2,
        backgroundColor: backgroundColor,
        padding: cellPadding,
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontColor: calcColorByOpacity(neutralColor, fontOpacity.h2),
        fontSize: fontSize.h2,
        textIndent: textIndent,
        textAlign: 'middle',
      },
      bolderText: {
        fontSize: fontSize.h2,
        fontFamily: FONT_FAMILY,
        fill: calcColorByOpacity(neutralColor, borderOpacity.h2),
        fontWeight: isWindows() ? 'bold' : '520',
        textBaseline: 'middle',
      },
      icon: {
        radius: iconRadius,
        size: iconSize.h1,
        margin: iconMargin,
        padding: iconpadding,
      },
    },
    dataCell: {
      cell: {
        horizontalBorderColor: calcColorByOpacity(
          neutralColor,
          borderOpacity.h2,
        ),
        verticalBorderColor: calcColorByOpacity(neutralColor, borderOpacity.h2),
        horizontalBorderWidth: borderWidth.h2,
        verticalBorderWidth: borderWidth.h2,
        backgroundColor: backgroundColor,
        crossColor: calcColorByOpacity(brandColor, borderOpacity.h2),
        padding: cellPadding,
        selectedBackgroundColor: calcColorByOpacity(brandColor, 0.32),
        selectedBorderColor: calcColorByOpacity(neutralColor, borderOpacity.h2),
        hoverBorderColor: calcColorByOpacity(neutralColor, borderOpacity.h2),
        hoverbBackgroundColor: calcColorByOpacity(brandColor, 0.32),
        prepareSelectBorderColor: calcColorByOpacity(brandColor, 0.32),
        hoverLinkageBackgroundColor: calcColorByOpacity(brandColor, 0.32),
        miniBarChartHeight: MINI_BAR_CHART_HEIGHT,
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontColor: calcColorByOpacity(neutralColor, fontOpacity.h3),
        fontSize: fontSize.h3,
        textAlign: 'right',
        textBaseline: 'middle',
        textIndent: textIndent,
      },
      bolderText: {
        fontSize: fontSize.h3,
        fontFamily: FONT_FAMILY,
        fill: calcColorByOpacity(neutralColor, borderOpacity.h2),
        fontWeight: isWindows() ? 'bold' : '520',
        textBaseline: 'middle',
        textAlign: 'right',
      },
      icon: {
        upIconColor: paletteSemanticGreen,
        downIconColor: paletteSemanticRed,
        radius: iconRadius,
        size: iconSize.h2,
        margin: iconMargin,
        padding: iconpadding,
      },
    },
    scrollBar: {
      trackColor: neutralColor,
      thumbHoverColor: calcColorByOpacity(neutralColor, 0.2),
      thumbColor: calcColorByOpacity(neutralColor, 0.15),
      size: 6,
      hoverSize: 16,
    },
  } as SpreadSheetTheme;
};
