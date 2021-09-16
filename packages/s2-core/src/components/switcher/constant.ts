import { ColIcon, RowIcon, ValueIcon } from '../icons/index';

export enum FieldType {
  Rows = 'rows',
  Cols = 'cols',
  Values = 'values',
}

export const SWITCHER_CONFIG = {
  [FieldType.Rows]: {
    text: '行头',
    icon: RowIcon,
  },
  [FieldType.Cols]: {
    text: '列头',
    icon: ColIcon,
  },
  [FieldType.Values]: {
    text: '值',
    icon: ValueIcon,
  },
} as const;
