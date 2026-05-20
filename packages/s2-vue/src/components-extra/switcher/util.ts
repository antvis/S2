import type { SheetType } from '@antv/s2';
import { getClassNameWithPrefix, i18n } from '@antv/s2';
import { filter, flatten, map, mapValues } from 'lodash';
import { ColIcon, RowIcon, ValueIcon } from '../common/icons';
import { DroppableType, FieldType, SWITCHER_PREFIX_CLS } from './constant';
import type {
  SwitcherFields,
  SwitcherItem,
  SwitcherResult,
  SwitcherResultItem,
  SwitcherState,
} from './interface';

// Replace React-Beautiful-DnD types with generic interface
export interface DraggableLocation {
  droppableId: string;
  index: number;
}

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

export const checkItem = (
  source: SwitcherItem[] = [],
  checked: boolean,
  id: string,
  parentId?: string,
): SwitcherItem[] => {
  const targetIndex = source.findIndex((item) => item.id === (parentId ?? id));

  if (targetIndex === -1) {
    return source;
  }

  const target: SwitcherItem = {
    ...source[targetIndex],
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

  const newSource = [...source];

  newSource[targetIndex] = target;

  return newSource;
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
