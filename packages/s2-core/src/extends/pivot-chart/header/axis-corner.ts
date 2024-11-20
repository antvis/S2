import type { PointLike } from '@antv/g-lite';
import {
  CornerBBox,
  CornerNodeType,
  Node,
  CornerHeader as OriginCornerHeader,
  PanelBBox,
  type BaseCornerOptions,
} from '@antv/s2';
import { AxisCornerCell } from '../cell/axis-corner-cell';

export class AxisCornerHeader extends OriginCornerHeader {
  /**
   * Get corner Header by config
   */
  public static getCornerHeader(
    options: BaseCornerOptions & {
      panelBBox: PanelBBox;
      cornerBBox: CornerBBox;
    },
  ) {
    const {
      panelBBox,
      cornerBBox,
      seriesNumberWidth,
      layoutResult,
      spreadsheet,
    } = options;
    const { y, viewportWidth, viewportHeight } = panelBBox;
    const { originalWidth: cornerOriginalWidth, width: cornerWidth } =
      cornerBBox;

    const { axisColsHierarchy } = layoutResult;

    const position = {
      x: cornerBBox.x,
      y: y + viewportHeight,
    };

    const height = axisColsHierarchy?.height ?? 0;

    const cornerNodes = this.getCornerNodes({
      position,
      width: cornerOriginalWidth,
      height,
      layoutResult,
      seriesNumberWidth,
      spreadsheet,
    });

    return new AxisCornerHeader({
      nodes: cornerNodes,
      position,
      width: cornerWidth,
      height,
      originalWidth: cornerOriginalWidth,
      originalHeight: height,
      viewportWidth,
      viewportHeight,
      seriesNumberWidth,
      spreadsheet,
    });
  }

  public static getCornerNodes(
    options: BaseCornerOptions & {
      position: PointLike;
      width: number;
      height: number;
    },
  ): Node[] {
    const cornerNodes = [];
    // 创建角头区域竖轴

    const { layoutResult, spreadsheet } = options;

    const { axisColsHierarchy } = layoutResult;

    const colAxisNode = axisColsHierarchy?.sampleNodeForLastLevel;

    if (colAxisNode) {
      const cornerNode = new Node({
        id: colAxisNode.id,
        field: colAxisNode.field,
        value: spreadsheet.dataSet.getFieldName(colAxisNode.field),
        x: 0,
        y: 0,
        width: spreadsheet.facet.cornerBBox.originalWidth,
        height: colAxisNode.height,
        isPivotMode: true,
        cornerType: CornerNodeType.Col,
        spreadsheet,
      });

      cornerNodes.push(cornerNode);
    }

    return cornerNodes;
  }

  protected getCellInstance(node: Node): any {
    const headerConfig = this.getHeaderConfig();
    const { spreadsheet } = headerConfig;
    const { axisCornerCell } = spreadsheet.options;

    return (
      axisCornerCell?.(node, spreadsheet, headerConfig) ||
      new AxisCornerCell(node, spreadsheet, headerConfig)
    );
  }
}
