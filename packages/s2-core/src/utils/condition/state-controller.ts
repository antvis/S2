import {
  DEFAULT_VALUE_RANGES,
  VALUE_RANGES_KEY,
} from '@/common/constant/condition';
import { ValueRanges } from '@/common/interface';
import { SpreadSheet } from '@/sheet-type';

/**
 * @desc clear all value ranges
 */
export const clearValueRangeState = (spreadsheet: SpreadSheet) => {
  spreadsheet.store.set(VALUE_RANGES_KEY, DEFAULT_VALUE_RANGES);
};

/**
 * @desc merge new value ranges with old values
 * @param spreadsheet sheet instance
 * @param updatedRanges updated value ranges
 */
export const setValueRangeState = (
  spreadsheet: SpreadSheet,
  updatedRanges: ValueRanges,
) => {
  const valueRanges = spreadsheet.store.get(
    VALUE_RANGES_KEY,
    DEFAULT_VALUE_RANGES,
  );
  spreadsheet.store.set(VALUE_RANGES_KEY, { ...valueRanges, ...updatedRanges });
};

/**
 * @desc get target value ranges
 * @param spreadsheet sheet instance
 * @param valueField target field
 */
export const getValueRangeState = (
  spreadsheet: SpreadSheet,
  valueField: string,
) => {
  const valueRanges = spreadsheet.store.get(
    VALUE_RANGES_KEY,
    DEFAULT_VALUE_RANGES,
  );
  return valueRanges[valueField];
};
