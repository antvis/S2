import type { DataCell, HeaderCell } from '../../cell';
import type { RawData } from './s2DataConfig';
import type { TextTheme } from './theme';

export interface ValueRange {
  minValue?: number;
  maxValue?: number;
}

export type ValueRanges = Record<string, ValueRange>;

export type TextConditionMappingResult = TextTheme;

export type BackgroundConditionMappingResult = {
  fill: string;
  /**
   * @description only used in background condition, when the background color is too light, the font color will be white
   * @version 1.34.0
   */
  intelligentReverseTextColor?: boolean;
};

export type IconConditionMappingResult = {
  fill: string;
  icon: string;
};

export type IntervalConditionMappingResult = {
  fill?: string;
  isCompare?: boolean;
  /**
   * @description custom the interval condition's width
   * @version 1.38.0
   */
  fieldValue?: number | string;
} & ValueRange;

export type ConditionMappingResult<T = unknown> = T | undefined | null;

export type ConditionMapping<T = unknown> = (
  fieldValue: number | string,
  data: RawData,
  cell?: DataCell | HeaderCell,
) => ConditionMappingResult<T>;

/**
 * One field can hold a condition
 */
export interface Condition<T = unknown> {
  field?: string | RegExp;
  mapping: ConditionMapping<T>;
}

export type TextCondition = Condition<TextConditionMappingResult>;
export type BackgroundCondition = Condition<BackgroundConditionMappingResult>;
export type IntervalCondition = Condition<IntervalConditionMappingResult>;

export type IconPosition = 'left' | 'right';
export interface IconCondition extends Condition<IconConditionMappingResult> {
  // right by default
  position?: IconPosition;
}

export interface Conditions {
  text?: TextCondition[];
  background?: BackgroundCondition[];
  interval?: IntervalCondition[];
  icon?: IconCondition[];
}
