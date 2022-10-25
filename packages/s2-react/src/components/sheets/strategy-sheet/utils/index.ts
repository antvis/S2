import type { ViewMeta } from '@antv/s2';
import { find } from 'lodash';

export const getLeafColNode = (meta: ViewMeta) => {
  return find(meta.spreadsheet.getColumnNodes(), {
    colIndex: meta.colIndex,
    isLeaf: true,
  });
};
