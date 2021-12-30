import { S2TableSheetOptions } from 'src/common/interface';

export const getValidFrozenOptions = (
  opts: S2TableSheetOptions,
  colLength: number,
  dataLength = 0,
) => {
  // 如果没有传行列冻结选项，提前返回
  if (!Object.values(opts).find((item) => item > 0)) {
    return opts;
  }

  const newOpts = {
    ...opts,
  };

  if (newOpts.frozenColCount >= colLength) {
    newOpts.frozenColCount = colLength;
  }

  const remainFrozenColCount = colLength - newOpts.frozenColCount;

  if (newOpts.frozenTrailingColCount > remainFrozenColCount) {
    newOpts.frozenTrailingColCount = remainFrozenColCount;
  }

  if (newOpts.frozenRowCount >= dataLength) {
    newOpts.frozenRowCount = dataLength;
  }

  const remainFrozenRowCount = dataLength - newOpts.frozenRowCount;
  if (newOpts.frozenTrailingRowCount > remainFrozenRowCount) {
    newOpts.frozenTrailingRowCount = remainFrozenRowCount;
  }

  return newOpts;
};
