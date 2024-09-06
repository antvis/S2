import type {
  BaseDrillDownComponentProps,
  BaseDrillDownDataSet,
} from '@antv/s2-shared';

export interface DrillDownDataSet extends BaseDrillDownDataSet {
  icon?: React.ReactNode;
}

export interface DrillDownProps
  extends BaseDrillDownComponentProps<DrillDownDataSet, React.ReactNode> {
  extra?: React.ReactNode;
}
