import { isEmpty } from 'lodash';

export type Indexes = [number, number, number, number];

export type PanelIndexes = {
  center: Indexes;
  frozenRow?: Indexes;
  frozenCol?: Indexes;
  frozenTrailingRow?: Indexes;
  frozenTrailingCol?: Indexes;
};

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

  for (let i = minI; i <= maxI; i += 1) {
    for (let j = minJ; j <= maxJ; j += 1) {
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
  if (isEmpty(sourceIndexes)) {
    if (isEmpty(targetIndexes)) {
      // 都为空
      return { add, remove };
    }
    // target 不为空
    return { add: allIndexes(targetIndexes), remove };
  }

  // source 不为空，target 为空
  if (isEmpty(targetIndexes)) {
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
  for (let i = targetMinI; i <= targetMaxI; i += 1) {
    for (let j = targetMinJ; j <= targetMaxJ; j += 1) {
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

/**
 * 计算 Panel 下所有子 Group的 Indexes Diff
 */
export const diffPanelIndexes = (
  sourceIndexes: PanelIndexes,
  targetIndexes: PanelIndexes,
): Diff => {
  const allAdd = [];
  const allRemove = [];

  Object.keys(targetIndexes).forEach((key) => {
    const { add, remove } = diffIndexes(
      sourceIndexes?.[key] || [],
      targetIndexes[key],
    );
    allAdd.push(...add);
    allRemove.push(...remove);
  });

  return {
    add: allAdd,
    remove: allRemove,
  };
};
