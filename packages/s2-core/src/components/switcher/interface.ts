import { FieldType } from './constant';

export interface SwitcherItem {
  id: string;
  displayName?: string;
  checked?: boolean;
  derivedValues?: SwitcherItem[];
}

export interface SwitchState {
  [FieldType.Rows]?: SwitcherItem[];
  [FieldType.Cols]?: SwitcherItem[];
  [FieldType.Values]?: SwitcherItem[];
}

export interface SwitchResult {
  [FieldType.Rows]: string[];
  [FieldType.Cols]: string[];
  [FieldType.Values]: string[];
  hiddenValues: string[];
}
