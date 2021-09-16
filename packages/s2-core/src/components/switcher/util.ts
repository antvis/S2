import { isEmpty } from 'lodash';
import { DraggableLocation } from 'react-beautiful-dnd';
import { FieldType, MAX_DIMENSION_COUNT } from './constant';
import { Item } from './item';

export const getNonEmptyFieldCount = (
  rows: Item[] = [],
  cols: Item[] = [],
  values: Item[] = [],
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
  nonEmptyCount < MAX_DIMENSION_COUNT;

export const isMeasureType = (fieldType: FieldType) =>
  fieldType === FieldType.Values;
