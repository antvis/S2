import { BLACK, WHITE } from '@/common/constant';

export const defaultStyle = {
  // --------- color -----------
  brandColor: '#3471F9',
  neutralColor: BLACK,
  backgroundColor: WHITE,
  paletteSemanticRed: '#F46649',
  paletteSemanticGreen: '#2AA491',
  // --------- text -------------
  fontSize: {
    h1: 16,
    h2: 14,
    h3: 12,
  },
  fontOpacity: {
    h1: 1,
    h2: 0.85,
    h3: 0.65,
  },
  textIndent: 12,
  textAlign: 'middle',
  // ---------- border ----------
  borderWidth: {
    h1: 2,
    h2: 1,
    h3: 1,
  },
  borderOpacity: {
    h1: 1,
    h2: 0.2,
    h3: 0.3,
  },
  // ---------- icon --------------
  iconRadius: 4,
  iconSize: {
    h1: 14,
    h2: 10,
  },
  iconMargin: {
    left: 4,
    top: 4,
    right: 4,
    bottom: 4,
  },
  iconPadding: {
    left: 2,
    top: 2,
    right: 8,
    bottom: 2,
  },
  // ----------- cell ------------
  padding: {
    left: 8,
    top: 10,
    right: 8,
    bottom: 10,
  },
  lineHeight: {
    header: 38,
    cell: 28,
  },
};
