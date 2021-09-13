import { SpreadSheet } from '../../sheet-type';
import { SortParam } from '../interface';

export type TooltipDataItem = Record<string, any>;

export interface IMenu {
  id: string;
  icon?: any;
  text?: string;
  children?: IMenu[]; // subMenu
}

export interface TooltipOperatorOptions {
  onClick: (...params: unknown[]) => void;
  menus: IMenu[];
}

export interface TooltipPosition {
  x: number;
  y: number;
  tipHeight?: number;
}

export type ListItem = {
  name: string;
  value: string | number;
  icon?: string;
};

export interface SortQuery {
  [key: string]: string;
}

export interface TooltipOptions {
  hideSummary?: boolean;
  // button action on the top
  operator?: TooltipOperatorOptions;
  enterable?: boolean;
  // totals or not
  isTotals?: boolean;
  showSingleTips?: boolean;
  [key: string]: any;
}

export interface TooltipSummaryOptions {
  name: string;
  value: number | string;
  selectedData: TooltipDataItem[];
}

export interface TooltipNameTipsOptions {
  name?: string;
  tips?: string;
}

export interface TooltipOperationOptions {
  plot: SpreadSheet;
  sortFieldId: string;
  sortQuery: SortQuery;
}

export interface TooltipOperationState {
  sortParam: SortParam;
}

export type TooltipDetailProps = {
  list: ListItem[];
};

export type TooltipInterpretationOptions = {
  name: string;
  icon?: any;
  text?: string;
  render?: React.ElementType;
};

export type InfosProps = {
  infos: React.ReactNode;
};

export type TooltipShowOptions = {
  position: TooltipPosition;
  data?: TooltipData;
  cellInfos?: TooltipDataItem[];
  options?: TooltipOptions;
  element?: React.ReactElement;
};

export type TooltipData = {
  summaries?: TooltipSummaryOptions[];
  details?: ListItem[];
  headInfo?: TooltipHeadInfo;
  name?: string;
  tips?: string;
  infos?: string;
  interpretation?: TooltipInterpretationOptions;
};

export type TooltipHeadInfo = {
  rows: ListItem[];
  cols: ListItem[];
};

export type DataParam = {
  spreadsheet: SpreadSheet;
  options?: TooltipOptions;
  isHeader?: boolean; // 是否是行头/列头
  getShowValue?: (
    selectedData: TooltipDataItem[],
    valueField: string,
  ) => string | number; // 自定义value
};

export interface SummaryProps {
  summaries: TooltipSummaryOptions[];
}

export interface SummaryParam extends DataParam {
  cellInfos?: TooltipDataItem[];
}

export interface TooltipDataParam extends DataParam {
  cellInfos: TooltipDataItem[];
}

export interface OrderOption {
  sortMethod: 'ASC' | 'DESC';
  type: 'globalAsc' | 'globalDesc' | 'groupAsc' | 'groupDesc' | 'none';
  name: string;
}
