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
} from 'src/common/interface';
import { DrillDownProps } from 'src/components/drill-down';
import { HeaderCfgProps } from 'src/components/header';
import { Node, SpreadSheet, ThemeCfg } from 'src/index';
import { Event } from '@antv/g-canvas';

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
  customDisplayByRowName?: {
    // The names of row header labels.
    // Using the ID_SEPARATOR('[&]') to join two labels when there are hierarchical relations between them.
    rowNames: string[];
    // omit(default): the all levels included in rowNames would hide the drill down icon.
    // pick: only show the drill down icon on the levels those included in rowNames.
    mode: 'pick' | 'omit';
  };
  fetchData: (meta: Node, drillFields: string[]) => Promise<PartDrillDownInfo>;
}

export interface BaseSheetProps {
  spreadsheet?: (...args: S2Constructor) => SpreadSheet;
  dataCfg: S2DataConfig;
  options: S2Options;
  isLoading?: boolean;
  partDrillDown?: PartDrillDown;
  adaptive?: boolean;
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
  onColCellClick?: (data: TargetCellInfo) => void;
  onCornerCellClick?: (data: TargetCellInfo) => void;
  onDataCellClick?: (data: TargetCellInfo) => void;
  onDataCellMouseUp?: (data: TargetCellInfo) => void;
  onMergedCellsClick?: (data: TargetCellInfo) => void;
  getSpreadsheet?: (spreadsheet: SpreadSheet) => void;
}
