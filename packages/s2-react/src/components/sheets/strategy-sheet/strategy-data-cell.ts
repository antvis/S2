import type { S2CellType, ViewMeta } from '@antv/s2';
import { CustomCell } from './custom-cell';

export const StrategyDataCell = (viewMeta: ViewMeta): S2CellType =>
  new CustomCell(viewMeta, viewMeta.spreadsheet);
