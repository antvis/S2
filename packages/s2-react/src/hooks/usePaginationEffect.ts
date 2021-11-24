import React from 'react';
import { isEmpty, merge } from 'lodash';
import type { SpreadSheet, S2Options } from '@antv/s2';
import { getSafetyOptions } from '@antv/s2';

export const usePaginationEffect = (
  s2: SpreadSheet,
  options: S2Options,
  current: number,
  pageSize: number,
) => {
  React.useEffect(() => {
    if (!s2 || isEmpty(options?.pagination)) {
      return;
    }
    const newOptions = merge({}, options, {
      pagination: {
        current,
        pageSize,
      },
    });
    s2.setOptions(getSafetyOptions(newOptions));
    s2.render(false);
  }, [options, current, pageSize, s2]);
};
