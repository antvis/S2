import {
  FONT_FAMILY,
  isWindows,
  type S2Theme,
  type SimplePalette,
} from '@antv/s2';

export const getCustomTheme = (palette: SimplePalette): S2Theme => {
  const { basicColors } = palette;
  const boldTextDefaultFontWeight = isWindows() ? 'bold' : 700;

  return {
    rowAxisCell: {
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fontWeight: boldTextDefaultFontWeight,
        fill: basicColors[14],
        opacity: 1,
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
        // -------------- border dash -----------------
        borderDash: [],
        // -------------- layout -----------------
        padding: {
          top: 4,
          right: 8,
          bottom: 4,
          left: 8,
        },
      },
    },
  };
};
