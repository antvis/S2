import type { Pagination, S2Options } from '@antv/s2';
import type {
  BaseSheetComponentProps,
  PartDrillDown as BasePartDrillDown,
} from '@antv/s2-shared';
import type { PaginationProps as AntdPaginationProps } from 'antd';
import type { ReactNode } from 'react';
import type { DrillDownProps } from '../drill-down';
import type { HeaderCfgProps } from '../header';

export type PartDrillDown = BasePartDrillDown<DrillDownProps>;

export type SheetComponentOptions = S2Options<
  ReactNode,
  Pagination & AntdPaginationProps
>;

export type SheetComponentsProps = BaseSheetComponentProps<
  PartDrillDown,
  HeaderCfgProps,
  SheetComponentOptions
>;
