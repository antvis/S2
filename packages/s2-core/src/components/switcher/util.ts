import { isEmpty } from 'lodash';
import { DimensionItemType, MeasureItemType } from './dimension';

export const getNonEmptyFieldCount = (
  rows: DimensionItemType[] = [],
  cols: DimensionItemType[] = [],
  values: MeasureItemType[] = [],
) => {
  return [rows, cols, values].reduce(
    (sum, value) => sum + (isEmpty(value) ? 0 : 1),
    0,
  );
};

export const getMainLayoutClassName = (nonEmptyCount: number) => {
  switch (nonEmptyCount) {
    case 1:
      return 'one-dimension';
    case 2:
      return 'two-dimensions';
    default:
      return 'three-dimensions';
  }
};

export const showDimensionCrossRows = (nonEmptyCount: number) =>
  nonEmptyCount < 3;
