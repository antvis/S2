export enum FrozenCellType {
  ROW = 'row',
  COL = 'col',
  TRAILING_ROW = 'trailingRow',
  TRAILING_COL = 'trailingCol',
  SCROLL = 'scroll',
  TOP = 'top',
  BOTTOM = 'bottom',
}

export enum FrozenGroupType {
  FROZEN_COL = 'frozenCol',
  FROZEN_ROW = 'frozenRow',
  FROZEN_TRAILING_COL = 'frozenTrailingCol',
  FROZEN_TRAILING_ROW = 'frozenTrailingRow',
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

export interface FrozenCellIndex {
  x: number;
  y: number;
}
