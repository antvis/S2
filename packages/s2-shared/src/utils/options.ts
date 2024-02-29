import { customMerge, DEFAULT_OPTIONS, type S2Options } from '@antv/s2';
import { SHEET_COMPONENT_DEFAULT_OPTIONS } from '../constant/option';

export const getBaseSheetComponentOptions = <Options = S2Options>(
  ...options: Partial<Options>[]
): Options =>
  customMerge<Options>(
    DEFAULT_OPTIONS,
    SHEET_COMPONENT_DEFAULT_OPTIONS,
    ...options,
  );
