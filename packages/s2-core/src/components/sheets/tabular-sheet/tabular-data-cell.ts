/**
 * Create By Yingying
 * On 2021-04-14
 */

import { Group } from '@antv/g-canvas';
import { ViewMeta } from '../../../common/interface';
import { CustomCell } from './custom-cell';
export const TabularDataCell = (viewMeta: ViewMeta): Group => new CustomCell(viewMeta, viewMeta.spreadsheet);
