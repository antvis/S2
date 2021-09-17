import { FieldType } from './constant';

export interface Item {
  id: string;
  displayName: string;
  checked?: boolean;
  derivedValues?: Item[];
}

export interface SwitchState {
  [FieldType.Rows]?: Item[];
  [FieldType.Cols]?: Item[];
  [FieldType.Values]?: Item[];
}

export interface SwitchResult {
  [FieldType.Rows]: string[];
  [FieldType.Cols]: string[];
  [FieldType.Values]: string[];
  hiddenValues: string[];
}
