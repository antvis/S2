import { IconTheme } from './theme';

export interface MappingResult {
  // only used in icon condition
  icon?: string;
  // interval, background, text fill color
  fill: string;
  // only used in interval condition
  isCompare?: boolean;
  minValue?: number;
  maxValue?: number;
}

export type MappingFunction = (
  fieldValue: number,
  data: Record<string, any>,
) => MappingResult;

/**
 * One field can hold a condition
 */
export interface Condition {
  readonly field: string;
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

export type ConditionLayer = keyof Conditions;
