/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { RuntimeOptions } from '@antv/g2/lib/api/runtime';

// @ts-ignore
declare module '@antv/s2' {
  interface S2PivotSheetOptions {
    chartSpec?: RuntimeOptions;
  }
}
