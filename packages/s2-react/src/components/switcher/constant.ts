import { i18n } from '@antv/s2';
import { ColIcon, RowIcon, ValueIcon } from '../icons';

export const SWITCHER_PREFIX_CLS = 'switcher';

export enum FieldType {
  Rows = 'rows',
  Cols = 'columns',
  Values = 'values',
}

export enum DroppableType {
  Dimension = 'dimension',
  Measure = 'measure',
}

export const SWITCHER_FIELDS = [
  FieldType.Rows,
  FieldType.Cols,
  FieldType.Values,
];

export const getSwitcherConfig = () => ({
  [FieldType.Rows]: {
    text: i18n('行头'),
    icon: RowIcon,
    droppableType: DroppableType.Dimension,
  },
  [FieldType.Cols]: {
    text: i18n('列头'),
    icon: ColIcon,
    droppableType: DroppableType.Dimension,
  },
  [FieldType.Values]: {
    text: i18n('值'),
    icon: ValueIcon,
    droppableType: DroppableType.Measure,
  },
});
