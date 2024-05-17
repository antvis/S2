import type { FrozenGroup } from '../../group/frozen-group';
import type { FrozenGroupArea, FrozenGroupType } from '../constant/frozen';

export type FrozenGroupAreas = Record<
  FrozenGroupArea,
  {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    range: number[];
  }
>;

export type FrozenGroups = Record<FrozenGroupType, FrozenGroup>;
