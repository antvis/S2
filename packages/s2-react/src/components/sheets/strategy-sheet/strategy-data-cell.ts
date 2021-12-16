import type { S2CellType, ViewMeta } from '@antv/s2';
import { CustomDataCell } from './custom-data-cell';

export const StrategyDataCell = (viewMeta: ViewMeta): S2CellType =>
  new CustomDataCell(viewMeta, viewMeta.spreadsheet);
