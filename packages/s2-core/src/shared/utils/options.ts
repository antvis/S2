import { DEFAULT_OPTIONS, type S2Options } from '../../common';
import { customMerge } from '../../utils';
import { SHEET_COMPONENT_DEFAULT_OPTIONS } from '../constant/option';

export const getBaseSheetComponentOptions = <Options = S2Options>(
  ...options: Partial<Options>[]
): Options =>
  customMerge<Options>(
    DEFAULT_OPTIONS,
    SHEET_COMPONENT_DEFAULT_OPTIONS,
    ...options,
  );
