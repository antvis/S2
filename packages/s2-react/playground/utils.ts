/* eslint-disable no-console */
import type { SpreadSheet } from '@antv/s2';

export const onSheetMounted = (s2: SpreadSheet) => {
  console.log('onSheetMounted: ', s2);
  // @ts-ignore
  window.s2 = s2;
  // @ts-ignore
  window.g_instances = [s2.container];
};
