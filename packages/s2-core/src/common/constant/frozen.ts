export enum FrozenCellType {
  ROW = 'row',
  COL = 'col',
  TRAILING_ROW = 'trailingRow',
  TRAILING_COL = 'trailingCol',
  SCROLL = 'scroll',
  TOP = 'top',
  BOTTOM = 'bottom',
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
