import * as _ from 'lodash';

export type Indexes = [number, number, number, number];

export interface Diff {
  add: [number, number][];
  remove: [number, number][];
}

/**
 * 是否在 视窗索引范围中
 * @param x
 * @param y
 * @param indexes
 */
export const isXYInRange = (
  x: number,
  y: number,
  indexes: number[],
): boolean => {
  const [xMin, xMax, yMin, yMax] = indexes;

  return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
};

export const allIndexes = (indexes: Indexes) => {
  const [minI, maxI, minJ, maxJ] = indexes;
  const r = [];

  for (let i = minI; i <= maxI; i++) {
    for (let j = minJ; j <= maxJ; j++) {
      r.push([i, j]);
    }
  }

  return r;
};

/**
 * 计算两个 indexes 的 diff，获取 sourceIndexes -> targetIndexes 过程中新增的和移除的index
 * @param sourceIndexes
 * @param targetIndexes
 */
export const diffIndexes = (
  sourceIndexes: Indexes,
  targetIndexes: Indexes,
): Diff => {
  const add = [];
  const remove = [];

  // source 为空
  if (_.isEmpty(sourceIndexes)) {
    if (_.isEmpty(targetIndexes)) {
      // 都为空
      return { add, remove };
    }
    // target 不为空
    return { add: allIndexes(targetIndexes), remove };
  }

  // source 不为空，target 为空
  if (_.isEmpty(targetIndexes)) {
    return { add, remove: allIndexes(sourceIndexes) };
  }

  const [sourceMinI, sourceMaxI, sourceMinJ, sourceMaxJ] = sourceIndexes;
  const [targetMinI, targetMaxI, targetMinJ, targetMaxJ] = targetIndexes;

  // sourceIndexes -> targetIndexes 过程中，remove 掉的单元格
  for (let i = sourceMinI; i <= sourceMaxI; i++) {
    for (let j = sourceMinJ; j <= sourceMaxJ; j++) {
      if (!isXYInRange(i, j, targetIndexes)) {
        remove.push([i, j]);
      }
    }
  }

  // sourceIndexes -> targetIndexes 过程中，add 新增的单元格
  for (let i = targetMinI; i <= targetMaxI; i++) {
    for (let j = targetMinJ; j <= targetMaxJ; j++) {
      if (!isXYInRange(i, j, sourceIndexes)) {
        add.push([i, j]);
      }
    }
  }

  return {
    add,
    remove,
  };
};
