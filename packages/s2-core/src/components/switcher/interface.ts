import { FieldType } from './constant';

export interface SwitcherItem {
  id: string;
  displayName?: string;
  checked?: boolean;
  children?: Omit<SwitcherItem, 'children'>[];
}

export interface SwitcherState {
  [FieldType.Rows]?: SwitcherItem[];
  [FieldType.Cols]?: SwitcherItem[];
  [FieldType.Values]?: SwitcherItem[];
}

export interface SwitcherResult {
  [FieldType.Rows]: string[];
  [FieldType.Cols]: string[];
  [FieldType.Values]: string[];
  hiddenValues: string[][];
}
