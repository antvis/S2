export enum FrozenCellType {
  ROW = 'ROW',
  COL = 'COL',
  TRAILING_ROW = 'TRAILING_ROW',
  TRAILING_COL = 'TRAILING_COL',
  SCROLL = 'SCROLL',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
}

export const FrozenCellGroupMap = {
  [FrozenCellType.ROW]: 'frozenRowGroup',
  [FrozenCellType.COL]: 'frozenColGroup',
  [FrozenCellType.TRAILING_COL]: 'frozenTrailingColGroup',
  [FrozenCellType.TRAILING_ROW]: 'frozenTrailingRowGroup',
  [FrozenCellType.SCROLL]: 'panelScrollGroup',
  [FrozenCellType.TOP]: 'frozenTopGroup',
  [FrozenCellType.BOTTOM]: 'frozenBottomGroup',
};

export interface FrozenOpts {
  frozenRowCount: number;
  frozenColCount: number;
  frozenTrailingRowCount: number;
  frozenTrailingColCount: number;
}

export interface FrozenCellIndex {
  x: number;
  y: number;
}
