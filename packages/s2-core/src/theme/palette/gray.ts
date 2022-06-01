import type { Palette, PaletteMeta } from '../../common';
import { generatePalette } from '../../utils/color';

const paletteGrayMeta: PaletteMeta = {
  brandColor: '#9DA7B6',
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
      standardColorIndex: 1,
    },
    {
      basicColorIndex: 4,
      standardColorIndex: 2,
    },
    {
      basicColorIndex: 5,
      standardColorIndex: 7,
    },
    {
      basicColorIndex: 6,
      standardColorIndex: 8,
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
      standardColorIndex: 2,
    },
    {
      basicColorIndex: 11,
      standardColorIndex: 3,
    },
    {
      basicColorIndex: 12,
      standardColorIndex: 3,
    },
  ],
};

export const paletteGray: Palette = generatePalette(paletteGrayMeta);
