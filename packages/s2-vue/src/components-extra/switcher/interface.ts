import type { PopoverProps } from 'ant-design-vue';
import type { VNode } from 'vue';
import { FieldType } from './constant';

export type SwitcherItemWithoutChildren = Omit<SwitcherItem, 'children'>;

export interface SwitcherItem {
  id: string;
  displayName?: string;
  checked?: boolean;
  children?: SwitcherItemWithoutChildren[];
}

export interface SwitcherState {
  rows?: SwitcherItem[];
  columns?: SwitcherItem[];
  values?: SwitcherItem[];
}

export interface SwitcherField {
  allowEmpty?: boolean;
  expandable?: boolean;
  expandText?: string;
  selectable?: boolean;
  items: SwitcherItem[] | undefined;
}

export interface SwitcherFields {
  rows?: SwitcherField;
  columns?: SwitcherField;
  values?: SwitcherField;
}

export interface SwitcherResultItem {
  items: SwitcherItemWithoutChildren[];
  hideItems: SwitcherItemWithoutChildren[];
}
export interface SwitcherResult {
  rows: SwitcherResultItem;
  columns: SwitcherResultItem;
  values: SwitcherResultItem;
}

// Emulate content props interface for Vue
export interface SwitcherContentProps extends SwitcherFields {
  // Simplified SheetType
  sheetType?: 'pivot' | 'table';
  contentTitleText?: string;
  resetText?: string;
  innerContentClassName?: string;
  allowExchangeHeader?: boolean;
  onToggleVisible: () => void;
  onSubmit?: (result: SwitcherResult) => void;
}

export interface SwitcherProps
  extends Omit<SwitcherContentProps, 'onToggleVisible'> {
  title?: string | VNode;
  icon?: VNode;
  popover?: PopoverProps;
  disabled?: boolean;
}

export interface DimensionCommonProps
  extends Pick<SwitcherField, 'selectable' | 'expandable'> {
  fieldType: FieldType;
  draggingItemId?: string | null;
  onVisibleItemChange: (
    fieldType: FieldType,
    checked: boolean,
    id: string,
    parentId?: string,
  ) => void;
}
