import { safeJsonParse } from '@antv/s2';
import { compact, concat } from 'lodash';
import React from 'react';
import {
  HISTORY_COLOR_LIST_MAX_COUNT,
  HISTORY_COLOR_LIST_STORAGE_KEY,
} from '../../../common/constants';

/**
 * 记录历史颜色
 */
export const useHistoryColorList = (
  color: string,
  maxCount: number = HISTORY_COLOR_LIST_MAX_COUNT,
) => {
  const colorList = React.useMemo(() => {
    try {
      const colorData =
        safeJsonParse<string[]>(
          localStorage.getItem(HISTORY_COLOR_LIST_STORAGE_KEY)!,
        ) ?? [];
      const nextColorData = compact(
        concat(
          color,
          colorData.filter((item) => item !== color),
        ),
      ).slice(0, maxCount);

      localStorage.setItem(
        HISTORY_COLOR_LIST_STORAGE_KEY,
        JSON.stringify(nextColorData),
      );

      return nextColorData as string[];
    } catch (err) {
      localStorage.setItem(HISTORY_COLOR_LIST_STORAGE_KEY, JSON.stringify([]));
    }

    return [];
  }, [color]);

  return colorList;
};
