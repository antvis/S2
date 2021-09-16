import { filter, flatten, isEmpty, map } from 'lodash';
import { DraggableLocation } from 'react-beautiful-dnd';
import { FieldType, MAX_DIMENSION_COUNT } from './constant';
import { Item, SwitchResult, SwitchState } from './interface';

export const getNonEmptyFieldCount = (state: SwitchState) => {
  return [
    state[FieldType.Rows],
    state[FieldType.Cols],
    state[FieldType.Values],
  ].reduce((sum, value) => sum + (isEmpty(value) ? 0 : 1), 0);
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

export const moveItem = (
  source: Item[],
  destination: Item[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation,
): SwitchState => {
  // change order in same column
  if (droppableDestination.droppableId === droppableSource.droppableId) {
    const updatingDestination = [...destination];
    const [removed] = updatingDestination.splice(droppableSource.index, 1);
    updatingDestination.splice(droppableDestination.index, 0, removed);
    return {
      [droppableDestination.droppableId]: updatingDestination,
    };
  }
  // move to other column
  const updatingSource = [...source];
  const updatingDestination = [...destination];

  const [removed] = updatingSource.splice(droppableSource.index, 1);
  updatingDestination.splice(droppableDestination.index, 0, removed);

  return {
    [droppableSource.droppableId]: updatingSource,
    [droppableDestination.droppableId]: updatingDestination,
  };
};

export const checkItem = (
  source: Item[],
  checked: boolean,
  id: string,
  derivedId?: string,
): Item[] => {
  const target: Item = { ...source.find((item) => item.id === id) };

  if (derivedId) {
    target.derivedValues = map(target.derivedValues, (item) => ({
      ...item,
      checked: item.id === derivedId ? checked : item.checked,
    }));
  } else {
    target.checked = checked;
    target.derivedValues = map(target.derivedValues, (item) => ({
      ...item,
      checked: checked,
    }));
  }

  return source.map((item) => (item.id === target.id ? target : item));
};

export const generateSwitchResult = (state: SwitchState): SwitchResult => {
  // rows and cols can't be hidden
  const rows = map(state[FieldType.Rows], 'id');
  const cols = map(state[FieldType.Cols], 'id');

  // flatten all values and derived values
  const values = flatten(
    map(state[FieldType.Values], (item) => {
      const derivedValues = map(item.derivedValues, 'id');
      return [item.id, ...derivedValues];
    }),
  );
  //  get all hidden values
  const hiddenValues = flatten(
    map(filter(state[FieldType.Values], ['checked', true]), (item) => {
      const hiddenDerivedValues = map(
        filter(item.derivedValues, ['checked', true]),
        'id',
      );
      return [item.id, ...hiddenDerivedValues];
    }),
  );

  return { rows, cols, values, hiddenValues };
};
