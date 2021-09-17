import { ColIcon, RowIcon, ValueIcon } from '../icons/index';
import { i18n } from '@/common/i18n';

export const SWITCHER_PREFIX_CLS = 'switcher';

export enum FieldType {
  Rows = 'rows',
  Cols = 'cols',
  Values = 'values',
}

export enum DroppableType {
  Dimension = 'dimension',
  Measure = 'measure',
}

export const SWITCHER_CONFIG = {
  [FieldType.Rows]: {
    text: i18n('行头'),
    icon: RowIcon,
  },
  [FieldType.Cols]: {
    text: i18n('列头'),
    icon: ColIcon,
  },
  [FieldType.Values]: {
    text: i18n('值'),
    icon: ValueIcon,
  },
} as const;

export const MAX_DIMENSION_COUNT = 3;
