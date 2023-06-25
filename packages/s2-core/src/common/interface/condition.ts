import type { IconTheme, TextTheme } from '..';
import type { RawData } from './s2DataConfig';

export interface ValueRange {
  minValue?: number;
  maxValue?: number;
}

export type ValueRanges = Record<string, ValueRange>;

export type ConditionMappingResult<T = unknown> = ValueRange &
  T & {
    // only used in icon condition
    icon?: string;
    // interval, background, text fill color
    fill?: string;
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
  };

export type ConditionMapping<T = unknown> = (
  fieldValue: number | string,
  data: RawData,
) => ConditionMappingResult<T> | undefined | null;

/**
 * One field can hold a condition
 */
export interface Condition<T = unknown> {
  field?: string | RegExp;
  mapping: ConditionMapping<T>;
}

export type IconPosition = 'left' | 'right';

export interface IconCondition extends Condition<IconTheme> {
  // right by default
  position?: IconPosition;
}

export interface TextCondition extends Condition<TextTheme> {
  // right by default
  position?: IconPosition;
}

export interface Conditions {
  text?: TextCondition[];
  background?: Condition[];
  interval?: Condition[];
  icon?: IconCondition[];
}
