import { i18n } from '@antv/s2';
import { ColIcon, RowIcon, ValueIcon } from '../icons';

export const SWITCHER_PREFIX_CLS = 'switcher';

export enum FieldType {
  Rows = 'rows',
  Cols = 'columns',
  Values = 'values',
}

export enum DroppableType {
  Dimensions = 'dimensions',
  Measures = 'measures',
  Rows = 'rows',
  Cols = 'cols',
}

export const SWITCHER_FIELDS = [
  FieldType.Rows,
  FieldType.Cols,
  FieldType.Values,
];

// 是否开启行列维度相互切换
export const getSwitcherConfig = (allowSwitchBetweenRowsAndCols = true) => ({
  [FieldType.Rows]: {
    text: i18n('行头'),
    icon: RowIcon,
    droppableType: allowSwitchBetweenRowsAndCols
      ? DroppableType.Dimensions
      : DroppableType.Rows,
  },
  [FieldType.Cols]: {
    text: i18n('列头'),
    icon: ColIcon,
    droppableType: allowSwitchBetweenRowsAndCols
      ? DroppableType.Dimensions
      : DroppableType.Cols,
  },
  [FieldType.Values]: {
    text: i18n('值'),
    icon: ValueIcon,
    droppableType: DroppableType.Measures,
  },
});
