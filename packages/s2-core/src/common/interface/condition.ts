import type { IconTheme } from './theme';

export interface ValueRange {
  minValue?: number;
  maxValue?: number;
}

export type ValueRanges = Record<string, ValueRange>;

export interface MappingResult extends ValueRange {
  // only used in icon condition
  icon?: string;
  // interval, background, text fill color
  fill: string;
  // only used in interval condition
  isCompare?: boolean;
  // negative value interval fill color
  negativeFill?: string;
}

export type MappingFunction = (
  fieldValue: number | string,
  data: Record<string, any>,
) => MappingResult;

/**
 * One field can hold a condition
 */
export interface Condition {
  field: string | RegExp;
  mapping: MappingFunction;
}

export type IconPosition = 'left' | 'right';

export interface IconCondition extends Condition {
  position?: IconPosition; // right by default
}

export interface Conditions {
  // distinct negative and positive value, and use different direction interval
  enableNegativeInterval?: boolean;
  text?: Condition[];
  background?: Condition[];
  interval?: Condition[];
  icon?: IconCondition[];
}

export type IconCfg = Pick<IconTheme, 'size' | 'margin'> &
  Pick<IconCondition, 'position'>;
