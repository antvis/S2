import type { S2DataConfig } from '@antv/s2';
import {
  data,
  totalData,
  meta,
  fields,
  rowSubTotalsDimensions,
  colSubTotalsDimensions,
} from '../dataset/mock-dataset.json';

export const sheetDataCfg: S2DataConfig = {
  data,
  totalData,
  meta,
  fields,
};

export const subTotalsDimensions = {
  rowSubTotalsDimensions,
  colSubTotalsDimensions,
};
