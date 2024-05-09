import type { FrozenGroup } from '../../group/frozen-group';
import type { FrozenGroupPosition, FrozenGroupType } from '../constant/frozen';

export type FrozenGroupPositions = Record<
  FrozenGroupPosition,
  {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    range: number[];
  }
>;

export type FrozenGroups = Record<FrozenGroupType, FrozenGroup>;
