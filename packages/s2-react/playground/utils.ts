/* eslint-disable no-restricted-imports */
/* eslint-disable no-console */
import type { SpreadSheet } from '@antv/s2';
import _ from 'lodash';

export const onSheetMounted = (s2: SpreadSheet) => {
  console.log('onSheetMounted: ', s2);
  // @ts-ignore
  window.s2 = s2;
  // @ts-ignore
  window.g_instances = [s2.container];
  window._ = _;
};
