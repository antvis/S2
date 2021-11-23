import { merge } from 'lodash';
import { S2Options, DEFAULT_OPTIONS } from '@antv/s2';
import { REACT_DEFAULT_OPTIONS } from '@/common/constant';

export const getSafetyOptions = (options: Partial<S2Options>) =>
  merge({}, DEFAULT_OPTIONS, REACT_DEFAULT_OPTIONS, options);
