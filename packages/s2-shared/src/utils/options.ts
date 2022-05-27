import { customMerge, DEFAULT_OPTIONS, type S2Options } from '@antv/s2';
import { SHEET_COMPONENT_DEFAULT_OPTIONS } from '../constant/option';

export const getBaseSheetComponentOptions = (
  ...options: Partial<S2Options<any>>[]
): S2Options =>
  customMerge(DEFAULT_OPTIONS, SHEET_COMPONENT_DEFAULT_OPTIONS, ...options);
