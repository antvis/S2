import type { Pagination, S2Options } from '@antv/s2';
import type {
  PartDrillDown as BasePartDrillDown,
  BaseSheetComponentProps,
} from '@antv/s2-shared';
import type { PaginationProps as AntdPaginationProps } from 'antd';
import type { ReactNode } from 'react';
import type { DrillDownProps } from '../drill-down';
import type { HeaderBaseProps } from '../header';
import type { TooltipOperatorMenuOptions } from '../tooltip/interface';

export type PartDrillDown = BasePartDrillDown<DrillDownProps>;

export type SheetComponentOptions = S2Options<
  ReactNode,
  Pagination & AntdPaginationProps,
  TooltipOperatorMenuOptions
>;

export type SheetComponentsProps = BaseSheetComponentProps<
  PartDrillDown,
  HeaderBaseProps,
  SheetComponentOptions
> & { children?: React.ReactNode };
