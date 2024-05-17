export enum FrozenGroupArea {
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
  TopLeft = 'frozenTopLeftGroup',
  TopRight = 'frozenTopRightGroup',
  BottomLeft = 'frozenBottomLeftGroup',
  BottomRight = 'frozenBottomRightGroup',
  Scroll = 'scrollGroup',
}

export const FrozenGroupAreaTypeMap = {
  [FrozenGroupArea.Row]: FrozenGroupType.Row,
  [FrozenGroupArea.Col]: FrozenGroupType.Col,
  [FrozenGroupArea.TrailingRow]: FrozenGroupType.TrailingRow,
  [FrozenGroupArea.TrailingCol]: FrozenGroupType.TrailingCol,
};

export interface FrozenCellIndex {
  x: number;
  y: number;
}
