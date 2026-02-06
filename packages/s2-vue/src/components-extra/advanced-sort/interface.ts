import type { SortMethod, SortParam, SpreadSheet } from '@antv/s2';
import type { VNode } from 'vue';

export interface Dimension {
  field: string;
  name: string;
  list: string[];
}

export interface RuleOption {
  label: string;
  value: 'sortMethod' | 'sortBy' | 'sortByMeasure';
  children?: RuleOption[];
}

export interface RuleValue {
  field: string;
  name: string;
  sortMethod?: SortMethod;
  sortBy?: string[];
  sortByMeasure?: string;
  // Added rule array for form state
  rule?: string[];
}

export interface AdvancedSortBaseProps {
  className?: string;
  icon?: VNode;
  text?: string;
  ruleText?: string;
  dimensions?: Dimension[];
  ruleOptions?: RuleOption[];
  sortParams?: SortParam[];
}

export interface AdvancedSortProps extends AdvancedSortBaseProps {
  sheetInstance: SpreadSheet;
}

export type RuleItem = RuleValue & { rule: string[] };

export interface CustomSortProps {
  splitOrders: string[];
}
