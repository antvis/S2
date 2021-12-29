import {
  S2DataConfig,
  S2Options,
  CellScrollPosition,
  TargetCellInfo,
  LayoutCol,
  LayoutRow,
  ListSortParams,
  TargetLayoutNode,
  S2Constructor,
  Node,
  SpreadSheet,
  ThemeCfg,
  ViewMeta,
} from '@antv/s2';
import React from 'react';
import { DrillDownProps } from '@/components/drill-down';
import { HeaderCfgProps } from '@/components/header';

export type SheetType = 'pivot' | 'table' | 'gridAnalysis' | 'strategy';

export interface SheetComponentsProps extends BaseSheetComponentProps {
  sheetType?: SheetType;
}

export interface BaseSheetProps extends SheetComponentsProps {
  s2Ref?: React.MutableRefObject<SpreadSheet>;
  containerRef?: React.MutableRefObject<HTMLDivElement>;
  pagination?: {
    total: number;
    current: number;
    pageSize: number;
    setTotal: (value: number) => void;
    setCurrent: (value: number) => void;
    setPageSize: (value: number) => void;
  };
}

export interface PartDrillDownInfo {
  // The data of drill down
  drillData: Record<string, string | number>[];
  // The field of drill down
  drillField: string;
}

export interface PartDrillDown {
  // The configuration of drill down
  drillConfig: DrillDownProps;
  // The numbers of drill down result
  drillItemsNum?: number;
  fetchData: (meta: Node, drillFields: string[]) => Promise<PartDrillDownInfo>;
  // Clear the info of drill down
  clearDrillDown?: {
    rowId: string;
  };
  // Decide the drill down icon show conditions.
  displayCondition?: (meta: Node) => boolean;
}

// 用于和下钻组件进行交互联动
export interface PartDrillDownDataCache {
  // 执行下钻的行头id
  rowId: string;
  // 下钻的行头level
  drillLevel: number;
  // 下钻的维度
  drillField: string;
  // 下钻的数据
  drillData: Record<string, string | number>[];
}

export interface PartDrillDownFieldInLevel {
  // 下钻的维度
  drillField: string;
  // 下钻的层级
  drillLevel: number;
}

// 是否开启自适应宽高，并指定容器
export type Adaptive =
  | boolean
  | {
      width?: boolean;
      height?: boolean;
      getContainer?: () => HTMLElement;
    };

export interface BaseSheetComponentProps {
  spreadsheet?: (...args: S2Constructor) => SpreadSheet;
  dataCfg: S2DataConfig;
  options: S2Options;
  loading?: boolean;
  partDrillDown?: PartDrillDown;
  adaptive?: Adaptive;
  showPagination?: boolean;
  themeCfg?: ThemeCfg;
  header?: HeaderCfgProps;
  onLoad?: () => void;
  onDestroy?: () => void;
  onListSort?: (params: ListSortParams) => void;
  onRowColLayout?: (rows: LayoutRow[], cols: LayoutCol[]) => void;
  onRowCellScroll?: (reachedRow: TargetLayoutNode) => void;
  onColCellScroll?: (reachedCol: TargetLayoutNode) => void;
  onCellScroll?: (position: CellScrollPosition) => void;
  onRowCellClick?: (data: TargetCellInfo) => void;
  onRowCellDoubleClick?: (data: TargetCellInfo) => void;
  onColCellClick?: (data: TargetCellInfo) => void;
  onColCellDoubleClick?: (data: TargetCellInfo) => void;
  onCornerCellClick?: (data: TargetCellInfo) => void;
  onDataCellClick?: (data: TargetCellInfo) => void;
  onDataCellDoubleClick?: (data: TargetCellInfo) => void;
  onDataCellMouseUp?: (data: TargetCellInfo) => void;
  onDataCellTrendIconClick?: (meta: ViewMeta) => void;
  onMergedCellClick?: (data: TargetCellInfo) => void;
  onMergedCellsDoubleClick?: (data: TargetCellInfo) => void;
  onContextMenu?: (data: TargetCellInfo) => void;
  onRowCellHover?: (data: TargetCellInfo) => void;
  onColCellHover?: (data: TargetCellInfo) => void;
  onDataCellHover?: (data: TargetCellInfo) => void;
  onMergedCellHover?: (data: TargetCellInfo) => void;
  onCornerCellDoubleClick?: (data: TargetCellInfo) => void;
  onCornerCellHover?: (data: TargetCellInfo) => void;
  getSpreadSheet?: (spreadsheet: SpreadSheet) => void;
}
