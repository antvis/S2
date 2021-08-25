import { SpreadSheet } from '../../sheet-type';
import { SortParam } from '../interface';

export type TooltipDataItem = Record<string, any>;

export interface IMenu {
  readonly id: string;
  readonly icon?: any;
  readonly text?: string;
  readonly children?: IMenu[]; // subMenu
}

export interface TooltipOperatorOptions {
  readonly onClick: (...params: unknown[]) => void;
  readonly menus: IMenu[];
}

export interface TooltipPosition {
  readonly x: number;
  readonly y: number;
  readonly tipHeight?: number;
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
  readonly name: string;
  readonly value: number | string;
  readonly selectedData: TooltipDataItem[];
}

export interface TooltipNameTipsOptions {
  readonly name?: string;
  readonly tips?: string;
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
  infos: string;
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

export interface SummaryParam extends DataParam {
  cellInfo: TooltipDataItem;
}

export interface TooltipDataParam extends DataParam {
  cellInfos: TooltipDataItem[];
}
