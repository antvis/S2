import type { ViewMeta } from '@antv/s2';
import { find } from 'lodash';

export const getLeafColNode = (meta: ViewMeta) =>
  find(meta.spreadsheet.facet.getColNodes(), {
    colIndex: meta.colIndex,
    isLeaf: true,
  });
