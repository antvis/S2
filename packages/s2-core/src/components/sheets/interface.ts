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
} from '@/common/interface';
import { DrillDownProps } from '@/components/drill-down';
import { HeaderCfgProps } from '@/components/header';
import { Node, SpreadSheet, ThemeCfg } from '@/index';

export type SheetType = 'pivot' | 'table' | 'tabular';
export interface SpreadsheetProps extends BaseSheetProps {
  sheetType?: SheetType;
}

export interface PartDrillDownInfo {
  // The data of drill down
  drillData: Record<string, string | number>[];
  // The field of drill down
  drillField: string;
}

export interface PartDrillDown {
  // Clear the info of drill down
  clearDrillDown?: {
    rowId: string;
  };
  // The configuration of drill down
  drillConfig: DrillDownProps;
  // The numbers of drill down result
  drillItemsNum?: number;
  // Decide the drill down icon show in which levels according to the row header labels.
  customDisplayByLabelName?: {
    // The names of row header labels.
    // Using the ID_SEPARATOR('[&]') to join two labels when there are hierarchical relations between them.
    labelNames: string[];
    // omit(default): the all levels included in rowNames would hide the drill down icon.
    // pick: only show the drill down icon on the levels those included in rowNames.
    mode: 'pick' | 'omit';
  };
  fetchData: (meta: Node, drillFields: string[]) => Promise<PartDrillDownInfo>;
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

export interface BaseSheetProps {
  spreadsheet?: (...args: S2Constructor) => SpreadSheet;
  dataCfg: S2DataConfig;
  options: S2Options;
  isLoading?: boolean;
  partDrillDown?: PartDrillDown;
  adaptive?: boolean;
  showDefaultPagination?: boolean;
  themeCfg?: ThemeCfg;
  header?: HeaderCfgProps;
  rowLevel?: number;
  colLevel?: number;
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
  onMergedCellsClick?: (data: TargetCellInfo) => void;
  onMergedCellsDoubleClick?: (data: TargetCellInfo) => void;
  onContextMenu?: (data: TargetCellInfo) => void;
  getSpreadsheet?: (spreadsheet: SpreadSheet) => void;
}
