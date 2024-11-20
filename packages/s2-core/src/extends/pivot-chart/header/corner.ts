import type { PointLike } from '@antv/g-lite';
import {
  CornerNodeType,
  Node,
  CornerHeader as OriginCornerHeader,
  type BaseCornerOptions,
} from '@antv/s2';

export class CornerHeader extends OriginCornerHeader {
  public static getCornerNodes(
    options: BaseCornerOptions & {
      position: PointLike;
      width: number;
      height: number;
    },
  ): Node[] {
    const cornerNodes = super.getCornerNodes(options);
    // 创建角头区域竖轴

    const { seriesNumberWidth, layoutResult, spreadsheet } = options;

    const { rowsHierarchy, axisRowsHierarchy, colsHierarchy } = layoutResult;

    const rowAxisNode = axisRowsHierarchy?.sampleNodeForLastLevel;

    if (rowAxisNode) {
      const leafNode = colsHierarchy?.sampleNodeForLastLevel;

      const cornerNode = new Node({
        id: rowAxisNode.id,
        field: rowAxisNode.field,
        value: spreadsheet.dataSet.getFieldName(rowAxisNode.field),
        x: seriesNumberWidth + rowsHierarchy.width + rowAxisNode.x,
        y: leafNode?.y ?? 0,
        width: rowAxisNode.width,
        height:
          leafNode?.height ??
          spreadsheet.facet.getCellCustomSize(
            null,
            spreadsheet.options.style?.colCell?.height,
          ) ??
          0,

        isPivotMode: true,
        cornerType: CornerNodeType.Row,
        spreadsheet,
      });

      cornerNodes.push(cornerNode);
    }

    return cornerNodes;
  }
}
