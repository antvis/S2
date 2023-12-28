import type { S2TableSheetFrozenOptions } from '../../common/interface';
import type { Node } from '../../facet/layout/node';

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

export const getFrozenColWidth = (
  colLeafNodes: Node[],
  options: S2TableSheetFrozenOptions,
) => {
  const result = {
    colWidth: 0,
    trailingColWidth: 0,
  };

  if (!options.colCount && !options.trailingColCount) {
    return result;
  }

  const {
    colCount: frozenColCount = 0,
    trailingColCount: frozenTrailingColCount = 0,
  } = getValidFrozenOptions(options, colLeafNodes.length);

  for (let i = 0; i < frozenColCount; i++) {
    result.colWidth += colLeafNodes[i].width;
  }

  for (let i = 0; i < frozenTrailingColCount; i++) {
    result.trailingColWidth += colLeafNodes[colLeafNodes.length - 1 - i].width;
  }

  return result;
};
