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
