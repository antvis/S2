import type {
  CellCallback,
  CornerHeaderCallback,
  DataCellCallback,
  FrameCallback,
  MergedCellInfo,
  Pagination,
  Totals,
} from '../../common/interface/basic';
import type {
  LayoutArrange,
  LayoutCoordinate,
  LayoutDataPosition,
  LayoutHierarchy,
  LayoutSeriesNumberNodes,
} from '../../common/interface/hooks';
import type { BaseDataSet } from '../../data-set';
import type {
  BaseHeaderConfig,
  ColHeaderConfig,
  CornerHeaderConfig,
  RowHeaderConfig,
} from '../../facet/header/interface';
import type { SpreadSheet } from '../../sheet-type';
import type { CustomSVGIcon, HeaderActionIcon } from './basic';
import type { Conditions } from './condition';
import type { InteractionOptions } from './interaction';
import type { S2Style } from './style';
import type { Tooltip, TooltipContentType } from './tooltip';

export interface S2BasicOptions<
  T = TooltipContentType,
  P = Pagination,
  Icon = Element | string,
  Text = string,
> {
  /**
   * 表格宽度
   */
  width?: number;
  /**
   * 表格高度
   */
  height?: number;
  /**
   * 开启调试模式
   */
  debug?: boolean;
  /**
   * 字段标记
   */
  conditions?: Conditions | null;
  /**
   * 提示信息
   */
  tooltip?: Tooltip<T, Icon, Text> | null;
  /**
   * 交互配置
   */
  interaction?: InteractionOptions;
  /**
   * 分页配置
   */
  pagination?: P;
  /**
   * 自定义序号列文本, 默认为 "序号"
   */
  seriesNumberText?: string;
  /**
   * 是否显示序号
   */
  showSeriesNumber?: boolean;
  /**
   * 是否显示表头默认操作图标
   */
  showDefaultHeaderActionIcon?: boolean;
  /**
   * 自定义表头图标配置
   */
  headerActionIcons?: HeaderActionIcon[];
  /**
   * 自定义 SVG 图标
   */
  customSVGIcons?: CustomSVGIcon[];
  /**
   * 表格单元格宽高配置
   */
  style?: S2Style;
  /**
   * 是否开启高清适配
   */
  hdAdapter?: boolean;
  /**
   * 空值单元格占位符
   */
  placeholder?: ((meta: Record<string, any>) => string) | string;
  /**
   * 是否支持 CSS 的 transform 属性
   */
  supportCSSTransform?: boolean;
  /**
   * 自定义 DPR, 默认 "window.devicePixelRatio"
   */
  devicePixelRatio?: number;
  /**
   * 设备类型: pc / mobile
   */
  device?: DeviceType;

  /** *********** 自定义单元格 hooks **************** */
  /**
   * 自定义数值单元格
   */
  dataCell?: DataCellCallback;
  /**
   * 自定义角头单元格
   */
  cornerCell?: CellCallback<CornerHeaderConfig>;
  /**
   * 自定义序号单元格
   */
  seriesNumberCell?: CellCallback<BaseHeaderConfig>;
  /**
   * 自定义行头单元格
   */
  rowCell?: CellCallback<RowHeaderConfig>;
  /**
   * 自定义列头单元格
   */
  colCell?: CellCallback<ColHeaderConfig>;
  /**
   * 自定义表格框架/边框
   */
  frame?: FrameCallback;
  /**
   * 自定义角头
   */
  cornerHeader?: CornerHeaderCallback;

  /** *********** 自定义布局 hooks **************** */
  /**
   * 自定义单元格层级, 动态增加/删除单元格
   */
  layoutHierarchy?: LayoutHierarchy;
  /**
   * 自定义节点排列顺序 (树状模式有效)
   */
  layoutArrange?: LayoutArrange;
  /**
   * 自定义单元格对应节点坐标/宽高
   */
  layoutCoordinate?: LayoutCoordinate;
  /**
   * 自定义数据坐标, 动态修改单元格数值
   */
  layoutDataPosition?: LayoutDataPosition;
  /**
   * 自定义序号节点
   */
  layoutSeriesNumberNodes?: LayoutSeriesNumberNodes;
}

// 设备，pc || mobile
export enum DeviceType {
  PC = 'pc',
  MOBILE = 'mobile',
}

export interface S2TableSheetOptions {
  /**
   * 行头冻结数量
   */
  frozenRowCount?: number;
  /**
   * 列头冻结数量
   */
  frozenColCount?: number;
  /**
   * 行尾冻结数量
   */
  frozenTrailingRowCount?: number;
  /**
   * 列尾冻结数量
   */
  frozenTrailingColCount?: number;
}

export interface S2PivotSheetOptions {
  /**
   * 行头布局类型, grid: 平铺网格 | tree: 树状结构
   */
  hierarchyType?: 'grid' | 'tree';
  /**
   * 小计/总计配置
   */
  totals?: Totals | null;
  /**
   * 是否冻结行头
   */
  frozenRowHeader?: boolean;
  /**
   * 合并单元格配置
   */
  mergedCellsInfo?: MergedCellInfo[][];
  /**
   * 自定义角头文本
   */
  cornerText?: string;
  /**
   * 自定义数值虚拟字段文本, 默认 [数值]
   */
  cornerExtraFieldText?: string;
}

export interface S2Options<
  T = TooltipContentType,
  P = Pagination,
  Icon = Element | string,
  Text = string,
> extends S2BasicOptions<T, P, Icon, Text>,
    S2TableSheetOptions,
    S2PivotSheetOptions {
  /**
   * 自定义数据集
   */
  dataSet?: (spreadsheet: SpreadSheet) => BaseDataSet;
}

export interface S2RenderOptions {
  /**
   * 是否重新加载数据
   */
  reloadData?: boolean;
  /**
   * 是否重新生成数据集
   */
  reBuildDataSet?: boolean;
  /**
   * 是否重新生成列头隐藏信息
   */
  reBuildHiddenColumnsDetail?: boolean;
}
