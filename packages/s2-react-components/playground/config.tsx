/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
import { type S2DataConfig } from '@antv/s2';
import type { SheetComponentOptions } from '@antv/s2-react';
import {
  data,
  fields,
  meta,
  totalData,
} from '@antv/s2/__tests__/data/mock-dataset.json';
import { Menu } from 'antd';
import React from 'react';

export const s2DataConfig: S2DataConfig = {
  data,
  totalData,
  meta,
  fields,
};

export const s2Options: SheetComponentOptions = {
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
  tooltip: {
    enable: true,
    operation: {
      menu: {
        render: (props) => <Menu {...props} />,
      },
    },
  },
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
