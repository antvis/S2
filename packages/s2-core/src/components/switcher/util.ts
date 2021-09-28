import { filter, flatten, isEmpty, map, mapValues } from 'lodash';
import { DraggableLocation } from 'react-beautiful-dnd';
import {
  FieldType,
  MAX_DIMENSION_COUNT,
  SWITCHER_PREFIX_CLS,
} from './constant';
import {
  SwitcherItem,
  SwitcherResult,
  SwitcherState,
  SwitcherFields,
  SwitcherResultItem,
} from './interface';
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

export const shouldCrossRows = (nonEmptyCount: number, type: FieldType) =>
  nonEmptyCount < MAX_DIMENSION_COUNT || type === FieldType.Values;

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

  // 有 parentId 时，说明是第二层级的改变
  if (parentId) {
    target.children = map(target.children, (item) => ({
      ...item,
      checked: item.id === id ? checked : item.checked,
    }));
  } else {
    target.checked = checked;
    target.children = map(target.children, (item) => ({
      ...item,
      checked,
    }));
  }

  return source.map((item) => (item.id === target.id ? target : item));
};

export const generateSwitchResult = (state: SwitcherState): SwitcherResult => {
  const generateFieldResult = (items: SwitcherItem[]): SwitcherResultItem => {
    const mapIds = (list: SwitcherItem[]) => map(list, 'id');

    const flattenValues = (list: SwitcherItem[]) =>
      flatten(
        map(list, (item) => {
          return [
            { id: item.id, checked: item.checked },
            ...flattenValues(item.children),
          ];
        }),
      );

    const flattedValues = flattenValues(items);

    const allItems = mapIds(flattedValues);

    //  get all hidden values
    const hideItems = mapIds(
      filter(flattedValues, (item: SwitcherItem) => item.checked === false),
    );
    return {
      items: allItems,
      hideItems,
    };
  };

  return {
    [FieldType.Rows]: generateFieldResult(state[FieldType.Rows]),
    [FieldType.Cols]: generateFieldResult(state[FieldType.Cols]),
    [FieldType.Values]: generateFieldResult(state[FieldType.Values]),
  };
};

export const getSwitcherState = (fields: SwitcherFields): SwitcherState =>
  mapValues(fields, 'items');
