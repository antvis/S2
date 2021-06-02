/**
 * Create By Bruce Too
 * On 2019-10-28
 * can node be continue expanded
 * @param notLeaf if is last level in tree
 * @param isCollapse node is collapsed(use in tree mode)
 * @param isTotals  if is totals node
 */
export function canNodeBeExpanded(
  notLeaf: boolean,
  isCollapse: boolean,
  isTotals: boolean,
): boolean {
  return notLeaf && !isCollapse && !isTotals;
}
