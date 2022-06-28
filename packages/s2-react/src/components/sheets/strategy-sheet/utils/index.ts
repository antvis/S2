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

export const getColName = (meta: ViewMeta) => {
  const leafColNode = getLeafColNode(meta);

  // 兼容多列头, 优先取父级节点标题
  return leafColNode?.parent?.label || leafColNode?.label || '';
};
