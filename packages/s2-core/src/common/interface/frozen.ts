import type { FrozenGroup } from '../../group/frozen-group';
import type { FrozenGroupArea, FrozenGroupType } from '../constant/frozen';

export interface AreaBBox {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  range: number[];
}

export type FrozenGroupAreas = Record<FrozenGroupArea, AreaBBox>;

export type FrozenGroups = Record<FrozenGroupType, FrozenGroup>;
