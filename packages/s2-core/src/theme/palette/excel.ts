import type { Palette } from '../../common';

/**
 * Microsoft Excel style palette
 * Replicates the default visual style of Microsoft Excel spreadsheets
 */
export const paletteExcel: Palette = {
  // Excel's primary accent color (green)
  brandColor: '#217346',
  // Semantic colors for conditional formatting
  semanticColors: {
    red: '#FF0000',
    green: '#00B050',
    yellow: '#FFFF00',
  },
  others: {
    // Search results highlight
    results: '#FFFF00',
    // Cell highlight
    highlight: '#B4D6A4',
  },
  /**
   * Basic colors mapping for Excel theme:
   * 0:  Corner header text, column header text (#000000 - black)
   * 1:  Row header background, data cell background zebra (#FFFFFF - white)
   * 2:  Row & data cell interactions hover/selected (#D6EAF8 - light blue)
   * 3:  Corner header background, column header background (#E6E6E6 - Excel gray header)
   * 4:  Column header interaction hover/selected (#C4D7B2 - light green)
   * 5:  Brush selection mask (#217346 - Excel green)
   * 6:  Row header link (#0563C1 - Excel hyperlink blue)
   * 7:  Mini bar, resize interaction (#217346 - Excel green)
   * 8:  Data cell background (non-zebra), table background (#FFFFFF - white)
   * 9:  Row header border, data cell border (#D4D4D4 - Excel gridline gray)
   * 10: Corner header border, column header border (#B4B4B4 - darker gray for header)
   * 11: Vertical split line (#217346 - Excel green)
   * 12: Horizontal split line (#217346 - Excel green)
   * 13: Data cell text (#000000 - black)
   * 14: Row header text, data cell interaction color (#000000 - black)
   */
  basicColors: [
    // 0: header text color
    '#000000',
    // 1: row header bg / data cell zebra bg
    '#FFFFFF',
    // 2: row & data cell interaction (hover, selected)
    '#D6EAF8',
    // 3: corner/col header background
    '#E6E6E6',
    // 4: col header interaction (hover, selected)
    '#C4D7B2',
    // 5: brush selection mask
    '#217346',
    // 6: link color (Excel hyperlink blue)
    '#0563C1',
    // 7: mini bar, resize guide line (Excel green)
    '#217346',
    // 8: data cell bg / table background
    '#FFFFFF',
    // 9: row header border, data cell border (Excel gridline)
    '#D4D4D4',
    // 10: corner/col header border
    '#B4B4B4',
    // 11: vertical split line
    '#217346',
    // 12: horizontal split line
    '#217346',
    // 13: data cell text
    '#000000',
    // 14: row header text, hover interaction color
    '#000000',
  ],
  basicColorRelations: [],
};
