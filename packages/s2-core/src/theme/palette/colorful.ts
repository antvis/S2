import type { Palette, PaletteMeta } from '../../common';
import { generatePalette } from '../../utils/color';

const paletteColorfulMeta: PaletteMeta = {
  brandColor: '#3471F9',
  // ---------- semantic colors ----------
  semanticColors: {
    red: '#FF4D4F',
    green: '#29A294',
    yellow: '#FAAD14',
  },
  others: {
    // ---------- searchResults colors ----------
    highlight: '#87B5FF',
    results: '#F0F7FF',
  },
  basicColorRelations: [
    {
      basicColorIndex: 1,
      standardColorIndex: 0,
    },
    {
      basicColorIndex: 2,
      standardColorIndex: 1,
    },
    {
      basicColorIndex: 3,
      standardColorIndex: 5,
    },
    {
      basicColorIndex: 4,
      standardColorIndex: 6,
    },
    {
      basicColorIndex: 5,
      standardColorIndex: 6,
    },
    {
      basicColorIndex: 6,
      standardColorIndex: 6,
    },
    {
      basicColorIndex: 7,
      standardColorIndex: 5,
    },
    {
      basicColorIndex: 9,
      standardColorIndex: 1,
    },
    {
      basicColorIndex: 10,
      standardColorIndex: 4,
    },
    {
      basicColorIndex: 11,
      standardColorIndex: 4,
    },
    {
      basicColorIndex: 12,
      standardColorIndex: 5,
    },
  ],
};

export const paletteColorful: Palette = generatePalette(paletteColorfulMeta);
