/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
import { EMPTY_PLACEHOLDER, ResizeType, type S2DataConfig } from '@antv/s2';
import type { SheetComponentOptions } from '@antv/s2-react';
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

export const s2Options: SheetComponentOptions = {
  debug: false,
  width: 800,
  height: 600,
  hierarchyType: 'grid',
  placeholder: {
    cell: EMPTY_PLACEHOLDER,
    empty: {
      icon: 'Empty',
      description: '暂无数据',
    },
  },
  seriesNumber: {
    enable: false,
  },
  transformCanvasConfig() {
    return {
      supportsCSSTransform: true,
      // devicePixelRatio: 3,
      // cursor: 'crosshair',
    };
  },
  frozen: {
    rowHeader: true,
    // rowCount: 1,
    // trailingRowCount: 1,
    // colCount: 1,
    // trailingColCount: 1,
  },
  cornerText: '测试测试测试测试测试测试测试测试测试测试',
  interaction: {
    copy: {
      enable: true,
      withFormat: true,
      withHeader: true,
    },
    hoverAfterScroll: true,
    hoverHighlight: true,
    selectedCellHighlight: true,
    selectedCellMove: true,
    rangeSelection: true,
    // 防止 mac 触控板横向滚动触发浏览器返回, 和移动端下拉刷新
    overscrollBehavior: 'none',
    brushSelection: {
      dataCell: true,
      colCell: true,
      rowCell: true,
    },
    resize: {
      rowResizeType: ResizeType.ALL,
      colResizeType: ResizeType.ALL,
    },
  },
  // totals: {
  //   col: {
  //     showGrandTotals: true,
  //     showSubTotals: false,
  //     reverseGrandTotalsLayout: true,
  //     reverseSubTotalsLayout: true,
  //     subTotalsDimensions: ['type'],
  //   },
  //   row: {
  //     showGrandTotals: true,
  //     showSubTotals: true,
  //     reverseGrandTotalsLayout: true,
  //     reverseSubTotalsLayout: true,
  //     subTotalsDimensions: ['province'],
  //   },
  // },
  // mergedCellsInfo: [
  //   [
  //     { colIndex: 1, rowIndex: 1, showText: true },
  //     { colIndex: 1, rowIndex: 2 },
  //   ],
  //   [
  //     { colIndex: 2, rowIndex: 1 },
  //     { colIndex: 2, rowIndex: 2, showText: true },
  //   ],
  // ],
  tooltip: {},
  style: {},
};
