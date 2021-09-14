import { ColIcon, RowIcon, ValueIcon } from '../icons/index';

export enum FieldType {
  Row = 'row',
  Col = 'col',
  Value = 'value',
}

export const SWITCHER_CONFIG = {
  [FieldType.Row]: {
    text: '行头',
    icon: RowIcon,
  },
  [FieldType.Col]: {
    text: '列头',
    icon: ColIcon,
  },
  [FieldType.Value]: {
    text: '值',
    icon: ValueIcon,
  },
} as const;
