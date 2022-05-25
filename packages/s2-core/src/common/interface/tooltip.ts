import type { Event as CanvasEvent } from '@antv/g-canvas';
import type { SpreadSheet } from '@/sheet-type';
import type { S2CellType, SortParam } from '@/common/interface';
import type { BaseTooltip } from '@/ui/tooltip';

export type TooltipDataItem = Record<string, any>;

export interface TooltipOperatorMenu {
  key: string;
  icon?: Element | string;
  text?: string;
  onClick?: (cell: S2CellType) => void;
  visible?: boolean | ((cell: S2CellType) => boolean);
  children?: TooltipOperatorMenu[];
}

export interface TooltipOperatorOptions {
  onClick?: (...args: unknown[]) => void;
  menus?: TooltipOperatorMenu[];
}

export interface TooltipPosition {
  x: number;
  y: number;
}

export type ListItem = {
  name: string;
  value: string | number;
  icon?: Element | string;
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
  enableFormat?: boolean;
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
  icon?: Element | string;
  text?: string;
  render?: Element | string;
};

export type TooltipShowOptions<T = TooltipContentType> = {
  position: TooltipPosition;
  data?: TooltipData;
  cellInfos?: TooltipDataItem[];
  options?: TooltipOptions;
  content?:
    | ((
        cell: S2CellType,
        defaultTooltipShowOptions: TooltipShowOptions<T>,
      ) => T)
    | T;
  event?: CanvasEvent | MouseEvent;
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
  icon: Element | string;
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

export type TooltipContentType = Element | string;

export interface BaseTooltipConfig<T = TooltipContentType> {
  readonly showTooltip?: boolean;
  // Custom content
  readonly content?: TooltipShowOptions<T>['content'];
  // Tooltip operation
  readonly operation?: TooltipOperation;
  readonly autoAdjustBoundary?: TooltipAutoAdjustBoundary;
  readonly renderTooltip?: (spreadsheet: SpreadSheet) => BaseTooltip;
  // Custom tooltip mount container
  readonly getContainer?: () => HTMLElement;
}

export interface Tooltip<T = TooltipContentType> extends BaseTooltipConfig<T> {
  readonly row?: BaseTooltipConfig<T>;
  readonly col?: BaseTooltipConfig<T>;
  readonly corner?: BaseTooltipConfig<T>;
  readonly data?: BaseTooltipConfig<T>;
}

export interface TooltipOperation extends TooltipOperatorOptions {
  // 隐藏列 (明细表有效)
  hiddenColumns?: boolean;
  // 趋势图
  trend?: boolean;
  // 组内排序
  sort?: boolean;
  // 明细表排序
  tableSort?: boolean;
}

export interface AutoAdjustPositionOptions {
  position: TooltipPosition;
  tooltipContainer: HTMLElement;
  spreadsheet: SpreadSheet;
  autoAdjustBoundary: TooltipAutoAdjustBoundary;
}
