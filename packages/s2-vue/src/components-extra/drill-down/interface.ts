import type {
  BaseDrillDownComponentProps,
  BaseDrillDownDataSet,
} from '@antv/s2';

import type { VNode } from 'vue';

export interface DrillDownDataSet extends BaseDrillDownDataSet {
  icon?: VNode;
  disabled?: boolean;
}

export interface DrillDownProps
  extends BaseDrillDownComponentProps<DrillDownDataSet, VNode | string> {
  extra?: VNode | string;
  // renderMenu?: (props: MenuProps) => VNode; // Not easily supportable in Vue as prop, prefer slots
}
