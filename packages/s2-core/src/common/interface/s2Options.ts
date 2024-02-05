import type { CanvasConfig } from '@antv/g';
import type { CornerCell, RowCell, SeriesNumberCell } from '../../cell';
import type {
  CellCallback,
  CornerHeaderCallback,
  DataCellCallback,
  FrameCallback,
  MergedCellCallback,
  MergedCellInfo,
  Pagination,
  Totals,
} from '../../common/interface/basic';
import type {
  LayoutArrange,
  LayoutCellMeta,
  LayoutCoordinate,
  LayoutHierarchy,
  LayoutSeriesNumberNodes,
} from '../../common/interface/hooks';
import type { BaseDataSet } from '../../data-set';
import type { BaseFacet } from '../../facet';
import type {
  BaseHeaderConfig,
  ColHeaderConfig,
  CornerHeaderConfig,
  RowHeaderConfig,
} from '../../facet/header/interface';
import type { SpreadSheet } from '../../sheet-type';
import type { CustomSVGIcon, HeaderActionIcon } from './basic';
import type { Conditions } from './condition';
import type { InteractionOptions, S2CellType } from './interaction';
import type { S2Style } from './style';
import type {
  BaseTooltipOperatorMenuOptions,
  Tooltip,
  TooltipContentType,
} from './tooltip';

export interface S2BasicOptions<
  T = TooltipContentType,
  P = Pagination,
  Menu = BaseTooltipOperatorMenuOptions,
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
   * 开启调试模式 (打印额外信息)
   */
  debug?: boolean;

  /**
   * 字段标记
   * @see https://s2.antv.antgroup.com/manual/basic/conditions
   */
  conditions?: Conditions | null;

  /**
   * 提示信息
   * @see https://s2.antv.antgroup.com/manual/basic/tooltip
   */
  tooltip?: Tooltip<T, Menu> | null;

  /**
   * 交互配置
   * @see https://s2.antv.antgroup.com/manual/advanced/interaction/basic
   */
  interaction?: InteractionOptions;

  /**
   * 分页配置
   * @see https://s2.antv.antgroup.com/manual/advanced/analysis/pagination
   */
  pagination?: P;

  /**
   * 序号列配置
   * @see https://s2.antv.antgroup.com/manual/basic/sheet-type/pivot-mode#%E5%BA%8F%E5%8F%B7
   */
  seriesNumber?: {
    /**
     * 是否显示序号
     */
    enable?: boolean;

    /**
     * 自定义序号列文本, 默认为 "序号"
     */
    text?: string;
  };

  /**
   * 是否显示表头默认操作图标
   */
  showDefaultHeaderActionIcon?: boolean;

  /**
   * 自定义表头图标配置
   * @see https://s2.antv.antgroup.com/manual/advanced/custom/custom-icon
   */
  headerActionIcons?: HeaderActionIcon[];

  /**
   * 自定义 SVG 图标
   * @see https://s2.antv.antgroup.com/manual/advanced/custom/custom-icon
   */
  customSVGIcons?: CustomSVGIcon[];

  /**
   * 表格单元格宽高配置
   * @see https://s2.antv.antgroup.com/manual/advanced/custom/cell-size
   */
  style?: S2Style;

  /**
   * 是否开启高清适配
   * @see https://s2.antv.antgroup.com/manual/advanced/hd-adapter
   */
  hd?: boolean;

  /**
   * 空值单元格占位符
   * @see https://s2.antv.antgroup.com/zh/examples/custom/custom-cell/#data-cell-placeholder
   */
  placeholder?:
    | ((meta: Record<string, any>) => string | undefined | null)
    | string
    | undefined
    | null;

  /**
   * 设备类型: pc / mobile
   */
  device?: DeviceType;

  /**
   * 自定义 AntV/G 渲染引擎配置参数 & 插件注册
   * @see https://g.antv.antgroup.com/plugins/intro
   * @see https://g.antv.antgroup.com/api/canvas/options
   * @see https://s2.antv.antgroup.com/examples/custom/custom-plugins/#a11y
   * @example
    import { Plugin as PluginA11y } from '@antv/g-plugin-a11y';

    transformCanvasConfig(renderer) {
      console.log('当前已注册插件：', renderer.getPlugins(), renderer.getConfig());
      renderer.registerPlugin(new PluginA11y({ enableExtractingText: true }));

      return {
        supportsCSSTransform: true,
      };
    },
   */
  transformCanvasConfig?: (
    renderer: CanvasConfig['renderer'],
    spreadsheet: SpreadSheet,
  ) => (Partial<CanvasConfig> | null | undefined) | void;

  /** *********** 自定义单元格 hooks **************** */
  /**
   * 自定义数值单元格
   * @see https://s2.antv.antgroup.com/examples/custom/custom-cell#data-cell
   */
  dataCell?: DataCellCallback;

  /**
   * 自定义角头单元格
   * @see https://s2.antv.antgroup.com/examples/custom/custom-cell#corner-cell
   */
  cornerCell?: CellCallback<CornerHeaderConfig, CornerCell>;

  /**
   * 自定义序号单元格
   * @see https://s2.antv.antgroup.com/examples/custom/custom-cell#series-number-cell
   */
  seriesNumberCell?: CellCallback<BaseHeaderConfig, SeriesNumberCell>;

  /**
   * 自定义行头单元格
   * @see https://s2.antv.antgroup.com/examples/custom/custom-cell#row-cell
   */
  rowCell?: CellCallback<RowHeaderConfig, RowCell>;

  /**
   * 自定义列头单元格
   * @see https://s2.antv.antgroup.com/examples/custom/custom-cell#col-cell
   */
  colCell?: CellCallback<ColHeaderConfig, S2CellType>;

  /**
   * 自定义合并单元格
   * @see https://s2.antv.antgroup.com/examples/custom/custom-cell/#custom-merged-cell
   */
  mergedCell?: MergedCellCallback;

  /**
   * 自定义表格框架/边框
   * @see https://s2.antv.antgroup.com/examples/case/comparison#measure-comparison
   */
  frame?: FrameCallback;

  /**
   * 自定义角头
   * @see https://s2.antv.antgroup.com/zh/examples/custom/custom-cell/#corner-header
   */
  cornerHeader?: CornerHeaderCallback;

  /** *********** 自定义布局 hooks **************** */
  /**
   * 自定义单元格层级, 动态增加/删除单元格
   * @see https://s2.antv.antgroup.com/examples/custom/custom-layout#custom-layout-hierarchy
   */
  layoutHierarchy?: LayoutHierarchy;

  /**
   * 自定义节点排列顺序 (树状模式有效)
   * @see https://s2.antv.antgroup.com/examples/custom/custom-layout/#custom-layout-arrange
   */
  layoutArrange?: LayoutArrange;

  /**
   * 自定义单元格节点坐标
   * @see https://s2.antv.antgroup.com/examples/custom/custom-layout/#custom-coordinate
   */
  layoutCoordinate?: LayoutCoordinate;

  /**
   * 自定义单元格对应元数据
   * @see https://s2.antv.antgroup.com/examples/custom/custom-layout/#custom-layout-cell-meta
   */
  layoutCellMeta?: LayoutCellMeta;

  /**
   * 自定义序号节点
   * @see https://s2.antv.antgroup.com/examples/custom/custom-cell/#series-number-cell
   */
  layoutSeriesNumberNodes?: LayoutSeriesNumberNodes;

  /** *********** 数据集 **************** */
  /**
   * 自定义数据集
   * @see https://s2.antv.antgroup.com/examples/custom/custom-dataset/#custom-strategy-sheet-dataset
   */
  dataSet?: (spreadsheet: SpreadSheet) => BaseDataSet;

  /**
   * 自定义分面
   * @see https://s2.antv.antgroup.com/examples/custom/custom-layout/#custom-facet
   */
  facet?: (spreadsheet: SpreadSheet) => BaseFacet;
}

