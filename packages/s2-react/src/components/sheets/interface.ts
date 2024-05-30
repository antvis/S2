import type { Pagination, S2Options, SpreadSheet } from '@antv/s2';
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

export type SheetComponentProps = BaseSheetComponentProps<
  PartDrillDown,
  HeaderBaseProps,
  SheetComponentOptions
> & {
  children?: React.ReactNode;
  ref?:
    | React.MutableRefObject<SpreadSheet | undefined>
    | React.ForwardedRef<SpreadSheet>
    | undefined
    | null;
};
