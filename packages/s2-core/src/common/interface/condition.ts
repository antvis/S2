import type { RawData } from './s2DataConfig';
import type { IconTheme } from './theme';
import type { DataCell, HeaderCell } from '@/cell';


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

  /**
   * @description only used in background condition, when the background color is too light, the font color will be white
   * @version 1.34.0
   */
  intelligentReverseTextColor?: boolean;
  /**
   * @description custom the interval condition's width
   * @version 1.38.0
   */
  fieldValue?: number;
}

export type MappingFunction = (
  fieldValue: number | string,
  data: RawData,
  cell?: DataCell | HeaderCell,
) => MappingResult | undefined | null;

/**
 * One field can hold a condition
 */
export interface Condition {
  field?: string | RegExp;
  mapping: MappingFunction;
}

export type IconPosition = 'left' | 'right';

export interface IconCondition extends Condition {
  // right by default
  position?: IconPosition;
}

export interface Conditions {
  text?: Condition[];
  background?: Condition[];
  interval?: Condition[];
  icon?: IconCondition[];
}
