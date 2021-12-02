import React from 'react';
import { merge } from 'lodash';
import { DEFAULT_OPTIONS, S2Options } from '@antv/s2';
import { SHEET_COMPONENT_DEFAULT_OPTIONS } from '@/common/constant';

export const getSheetComponentOptions = (
  ...options: Partial<S2Options<React.ReactNode>>[]
) => merge({}, DEFAULT_OPTIONS, SHEET_COMPONENT_DEFAULT_OPTIONS, ...options);
