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

export interface SwitcherField {
  showExpandCheckbox?: boolean;
  expandText?: string;
  showItemCheckbox?: boolean;
  items: SwitcherItem[];
}

export interface SwitcherFields {
  [FieldType.Rows]?: SwitcherField;
  [FieldType.Cols]?: SwitcherField;
  [FieldType.Values]?: SwitcherField;
}

export interface SwitcherResultItem {
  items: string[];
  hideItems: string[];
}
export interface SwitcherResult {
  [FieldType.Rows]: SwitcherResultItem;
  [FieldType.Cols]: SwitcherResultItem;
  [FieldType.Values]: SwitcherResultItem;
}
