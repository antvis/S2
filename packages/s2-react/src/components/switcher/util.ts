import { filter, flatten, map, mapValues } from 'lodash';
import type { DraggableLocation } from 'react-beautiful-dnd';
import { getClassNameWithPrefix, i18n } from '@antv/s2';
import type { SheetType } from '@antv/s2-shared';
import { ColIcon, RowIcon, ValueIcon } from '../icons';
import { DroppableType, FieldType, SWITCHER_PREFIX_CLS } from './constant';
import type {
  SwitcherItem,
  SwitcherResult,
  SwitcherState,
  SwitcherFields,
  SwitcherResultItem,
} from './interface';

// 是否开启行列维度相互切换
export const getSwitcherConfig = (allowExchangeHeader = true) => {
  return {
    [FieldType.Rows]: {
      text: i18n('行头'),
      icon: RowIcon,
      droppableType: allowExchangeHeader
        ? DroppableType.Dimensions
        : DroppableType.Rows,
    },
    [FieldType.Cols]: {
      text: i18n('列头'),
      icon: ColIcon,
      droppableType: allowExchangeHeader
        ? DroppableType.Dimensions
        : DroppableType.Cols,
    },
    [FieldType.Values]: {
      text: i18n('值'),
      icon: ValueIcon,
      droppableType: DroppableType.Measures,
    },
  };
};

export const getSwitcherClassName = (...classNames: string[]) =>
  getClassNameWithPrefix(SWITCHER_PREFIX_CLS, ...classNames);

export const getMainLayoutClassName = (sheetType: SheetType | undefined) => {
  switch (sheetType) {
    case 'table':
      return getSwitcherClassName('content', 'one-dimension');
    default:
      return getSwitcherClassName('content', 'three-dimensions');
  }
};

export const shouldCrossRows = (
  sheetType: SheetType | undefined,
  type: FieldType,
) => sheetType === 'table' || type === FieldType.Values;

export const moveItem = (
  source: SwitcherItem[] = [],
  destination: SwitcherItem[] = [],
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
  source: SwitcherItem[] = [],
  checked: boolean,
  id: string,
  parentId?: string,
): SwitcherItem[] => {
  const target: SwitcherItem = {
    ...source.find((item) => item.id === (parentId ?? id))!,
  };

  // 有 parentId 时，说明是第二层级的改变
  if (parentId) {
    target.children = map(target.children, (item) => {
      return {
        ...item,
        checked: item.id === id ? checked : item.checked,
      };
    });
  } else {
    target.checked = checked;
    target.children = map(target.children, (item) => {
      return {
        ...item,
        checked,
      };
    });
  }

  return source.map((item) => (item.id === target.id ? target : item));
};

export const generateSwitchResult = (state: SwitcherState): SwitcherResult => {
  const generateFieldResult = (
    items: SwitcherItem[] = [],
  ): SwitcherResultItem => {
    const flattenValues = (list: SwitcherItem[] = []): SwitcherItem[] =>
      flatten(
        map(list, ({ children, ...rest }) => [
          { ...rest },
          ...flattenValues(children),
        ]),
      );

    const allItems = flattenValues(items);

    //  get all hidden values
    const hideItems = filter(
      allItems,
      (item: SwitcherItem) => item.checked === false,
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
