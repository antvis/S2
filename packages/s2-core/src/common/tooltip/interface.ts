import { BaseSpreadSheet } from '../../sheet-type';
import { SortParam } from '../interface';

export type DataItem = Record<string, any>;

export interface IMenu {
  readonly id: string; // menu id
  readonly icon?: any; // menu icon
  readonly text?: string; // menu 文本
  readonly children?: IMenu[]; // subMenu
}

export interface OperatorProps {
  readonly onClick: (...params) => void;
  readonly menus: IMenu[];
}

export interface OrderOption {
  sortMethod: 'ASC' | 'DESC';
  type: 'globalAsc' | 'globalDesc' | 'groupAsc' | 'groupDesc' | 'none';
  name: string;
}

export interface Position {
  readonly x: number;
  readonly y: number;
  readonly tipHeight?: number;
}

export type ListItem = {
  name: string;
  value: string;
  icon?: string;
};

export interface SortQuery {
  [key: string]: string;
}

export type ActionType =
  | 'cellSelection'
  | 'cellHover'
  | 'rowSelection'
  | 'columnSelection';

export interface TooltipOptions {
  actionType?: ActionType;
  // button action on the top
  operator?: OperatorProps;
  enterable?: boolean;
  // totals or not
  isTotals?: boolean;
  singleTips?: boolean;

  interpretation?: InterpretationProps;

  [key: string]: any;
}

export interface SummaryProps {
  readonly name: string;
  readonly value: number | string;
  readonly selectedData: DataItem[];
}

export interface TipsProps {
  readonly tips: string;
}

export interface OperationProps {
  plot: BaseSpreadSheet;
  sortFieldId: string;
  sortQuery: SortQuery;
}

export interface OperationState {
  sortParam: SortParam;
}

export type DetailProps = {
  list: ListItem[];
};

export type InterpretationProps = {
  name: string;
  icon?: any;
  text?: string;
  render?: React.ElementType;
};

export type InfosProps = {
  infos: string;
};

export type ShowProps = {
  position: Position;
  data?: DataItem;
  options?: TooltipOptions;
  element?: React.ReactElement;
};

export type HeadInfo = {
  rows: ListItem[];
  cols: ListItem[];
};
