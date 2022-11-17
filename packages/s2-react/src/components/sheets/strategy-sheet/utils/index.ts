import type { ViewMeta } from '@antv/s2';
import { find } from 'lodash';

export const getLeafColNode = (meta: ViewMeta) => {
  return find(meta.spreadsheet.getColumnNodes(), {
    colIndex: meta.colIndex,
    isLeaf: true,
  });
};

export const getRowName = (meta: ViewMeta) => {
  const currentRow = find(meta.spreadsheet.getRowNodes(), {
    rowIndex: meta.rowIndex,
  });
  return meta.spreadsheet.dataSet.getFieldName(
    currentRow?.valueFiled || currentRow?.value,
  );
};

export const getRowDescription = (meta: ViewMeta): string => {
  const currentRow = find(meta.spreadsheet.getRowNodes(), {
    rowIndex: meta.rowIndex,
  });
  return (
    meta.spreadsheet.dataSet.getFieldDescription(currentRow?.field) ||
    currentRow?.extra?.description
  );
};
