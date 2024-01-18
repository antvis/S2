import type { S2TableSheetFrozenOptions } from '../../common/interface';

export const getValidFrozenOptions = (
  defaultFrozenOptions: S2TableSheetFrozenOptions,
  colLength: number,
  dataLength = 0,
) => {
  // 如果没有传行列冻结选项，提前返回
  if (!Object.values(defaultFrozenOptions).find((item) => item > 0)) {
    return defaultFrozenOptions;
  }

  const frozenOptions: S2TableSheetFrozenOptions = {
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
