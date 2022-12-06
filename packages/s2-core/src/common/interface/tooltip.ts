import type { FederatedPointerEvent as CanvasEvent } from '@antv/g';
import type * as CSS from 'csstype';
import type { SpreadSheet } from '../../sheet-type';
import type {
  Data,
  Point,
  S2CellType,
  SortMethod,
  SortParam,
} from '../../common/interface';
import type { BaseTooltip } from '../../ui/tooltip';
import type { CellData } from '../../data-set';

export type TooltipDataItem = Data;

export interface TooltipOperatorMenu<Icon = Element | string, Text = string> {
  key: string;
  icon?: Icon;
  text?: Text;
  onClick?: (cell: S2CellType) => void;
  visible?: boolean | ((cell: S2CellType) => boolean);
  children?: TooltipOperatorMenu<Icon, Text>[];
}

export type TooltipOperatorClickHandler = (params: {
  key: SortMethod;
  [key: string]: unknown;
}) => void;

export interface TooltipOperatorOptions<
  Icon = Element | string,
  Text = string,
> {
  onClick?: TooltipOperatorClickHandler;
  menus?: TooltipOperatorMenu<Icon, Text>[];
  defaultSelectedKeys?: string[];
}

export type TooltipPosition = Point;

export type TooltipDetailListItem = {
  name: string;
  value: string | number;
  icon?: Element | string;
};

export interface TooltipOptions<Icon = Element | string, Text = string> {
  // 隐藏汇总
  hideSummary?: boolean;
  // 顶部操作项
  operator?: TooltipOperatorOptions<Icon, Text>;
  enterable?: boolean;
  // 是否是小计
  isTotals?: boolean;
  showSingleTips?: boolean;
  onlyMenu?: boolean;
  enableFormat?: boolean;
  // 是否强制清空 dom
  forceRender?: boolean;
}

export interface TooltipSummaryOptions {
  name: string | null;
  value: number | string | undefined | null;
  selectedData: Data[] | CellData[];
}

export interface TooltipNameTipsOptions {
  name?: string | undefined | null;
  tips?: string | undefined | null;
}

export interface TooltipOperationOptions {
  plot: SpreadSheet;
  sortFieldId: string;
  sortQuery: {
    [key: string]: string;
  };
}

export interface TooltipOperationState {
  sortParam: SortParam;
}

export type TooltipDetailProps = {
  list: TooltipDetailListItem[] | null | undefined;
};

export type TooltipInterpretationOptions = {
  name: string;
  icon?: Element | string;
  text?: string;
  render?: Element | string;
};

export type TooltipShowOptions<
  T = TooltipContentType,
  Icon = Element | string,
  Text = string,
> = {
  position: TooltipPosition;
  data?: TooltipData;
  cellInfos?: TooltipDataItem[];
  options?: TooltipOptions<Icon, Text>;
  content?:
    | ((
        cell: S2CellType,
        defaultTooltipShowOptions: TooltipShowOptions<T, Icon, Text>,
      ) => T)
    | T;
  event?: CanvasEvent | MouseEvent;
};

export type TooltipData = {
  summaries?: TooltipSummaryOptions[];
  details?: TooltipDetailListItem[] | null | undefined;
  headInfo?: TooltipHeadInfo | null | undefined;
  name?: string | null | undefined;
  tips?: string;
  infos?: string;
  interpretation?: TooltipInterpretationOptions;
  colIndex?: number | null;
  rowIndex?: number | null;
  description?: string;
};

export type TooltipHeadInfo = {
  rows: TooltipDetailListItem[];
  cols: TooltipDetailListItem[];
};

export type TooltipDataParams = {
  spreadsheet: SpreadSheet;
  options?: TooltipOptions;
  targetCell?: S2CellType | undefined | null;
};

export interface TooltipSummaryProps {
  summaries: TooltipSummaryOptions[] | undefined;
}

export interface SummaryParam extends TooltipDataParams {
  cellInfos?: TooltipData[];
}

export interface TooltipDataParam extends TooltipDataParams {
  cellInfos: TooltipData[];
}

export interface OrderOption {
  sortMethod: 'ASC' | 'DESC';
  type: 'globalAsc' | 'globalDesc' | 'groupAsc' | 'groupDesc' | 'none';
  name: string;
}

export type TooltipAutoAdjustBoundary = 'body' | 'container' | null | undefined;

export type TooltipContentType = Element | string | undefined | null;

export interface BaseTooltipConfig<
  T = TooltipContentType,
  Icon = Element | string,
  Text = string,
> {
  showTooltip?: boolean;
  // Custom content
  content?: TooltipShowOptions<T>['content'];
  // Tooltip operation
  operation?: TooltipOperation<Icon, Text>;
  // Tooltip Boundary
  autoAdjustBoundary?: TooltipAutoAdjustBoundary;
  // Custom tooltip
  renderTooltip?: (spreadsheet: SpreadSheet) => BaseTooltip;
  // Custom tooltip position
  adjustPosition?: (positionInfo: TooltipPositionInfo) => TooltipPosition;
  // Custom tooltip mount container
  getContainer?: () => HTMLElement;
  // Extra tooltip container class name
  className?: string | string[];
  // Extra tooltip container style
  style?: CSS.Properties;
}

export interface TooltipPositionInfo {
  position: TooltipPosition;
  event: CanvasEvent | MouseEvent;
}

export interface Tooltip<
  T = TooltipContentType,
  Icon = Element | string,
  Text = string,
> extends BaseTooltipConfig<T, Icon, Text> {
  row?: BaseTooltipConfig<T, Icon, Text>;
  col?: BaseTooltipConfig<T, Icon, Text>;
  corner?: BaseTooltipConfig<T, Icon, Text>;
  data?: BaseTooltipConfig<T, Icon, Text>;
}

export interface TooltipOperation<Icon = Element | string, Text = string>
  extends TooltipOperatorOptions<Icon, Text> {
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
