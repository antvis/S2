import type { ViewMeta } from '@antv/s2';
import { find } from 'lodash';
import React from 'react';

export const useRowName = (meta: ViewMeta) => {
  const rowName = React.useMemo(() => {
    const currentRow = find(meta.spreadsheet.getRowNodes(), {
      rowIndex: meta.rowIndex,
    });

    return meta.spreadsheet.dataSet.getFieldName(
      currentRow?.valueFiled || currentRow?.value,
    );
  }, [meta]);

  return rowName;
};
