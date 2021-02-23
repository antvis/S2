/**
 * Create By Bruce Too
 * On 2019-11-01
 */
export function isHeaderCellInViewport(
  gridPos,
  gridSize,
  viewportPos,
  viewportSize,
) {
  return (
    gridPos + gridSize >= viewportPos && viewportPos + viewportSize >= gridPos
  );
}
