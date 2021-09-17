import { filter, flatten, isEmpty, isNil, last, map, reduce } from 'lodash';
import { DraggableLocation } from 'react-beautiful-dnd';
import {
  FieldType,
  MAX_DIMENSION_COUNT,
  SWITCHER_PREFIX_CLS,
} from './constant';
import { SwitcherItem, SwitcherResult, SwitcherState } from './interface';
import { getClassNameWithPrefix } from '@/utils/get-classnames';

export const getSwitcherClassName = (...classNames: string[]) =>
  getClassNameWithPrefix(SWITCHER_PREFIX_CLS, ...classNames);

export const getNonEmptyFieldCount = (state: SwitcherState) => {
  return [
    state[FieldType.Rows],
    state[FieldType.Cols],
    state[FieldType.Values],
  ].reduce((sum, value) => sum + (isEmpty(value) ? 0 : 1), 0);
};

export const getMainLayoutClassName = (nonEmptyCount: number) => {
  switch (nonEmptyCount) {
    case 1:
      return getSwitcherClassName('content', 'one-dimension');
    case 2:
      return getSwitcherClassName('content', 'two-dimensions');
    default:
      return getSwitcherClassName('content', 'three-dimensions');
  }
};

export const showDimensionCrossRows = (nonEmptyCount: number) =>
  nonEmptyCount < MAX_DIMENSION_COUNT;

export const isMeasureType = (fieldType: FieldType) =>
  fieldType === FieldType.Values;

export const moveItem = (
  source: SwitcherItem[],
  destination: SwitcherItem[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation,
): SwitcherState => {
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
  source: SwitcherItem[],
  checked: boolean,
  id: string,
  parentId?: string,
): SwitcherItem[] => {
  const target: SwitcherItem = {
    ...source.find((item) => item.id === (parentId ?? id)),
  };

  // 有 parentId 时，说明是第二层次项的改变
  if (parentId) {
    target.children = map(target.children, (item) => ({
      ...item,
      checked: item.id === id ? checked : item.checked,
    }));
  } else {
    target.checked = checked;
    target.children = map(target.children, (item) => ({
      ...item,
      checked: checked,
    }));
  }

  return source.map((item) => (item.id === target.id ? target : item));
};

const generateHiddenValues = (list: SwitcherItem[]) => {
  const getFlattenedItems = (
    items: SwitcherItem[] = [],
  ): Pick<SwitcherItem, 'id' | 'checked'>[] =>
    flatten(
      map(items, (item) => [
        { id: item.id, checked: item.checked },
        ...getFlattenedItems(item.children),
      ]),
    );

  const flattedItems = getFlattenedItems(list);
  let prevHiddenIdx: number = null;
  return reduce(
    flattedItems,
    (result, item, idx) => {
      if (isNil(item.checked) || item.checked) {
        return result;
      }
      if (idx === prevHiddenIdx + 1) {
        const lastGroup = last(result);
        lastGroup.push(item.id);
      } else {
        const group = [item.id];
        result.push(group);
      }
      prevHiddenIdx = idx;
      return result;
    },
    [],
  );
};

export const generateSwitchResult = (state: SwitcherState): SwitcherResult => {
  // rows and cols can't be hidden
  const rows = map(state[FieldType.Rows], 'id');
  const cols = map(state[FieldType.Cols], 'id');

  // flatten all values and derived values
  const values = flatten(
    map(state[FieldType.Values], (item) => {
      const children = map(item.children, 'id');
      return [item.id, ...children];
    }),
  );

  //  get all hidden values
  const hiddenValues = generateHiddenValues(state[FieldType.Values]);

  return { rows, cols, values, hiddenValues };
};