// 设备，pc || mobile
export enum DeviceType {
  PC = 'pc',
  MOBILE = 'mobile',
}

export interface S2PivotSheetFrozenOptions {
  /**
   * 是否冻结行头 (含角头区域, 透视表有效),
   * 当值为 number 时，标识行头冻结的最大区域，取值范围： (0, 1)，0 表示不固定行头
   * 当值为 boolean 时，true 对应冻结最大区域为 0.5, false 对应 0
   */
  rowHeader?: boolean | number;

  /**
   * 是否冻结首行 (适用于总计置于顶部, 树状模式等场景)
   */
  firstRow?: boolean;
}

export interface S2TableSheetFrozenOptions {
  /**
   * 行头冻结数量 (明细表有效)
   */
  rowCount?: number;

  /**
   * 列头冻结数量 (明细表有效)
   */
  colCount?: number;

  /**
   * 行尾冻结数量 (明细表有效)
   */
  trailingRowCount?: number;

  /**
   * 列尾冻结数量 (明细表有效)
   */
  trailingColCount?: number;
}

export type HierarchyType = 'grid' | 'tree';

export interface S2PivotSheetOptions {
  /**
   * 行头布局类型, grid: 平铺网格 | tree: 树状结构
   */
  hierarchyType?: HierarchyType;

  /**
   * 小计/总计配置
   * @see https://s2.antv.antgroup.com/manual/basic/totals
   */
  totals?: Totals | null;

  /**
   * 合并单元格配置
   * @see https://s2.antv.antgroup.com/manual/advanced/interaction/merge-cell
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
  Menu = BaseTooltipOperatorMenuOptions,
> extends S2BasicOptions<T, P, Menu>,
    S2PivotSheetOptions {
  /**
   * 行列冻结
   */
  frozen?: S2PivotSheetFrozenOptions & S2TableSheetFrozenOptions;
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
