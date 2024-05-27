import { DEFAULT_FROZEN_COUNTS } from '../../common';
import type {
  S2Options,
  S2TableSheetFrozenOptions,
} from '../../common/interface';

export const getValidFrozenOptions = (
  defaultFrozenOptions: S2TableSheetFrozenOptions = {},
  colLength: number,
  dataLength = 0,
): Required<S2TableSheetFrozenOptions> => {
  const frozenOptions: Required<S2TableSheetFrozenOptions> = {
    ...DEFAULT_FROZEN_COUNTS,
    ...defaultFrozenOptions,
  };

  if (frozenOptions.colCount! >= colLength) {
    frozenOptions.colCount = colLength;
  }

  const remainFrozenColCount = colLength - frozenOptions.colCount!;

  if (frozenOptions.trailingColCount! > remainFrozenColCount) {
    frozenOptions.trailingColCount = remainFrozenColCount;
  }

  if (frozenOptions.rowCount! >= dataLength) {
    frozenOptions.rowCount = dataLength;
  }

  const remainFrozenRowCount = dataLength - frozenOptions.rowCount!;

  if (frozenOptions.trailingRowCount! > remainFrozenRowCount) {
    frozenOptions.trailingRowCount = remainFrozenRowCount;
  }

  return frozenOptions;
};

/**
 * get frozen options pivot-sheet (business limit)
 * @param options
 * @returns
 */
export const getValidFrozenOptionsForPivot = (
  frozen: Required<S2TableSheetFrozenOptions>,
  options: S2Options,
): Required<S2TableSheetFrozenOptions> => {
  /**
   * series number cell 可以自定义布局，和 row cell 不一定是 1 对 1 的关系
   * seriesNumber 暂时禁用 首行冻结
   * */
  const { seriesNumber, layoutSeriesNumberNodes } = options;

  if (seriesNumber?.enable && layoutSeriesNumberNodes) {
    return {
      ...frozen,
      rowCount: 0,
      trailingRowCount: 0,
    };
  }

  return frozen;
};
