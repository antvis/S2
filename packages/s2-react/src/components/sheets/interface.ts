import type {
  BaseDrillDownComponentProps,
  BaseDrillDownDataSet,
  PartDrillDown as BasePartDrillDown,
  BaseSheetComponentProps,
  Pagination,
  S2Options,
  SpreadSheet,
} from '@antv/s2';
import type { ReactNode } from 'react';
import type { usePagination } from '../../hooks/usePagination';
import type { TooltipOperatorMenuOptions } from '../tooltip/interface';

export interface DrillDownDataSet extends BaseDrillDownDataSet {
  icon?: React.ReactNode;
}

export interface DrillDownProps
  extends BaseDrillDownComponentProps<DrillDownDataSet, React.ReactNode> {
  extra?: React.ReactNode;
}

export type PartDrillDown = BasePartDrillDown<DrillDownProps> & {
  /**
   * 指定下钻 UI 组件
   */
  render: (props: DrillDownProps) => React.ReactNode;
};

export type SheetComponentOptions = S2Options<
  ReactNode,
  Pagination,
  TooltipOperatorMenuOptions
>;

export type SheetComponentChildrenOptions = {
  pagination: ReturnType<typeof usePagination>;
};

export type SheetComponentProps = BaseSheetComponentProps<
  PartDrillDown,
  SheetComponentOptions
> & {
  children?:
    | React.ReactNode
    | ((options: SheetComponentChildrenOptions) => React.ReactNode);
  ref?:
    | React.MutableRefObject<SpreadSheet | undefined>
    | React.ForwardedRef<SpreadSheet>
    | undefined
    | null;
};
