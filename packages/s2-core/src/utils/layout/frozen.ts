import type { S2TableSheetOptions } from '../../common/interface';
import type { Node } from '../../facet/layout/node';
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

export const getFrozenColWidth = (
  colLeafNodes: Node[],
  options: S2TableSheetOptions,
) => {
  const result = {
    frozenColWidth: 0,
    frozenTrailingColWidth: 0,
  };

  if (!options.frozenColCount && !options.frozenTrailingColCount) {
    return result;
  }

  const { frozenColCount, frozenTrailingColCount } = getValidFrozenOptions(
    options,
    colLeafNodes.length,
  );

  for (let i = 0; i < frozenColCount; i++) {
    result.frozenColWidth += colLeafNodes[i].width;
  }

  for (let i = 0; i < frozenTrailingColCount; i++) {
    result.frozenTrailingColWidth +=
      colLeafNodes[colLeafNodes.length - 1 - i].width;
  }

  return result;
};
