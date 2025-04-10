import type { S2DataConfig } from '@antv/s2';
import {
  data,
  meta,
  fields,
  rowSubTotalsDimensions,
  colSubTotalsDimensions,
} from '../dataset/mock-dataset.json';

export const sheetDataCfg: S2DataConfig = {
  data,
  meta,
  fields,
};

export const subTotalsDimensions = {
  rowSubTotalsDimensions,
  colSubTotalsDimensions,
};
