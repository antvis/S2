import type { Node } from '@antv/s2';
import type { BaseSheetComponentProps } from '@antv/s2-shared';
import type { PaginationProps as AntdPaginationProps } from 'antd';
import type { DrillDownProps } from '../drill-down';
import type { HeaderCfgProps } from '../header';

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

export type SheetComponentsProps = BaseSheetComponentProps<
  PartDrillDown,
  HeaderCfgProps,
  AntdPaginationProps
>;
