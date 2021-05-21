import { S2DataConfig, S2Options } from 'src/common/interface';
import { DrillDownProps } from 'src/components/drill-down';
import { HeaderCfgProps } from 'src/components/header';
import { Node, SpreadSheet, SpreadSheetTheme } from "src/index";

export interface PartDrillDownInfo {
  // The data of drill down
  drillData: Record<string, string | number>[];
  // The field of drill down
  drillField: string;
}

export interface PartDrillDown {
  // Whether turn on the drill down feature
  open: boolean;
  // Clear the info of drill down
  clearDrillDown?: {
    rowId: string;
  };
  // The configuration of drill down
  drillConfig: DrillDownProps;
  // The numbers of drll down result
  drillItemsNum?: number;
  // Decide the drill down icon show in which levels according to the row header labels.
  customDisplayByRowName?: {
    // The names of row header labes.
    // Using the ID_SEPARATOR('[&]') to join two labels when there are hierarchical relations between them.
    rowNames: string[];
    // omit(default): the all levels included in rowNames would hide the drill down icon.
    // pick: only show the drill down icon on the levels those included in rowNames.
    mode: 'pick' | 'omit';
  };
  fetchData: (meta: Node, drillFields: string[]) => Promise<PartDrillDownInfo>;
}

export interface BaseSheetProps {
  spreadsheet?: (
    dom: string | HTMLElement,
    dataCfg: S2DataConfig,
    options: S2Options,
  ) => SpreadSheet;
  dataCfg: S2DataConfig;
  options: S2Options;
  isLoading?: boolean;
  partDrillDown?: PartDrillDown;
  adaptive?: boolean;
  theme?: SpreadSheetTheme;
  header?: HeaderCfgProps;
  rowLevel?: number;
  colLevel?: number;
  onListSort?: (params: { sortFieldId: string; sortMethod: string }) => void;
  onRowColLayout?: (rows, cols) => void;
  onRowCellScroll?: (reachedRow) => void;
  onColCellScroll?: (reachedCol) => void;
  onCellScroll?: (position: {
    scrollX: number;
    scrollY: number;
    thumbOffset: number;
  }) => void;
  onRowCellClick?: (value) => void;
  onColCellClick?: (value) => void;
  onCornerCellClick?: (value) => void;
  onDataCellClick?: (value) => void;
  getSpreadsheet?: (spreadsheet: SpreadSheet) => void;
}
