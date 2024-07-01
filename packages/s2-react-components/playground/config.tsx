/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
import { type S2DataConfig, type S2Options } from '@antv/s2';
import {
  data,
  fields,
  meta,
  totalData,
} from '@antv/s2/__tests__/data/mock-dataset.json';

export const s2DataConfig: S2DataConfig = {
  data,
  totalData,
  meta,
  fields,
};

export const s2Options: S2Options = {
  debug: false,
  width: 800,
  height: 600,
  hierarchyType: 'grid',
  frozen: {
    rowHeader: true,
  },
  interaction: {
    // 防止 mac 触控板横向滚动触发浏览器返回, 和移动端下拉刷新
    overscrollBehavior: 'none',
  },
  tooltip: {},
  style: {
    colCell: {
      width: 120,
    },
    dataCell: {
      width: 200,
      height: 100,
    },
  },
};
