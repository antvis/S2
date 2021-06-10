import { SpreadSheetTheme, StyleConfig } from '../common/interface';
import { isWindows } from '../utils/is-mobile';
import { getStyleConfig, calcColorByOpacity } from '../utils/theme';
import { FONT_FAMILY } from '../common/constant';

/**
 * @describe generate the theme according to the type
 * @param  type
 */
export const getTheme = (type: string) => {
  const styleConfig: StyleConfig = getStyleConfig(type);
  const {
    brandColor,
    mainColor,
    backgroundColor,
    paletteSemanticRed,
    paletteSemanticGreen,
    fontSize,
    fontOpacity,
    borderWidth,
    borderOpacity,
    padding,
  } = styleConfig;

  return {
    rowHeader: {
      cell: {
        horizontalBorderColor: calcColorByOpacity(mainColor, borderOpacity.h2),
        verticalBorderColor: calcColorByOpacity(mainColor, borderOpacity.h2),
        horizontalBorderWidth: borderWidth.h2,
        verticalBorderWidth: borderWidth.h1,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: calcColorByOpacity(brandColor, 0.32),
        selectedBackgroundColor: calcColorByOpacity(mainColor, 0.32),
        padding: padding,
        textIndent: 12,
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontColor: calcColorByOpacity(mainColor, fontOpacity.h3),
        fontSize: fontSize.h3,
        textAlign: 'middle',
      },
      bolderText: {
        fontSize: fontSize,
        fontFamily: FONT_FAMILY,
        fill: calcColorByOpacity(mainColor, borderOpacity.h2),
        fontWeight: isWindows() ? 'bold' : '520',
        textBaseline: 'middle',
      },
      icon: {
        radius: 6,
      },
      seriesNumberWidth: 50,
    },
    colHeader: {
      cell: {
        horizontalBorderColor: calcColorByOpacity(mainColor, borderOpacity.h2),
        verticalBorderColor: calcColorByOpacity(mainColor, borderOpacity.h2),
        horizontalBorderWidth: borderWidth.h1,
        verticalBorderWidth: borderWidth.h2,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: calcColorByOpacity(brandColor, 0.32),
        selectedBackgroundColor: calcColorByOpacity(mainColor, 0.32),
        padding: padding,
        textIndent: 12,
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontColor: calcColorByOpacity(mainColor, fontOpacity.h2),
        fontSize: fontSize.h2,
        textAlign: 'middle',
      },
      bolderText: {
        fontSize: fontSize.h2,
        fontFamily: FONT_FAMILY,
        fill: calcColorByOpacity(mainColor, borderOpacity.h2),
        fontWeight: isWindows() ? 'bold' : '520',
        textBaseline: 'middle',
      },
    },
    corner: {
      cell: {
        horizontalBorderColor: calcColorByOpacity(mainColor, borderOpacity.h1),
        verticalBorderColor: calcColorByOpacity(mainColor, borderOpacity.h1),
        horizontalBorderWidth: borderWidth.h1,
        verticalBorderWidth: borderWidth.h2,
        backgroundColor: backgroundColor,
        padding: padding,
        textIndent: 12,
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontColor: calcColorByOpacity(mainColor, fontOpacity.h2),
        fontSize: fontSize.h2,
        textAlign: 'middle',
      },
      bolderText: {
        fontSize: fontSize.h2,
        fontFamily: FONT_FAMILY,
        fill: calcColorByOpacity(mainColor, borderOpacity.h2),
        fontWeight: isWindows() ? 'bold' : '520',
        textBaseline: 'middle',
      },
    },
    dataCell: {
      cell: {
        horizontalBorderColor: calcColorByOpacity(mainColor, borderOpacity.h2),
        verticalBorderColor: calcColorByOpacity(mainColor, borderOpacity.h2),
        horizontalBorderWidth: borderWidth.h2,
        verticalBorderWidth: borderWidth.h2,
        backgroundColor: backgroundColor,
        crossColor: calcColorByOpacity(brandColor, borderOpacity.h2),
        padding: padding,
        textIndent: 12,
        selectedBackgroundColor: calcColorByOpacity(brandColor, 0.32),
        selectedBorderColor: calcColorByOpacity(mainColor, borderOpacity.h2),
        hoverBorderColor: calcColorByOpacity(mainColor, borderOpacity.h2),
        hoverbBackgroundColor: calcColorByOpacity(brandColor, 0.32),
        prepareSelectBorderColor: calcColorByOpacity(brandColor, 0.32),
        hoverLinkageBackgroundColor: calcColorByOpacity(brandColor, 0.32),
        upIconColor: paletteSemanticGreen,
        downIconColor: paletteSemanticRed,
      },
      text: {
        fontFamily: FONT_FAMILY,
        fontColor: calcColorByOpacity(mainColor, fontOpacity.h3),
        fontSize: fontSize.h3,
        textAlign: 'right',
        textBaseline: 'middle',
      },
      bolderText: {
        fontSize: fontSize.h3,
        fontFamily: FONT_FAMILY,
        fill: calcColorByOpacity(mainColor, borderOpacity.h2),
        fontWeight: isWindows() ? 'bold' : '520',
        textBaseline: 'middle',
        textAlign: 'right',
      },
    },
    scrollBar: {
      trackColor: mainColor,
      thumbHoverColor: calcColorByOpacity(mainColor, 0.2),
      thumbColor: calcColorByOpacity(mainColor, 0.15),
      size: 6,
      hoverSize: 16,
    },
  } as SpreadSheetTheme;
};
