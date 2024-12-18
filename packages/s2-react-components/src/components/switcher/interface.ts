import { type PopoverProps } from 'antd';
import React from 'react';
import { FieldType } from './constant';
import type { SwitcherContentProps } from './content';

type SwitcherItemWithoutChildren = Omit<SwitcherItem, 'children'>;

export interface SwitcherItem {
  id: string;
  displayName?: string;
  checked?: boolean;
  children?: SwitcherItemWithoutChildren[];
}

export interface SwitcherState {
  [FieldType.Rows]?: SwitcherItem[];
  [FieldType.Cols]?: SwitcherItem[];
  [FieldType.Values]?: SwitcherItem[];
}

export interface SwitcherField {
  allowEmpty?: boolean;
  expandable?: boolean;
  expandText?: string;
  selectable?: boolean;
  items: SwitcherItem[] | undefined;
}

export interface SwitcherFields {
  [FieldType.Rows]?: SwitcherField;
  [FieldType.Cols]?: SwitcherField;
  [FieldType.Values]?: SwitcherField;
}

export interface SwitcherResultItem {
  items: SwitcherItemWithoutChildren[];
  hideItems: SwitcherItemWithoutChildren[];
}
export interface SwitcherResult {
  [FieldType.Rows]: SwitcherResultItem;
  [FieldType.Cols]: SwitcherResultItem;
  [FieldType.Values]: SwitcherResultItem;
}

export interface SwitcherProps
  extends Omit<SwitcherContentProps, 'onToggleVisible'> {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  // ref: https://ant.design/components/popover-cn/#API
  popover?: PopoverProps;
  disabled?: boolean;
  children?: React.ReactNode;
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
