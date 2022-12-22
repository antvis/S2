import {
  customMerge,
  DEFAULT_MOBILE_OPTIONS,
  DEFAULT_OPTIONS,
  type S2Options,
} from '@antv/s2';
import { SHEET_COMPONENT_DEFAULT_OPTIONS } from '../constant/option';

export const getBaseSheetComponentOptions = <Options = S2Options>(
  ...options: Partial<Options>[]
): Options => {
  return customMerge<Options>(
    DEFAULT_OPTIONS,
    SHEET_COMPONENT_DEFAULT_OPTIONS,
    ...options,
  );
};

export const getMobileSheetComponentOptions = <Options = S2Options>(
  ...options: Partial<Options>[]
): Options => {
  return customMerge<Options>(
    DEFAULT_OPTIONS,
    DEFAULT_MOBILE_OPTIONS,
    SHEET_COMPONENT_DEFAULT_OPTIONS,
    ...options,
  );
};
