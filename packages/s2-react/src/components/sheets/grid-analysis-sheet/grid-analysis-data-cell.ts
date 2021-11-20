import { Group } from '@antv/g-canvas';
import { ViewMeta } from '@antv/s2';
import { CustomCell } from './custom-cell';
export const GridAnalysisDataCell = (viewMeta: ViewMeta): Group =>
  new CustomCell(viewMeta, viewMeta.spreadsheet);
