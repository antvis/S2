import { IconTheme } from './theme';

export interface ValueRange {
  minValue?: number;
  maxValue?: number;
}

export type ValueRanges = Record<string, ValueRange>;

export enum RangeDirection {
  // 计算行的最大最小值
  COL = 'col',
  // 计算列的最大最小值
  ROW = 'row',
}

export interface MappingResult extends ValueRange {
  // only used in icon condition
  icon?: string;
  // interval, background, text fill color
  fill: string;
  // only used in interval condition
  isCompare?: boolean;
  // only used in interval condition
  rangeDirection?: RangeDirection;
}

export type MappingFunction = (
  fieldValue: number,
  data: Record<string, any>,
) => MappingResult;

/**
 * One field can hold a condition
 */
export interface Condition {
  readonly field: string | RegExp;
  readonly mapping: MappingFunction;
}

type IconPosition = 'left' | 'right';

export interface IconCondition extends Condition {
  readonly position?: IconPosition; // right by default
}

export interface Conditions {
  readonly text?: Condition[];
  readonly background?: Condition[];
  readonly interval?: Condition[];
  readonly icon?: IconCondition[];
}

export type IconCfg = Pick<IconTheme, 'size' | 'margin'> &
  Pick<IconCondition, 'position'>;
