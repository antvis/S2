import type { FederatedPointerEvent as CanvasEvent } from '@antv/g';
import type * as CSS from 'csstype';
import type { SpreadSheet } from '../../sheet-type';
import type {
  Data,
  Point,
  S2CellType,
  SortMethod,
} from '../../common/interface';
import type { BaseTooltip } from '../../ui/tooltip';

export type TooltipDataItem = Data;

export interface TooltipOperatorMenu<Icon = Element | string, Text = string> {
  /** 唯一标识 */
  key: string;
  /** 自定义 icon */
  icon?: Icon;
  /** 名称 */
  text?: Text;
  /** 点击回调 */
  onClick?: (cell: S2CellType) => void;
  /** 是否显示 */
  visible?: boolean | ((cell: S2CellType) => boolean);
  /** 子菜单 */
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
  /**
   * 是否隐藏汇总项
   * @example "数量(总和) 999"
   */
  hideSummary?: boolean;

  /**
   * 顶部操作项
   */
  operator?: TooltipOperatorOptions<Icon, Text>;

  /**
   * 是否是小计/总计
   */
  isTotals?: boolean;

  /**
   * 只展示当前单元格文本 (不含汇总/行列头信息), 如果存在省略, 显示完整文本
   * 1. 用于单元格省略后 hover 显示完整文本
   * 2. 明细表 hover/click 显示当前单元格文本
   * 3. 自定义交互 hover/click 场景
  * @example
    s2.showTooltip({
      ...
      options: { onlyShowCellText: true }
    })
   */
  onlyShowCellText?: boolean;

  /**
   * 只展示顶部操作项菜单 (不含汇总/行列头/单元格信息)
   * 1. 用于排序场景
   * 2. 自定义交互
   * @example
      s2.showTooltip({
        ...
        options: { onlyShowOperator: true }
      })
   */
  onlyShowOperator?: boolean;

  /**
   * 是否格式化数据
   */
  enableFormat?: boolean;

  /**
   * 是否强制清空 dom
   */
  forceRender?: boolean;

  /**
   * 自定义数据
   */
  data?: TooltipData;
}

export type TooltipSummaryOptionsValue = number | string | undefined | null;

export interface TooltipSummaryOptions {
  name: string | null;
  selectedData: TooltipDataItem[];
  value: TooltipSummaryOptionsValue;
  originValue?: TooltipSummaryOptionsValue;
}

export interface TooltipNameTipsOptions {
  name?: string | undefined | null;
  tips?: string | undefined | null;
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
  onMounted?: () => void;
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

export type TooltipAutoAdjustBoundary = 'body' | 'container' | null | undefined;

export type TooltipContentType = Element | string | undefined | null;

export interface BaseTooltipConfig<
  T = TooltipContentType,
  Icon = Element | string,
  Text = string,
> {
  /**
   * 是否开启 tooltip, 在点击/悬停/停留/刷选/多选等场景会显示
   * @description @antv/s2 中只保留了 tooltip 的核心显隐逻辑，提供相应数据，不渲染内容
   * React 版本 和 Vue3 版本中通过 自定义 Tooltip 类 的方式渲染 tooltip 的内容，包括 排序下拉菜单, 单元格选中信息汇总, 列头隐藏按钮 等。
   * @see https://s2.antv.antgroup.com/manual/basic/tooltip
   */
  enable?: boolean;

  /**
   * 自定义内容
   * @see https://s2.antv.antgroup.com/manual/basic/tooltip#%E8%87%AA%E5%AE%9A%E4%B9%89
   */
  content?: TooltipShowOptions<T>['content'];

  /**
   * 自定义操作项
   * @see https://s2.antv.antgroup.com/manual/basic/tooltip#%E8%87%AA%E5%AE%9A%E4%B9%89
   */
  operation?: TooltipOperation<Icon, Text>;

  /**
   * 显示边界, 当 tooltip 超过边界时自动调整显示位置，container: 图表区域，body: 整个浏览器窗口，设置为 `null` 可关闭此功能
   */
  autoAdjustBoundary?: TooltipAutoAdjustBoundary;

  /**
   * 自定义 Tooltip 类
   * @see https://s2.antv.antgroup.com/zh/examples/react-component/tooltip/#custom-tooltip
   */
  render?: (spreadsheet: SpreadSheet) => BaseTooltip;

  /**
   * 自定义坐标
   */
  adjustPosition?: (positionInfo: TooltipPositionInfo) => TooltipPosition;

  /**
   * 自定义挂载容器, 默认 body
   */
  getContainer?: () => HTMLElement;

  /**
   * 容器类名
   */
  className?: string | string[];

  /**
   * 容器样式
   */
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
  /**
   * Tooltip 行头单元格配置
   */
  rowCell?: BaseTooltipConfig<T, Icon, Text>;

  /**
   * Tooltip 列头单元格配置
   */
  colCell?: BaseTooltipConfig<T, Icon, Text>;

  /**
   * Tooltip 角头单元格配置
   */
  cornerCell?: BaseTooltipConfig<T, Icon, Text>;

  /**
   * Tooltip 数值单元格配置
   */
  dataCell?: BaseTooltipConfig<T, Icon, Text>;
}

export interface TooltipOperation<Icon = Element | string, Text = string>
  extends TooltipOperatorOptions<Icon, Text> {
  /**
   * 隐藏列 (叶子节点有效)
   */
  hiddenColumns?: boolean;

  /**
   * 透视表组内排序
   */
  sort?: boolean;

  /**
   * 明细表排序
   */
  tableSort?: boolean;
}

export interface AutoAdjustPositionOptions {
  position: TooltipPosition;
  tooltipContainer: HTMLElement;
  spreadsheet: SpreadSheet;
  autoAdjustBoundary: TooltipAutoAdjustBoundary;
}
