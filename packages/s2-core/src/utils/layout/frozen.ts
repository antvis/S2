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
  options: S2Options,
  dataLength: number = 0,
): Required<S2TableSheetFrozenOptions> => {
  /**
   * series number cell 可以自定义布局，和 row cell 不一定是 1 对 1 的关系
   * seriesNumber 暂时禁用 首行冻结
   * */
  const { frozen, seriesNumber } = options;

  if (seriesNumber?.enable) {
    return DEFAULT_FROZEN_COUNTS;
  }

  let rowCount = frozen?.rowCount ?? 0;
  let trailingRowCount = frozen?.trailingRowCount ?? 0;

  if (rowCount >= dataLength) {
    rowCount = dataLength;
  }

  const remainFrozenRowCount = dataLength - rowCount!;

  if (trailingRowCount > remainFrozenRowCount) {
    trailingRowCount = remainFrozenRowCount;
  }

  return {
    ...DEFAULT_FROZEN_COUNTS,
    rowCount,
    trailingRowCount,
  };
};
