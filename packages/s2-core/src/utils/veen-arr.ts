type ArrayRangeType = [number, number];

/*
 * 数组范围交集，如果没有交集，则返回空数组
 * 例如：[1,5], [2,6] -> [2,5]
 */
export function vennArr(arr1: ArrayRangeType, arr2: ArrayRangeType) {
  const min = Math.max(arr1[0], arr2[0]);
  const max = Math.min(arr1[1], arr2[1]);

  return min <= max ? [min, max] : [];
}
