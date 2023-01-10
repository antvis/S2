import {
  type S2CellType,
  type RenderHandler,
  CellClipBox,
} from '../common/interface';

/**
 * @description 将外部以 g5.0 作为底层渲染引擎绘制的图形渲染进已挂载的单元格中。
 */

export const renderToMountedCell = (
  cell: S2CellType,
  render: RenderHandler,
  renderOptions?: Record<string, any>,
) => {
  const { fieldValue } = cell.getMeta();
  const { x, y, width, height } = cell.getBBoxByType(CellClipBox.CONTENT_BOX);

  render(
    {
      x,
      y,
      width,
      height,
      ...fieldValue,
      ...renderOptions,
    },
    { group: cell },
  );
};
