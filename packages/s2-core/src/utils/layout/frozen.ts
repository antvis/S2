import type { S2TableSheetOptions } from '../../common/interface';
import type { Node } from '../../facet/layout/node';

export const getValidFrozenOptions = (
  s2Options: S2TableSheetOptions,
  colLength: number,
  dataLength = 0,
) => {
  // 如果没有传行列冻结选项，提前返回
  if (!Object.values(s2Options).find((item) => item > 0)) {
    return s2Options;
  }

  const newOptions: S2TableSheetOptions = {
    ...s2Options,
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

  const { frozenColCount = 0, frozenTrailingColCount = 0 } =
    getValidFrozenOptions(options, colLeafNodes.length);

  for (let i = 0; i < frozenColCount; i++) {
    result.frozenColWidth += colLeafNodes[i].width;
  }

  for (let i = 0; i < frozenTrailingColCount; i++) {
    result.frozenTrailingColWidth +=
      colLeafNodes[colLeafNodes.length - 1 - i].width;
  }

  return result;
};
