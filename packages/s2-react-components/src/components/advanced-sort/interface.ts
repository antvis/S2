import { SpreadSheet, type SortMethod, type SortParam } from '@antv/s2';

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
}

export interface AdvancedSortBaseProps {
  className?: string;
  icon?: React.ReactNode;
  text?: React.ReactNode;
  ruleText?: React.ReactNode;
  dimensions?: Dimension[];
  ruleOptions?: RuleOption[];
  sortParams?: SortParam[];
  onSortOpen?: () => void;
  onSortConfirm?: (ruleValues: RuleValue[], sortParams: SortParam[]) => void;
}

export interface AdvancedSortProps extends AdvancedSortBaseProps {
  sheetInstance: SpreadSheet;
}

export type RuleItem = RuleValue & { rule: string[] };

export interface CustomSortProps {
  splitOrders: string[];
  setSplitOrders: (param: string[]) => void;
}
