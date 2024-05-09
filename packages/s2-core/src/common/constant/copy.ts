export enum CopyType {
  ALL,
  COL,
  ROW,
}

export const LINE_SEPARATOR = '\r\n';

export const TAB_SEPARATOR = '\t';

export const CSV_SEPARATOR = ',';

// 每次异步渲染数据的阈值
export const AsyncRenderThreshold = 5000;

// 选择异步请求的阈值
export const AsyncRequestThreshold = 100000;
