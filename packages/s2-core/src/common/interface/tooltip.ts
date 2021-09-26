import { MenuProps } from 'antd';
import { SpreadSheet } from '@/sheet-type';
import { SortParam } from '@/common/interface';
import { BaseTooltip } from '@/ui/tooltip';

export type TooltipDataItem = Record<string, any>;

export interface TooltipOperatorMenu {
  id: string;
  icon?: React.ReactNode;
  text?: string;
  children?: TooltipOperatorMenu[]; // subMenu
}

export interface TooltipOperatorOptions {
  onClick: MenuProps['onClick'];
  menus: TooltipOperatorMenu[];
  [key: string]: unknown;
}

export interface TooltipPosition {
  x: number;
  y: number;
  tipHeight?: number;
}

export type ListItem = {
  name: string;
  value: string | number;
  icon?: React.ReactNode;
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
  rowQuery?: Record<string, unknown>;
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
  icon?: React.ReactNode;
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

export type IconProps = {
  icon: React.ReactNode;
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

export interface Tooltip {
  readonly showTooltip?: boolean;
  readonly row?: Tooltip;
  readonly col?: Tooltip;
  readonly cell?: Tooltip;
  // custom tooltips
  readonly renderTooltip?: RenderTooltip;
  // replace the whole default tooltip component
  readonly tooltipComponent?: JSX.Element;
  // Tooltip operation
  readonly operation?: TooltipOperation;
}

export interface TooltipOperation {
  // 隐藏列 (明细表有效)
  hiddenColumns?: boolean;
  // 趋势图
  trend?: boolean;
  // 组内排序
  sort?: boolean;
  // 筛选
  filter?: boolean;
}

export type RenderTooltip = (spreadsheet: SpreadSheet) => BaseTooltip;
