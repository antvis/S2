export enum FrozenGroupPosition {
  Row = 'frozenRow',
  Col = 'frozenCol',
  TrailingRow = 'frozenTrailingRow',
  TrailingCol = 'frozenTrailingCol',
}

export enum FrozenGroupType {
  Row = 'frozenRowGroup',
  Col = 'frozenColGroup',
  TrailingCol = 'frozenTrailingColGroup',
  TrailingRow = 'frozenTrailingRowGroup',
  Top = 'frozenTopGroup',
  Bottom = 'frozenBottomGroup',
  Scroll = 'scrollGroup',
}

export const FrozenGroupPositionTypeMaps = {
  [FrozenGroupPosition.Row]: FrozenGroupType.Row,
  [FrozenGroupPosition.Col]: FrozenGroupType.Col,
  [FrozenGroupPosition.TrailingRow]: FrozenGroupType.TrailingRow,
  [FrozenGroupPosition.TrailingCol]: FrozenGroupType.TrailingCol,
};

export interface FrozenCellIndex {
  x: number;
  y: number;
}
