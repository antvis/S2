import type { S2TableSheetOptions } from '../../common/interface';
import type { Node } from '../../facet/layout/node';
export const getValidFrozenOptions = (
  options: S2TableSheetOptions,
  colLength: number,
  dataLength = 0,
) => {
  // 如果没有传行列冻结选项，提前返回
  if (!Object.values(options).find((item) => item > 0)) {
    return options;
  }

  const newOptions: S2TableSheetOptions = {
    ...options,
  };

  if (newOptions.frozenColCount! >= colLength) {
    newOptions.frozenColCount = colLength;
  }

  const remainFrozenColCount = colLength - newOptions.frozenColCount!;

  if (newOptions.frozenTrailingColCount! > remainFrozenColCount) {
    newOptions.frozenTrailingColCount = remainFrozenColCount;
  }

  if (newOptions.frozenRowCount! >= dataLength) {
    newOptions.frozenRowCount = dataLength;
  }

  const remainFrozenRowCount = dataLength - newOptions.frozenRowCount!;
  if (newOptions.frozenTrailingRowCount! > remainFrozenRowCount) {
    newOptions.frozenTrailingRowCount = remainFrozenRowCount;
  }

  return newOptions;
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
