import { SpreadSheet } from '@/sheet-type';
import { SortParam } from '@/common/interface';

export type TooltipDataItem = Record<string, any>;

export interface TooltipOperatorMenu {
  id: string;
  icon?: Node | Element | string;
  text?: string;
  children?: TooltipOperatorMenu[]; // subMenu
}

export interface TooltipOperatorOptions {
  onClick: (...params: unknown[]) => void;
  menus: TooltipOperatorMenu[];
  [key: string]: unknown;
}

export interface TooltipPosition {
  x: number;
  y: number;
}

export type ListItem = {
  name: string;
  value: string | number;
  icon?: Node | Element | string;
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
  onlyMenu?: boolean;
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
  icon?: Node | Element | string;
  text?: string;
  render?: Node | Element | string;
};

export type InfosProps = {
  infos: string;
};

export type TooltipShowOptions = {
  position: TooltipPosition;
  data?: TooltipData;
  cellInfos?: TooltipDataItem[];
  options?: TooltipOptions;
  element?: Node | string;
};

export type TooltipData = {
  summaries?: TooltipSummaryOptions[];
  details?: ListItem[];
  headInfo?: TooltipHeadInfo;
  name?: string;
  tips?: string;
  infos?: string;
  interpretation?: TooltipInterpretationOptions;
  colIndex?: number;
  rowIndex?: number;
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

export type IconProps = {
  icon: Node | Element | string;
  [key: string]: unknown;
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

export type TooltipAutoAdjustBoundary = 'body' | 'container';

export interface BaseTooltipConfig {
  readonly showTooltip?: boolean;
  // replace the whole default tooltip component
  readonly tooltipComponent?: Node | Element | string;
  // Tooltip operation
  readonly operation?: TooltipOperation;
  readonly autoAdjustBoundary?: TooltipAutoAdjustBoundary;
  readonly getTooltipComponent?: (
    options: TooltipShowOptions,
    container: HTMLElement,
  ) => Node | Element | string;
}

export interface Tooltip extends BaseTooltipConfig {
  readonly row?: BaseTooltipConfig;
  readonly col?: BaseTooltipConfig;
  readonly cell?: BaseTooltipConfig;
}

export interface TooltipOperation {
  // 隐藏列 (明细表有效)
  hiddenColumns?: boolean;
  // 趋势图
  trend?: boolean;
  // 组内排序
  sort?: boolean;
}

export interface AutoAdjustPositionOptions {
  position: TooltipPosition;
  tooltipContainer: HTMLElement;
  spreadsheet: SpreadSheet;
  autoAdjustBoundary: TooltipAutoAdjustBoundary;
}
