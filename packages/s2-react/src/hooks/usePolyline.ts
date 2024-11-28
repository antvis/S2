import { Polyline } from '@antv/g';
import { Node, PivotSheet, SpreadSheet, TableSheet } from '@antv/s2';
import { get } from 'lodash';

// 存储已绘制的连接线，用于销毁
const dottedLines: Polyline[] = [];

export const usePolyline = () => {
  /**
   * 销毁已存在的虚线
   */
  const destroyDottedLines = (lines: Polyline[] = []) => {
    while (lines.length) {
      lines?.pop()?.destroy();
    }
  };

  /**
   * 获取列头的高度
   */
  const getColHeaderHeight = (chart: SpreadSheet | TableSheet | PivotSheet) => {
    return chart.facet.getColNodes(0)?.[0]?.hierarchy?.height;
  };

  /**
   * 获取滚动高度
   */
  const getOffsetHeight = (chart: SpreadSheet | TableSheet | PivotSheet) => {
    return chart.facet.getScrollOffset().scrollY;
  };
  /**
   * 获取树级行头嵌套深度
   */
  const getRowHeaderTreeDepth = (
    chart: SpreadSheet | TableSheet | PivotSheet,
  ) => {
    return chart.facet.getRowNodes(0)?.[0]?.hierarchy?.maxLevel;
  };
  /**
   * 获取视口高度（列头 + 数值区域）
   */
  const getViewportHeight = (chart: SpreadSheet | TableSheet | PivotSheet) => {
    return chart.facet.panelBBox.viewportHeight + getColHeaderHeight(chart);
  };

  /**
   * 获取 tree icon 的信息
   */
  const getTreeIconCfg = (node: Node) => {
    if (
      get(node, 'belongsCell.treeIcon.cfg') &&
      !get(node, 'belongsCell.treeIcon.cfg.destroyed')
    ) {
      return get(node, 'belongsCell.treeIcon.cfg');
    }

    return {
      x: 8 + node.level * 14,
      y: node.y + node.height / 2 - 10 / 2,
      width: 10,
      height: 10,
    };
  };

  const drawDottedLines = (chart: SpreadSheet | TableSheet | PivotSheet) => {
    if (chart?.options?.treeLineShow) {
      destroyDottedLines(dottedLines);
      const canvas = chart.container;
      const colHeaderHeight = getColHeaderHeight(chart);
      const viewportHeight = getViewportHeight(chart);
      const offsetHeight = getOffsetHeight(chart);

      const rowHeaderTreeDepth = getRowHeaderTreeDepth(chart);

      for (let i = 0; i <= rowHeaderTreeDepth; i++) {
        // 获取当前层级的节点
        const rowNodes = chart.facet.getRowNodes(i);

        rowNodes.forEach((rowNode) => {
          // &&
          // 如果当前行头是叶子节点，那么就不需要画
          // rowNode.children.some((child) => _.get(child, 'belongsCell.treeIcon'))
          if (rowNode.children.length) {
            // 避免重复画线导致的颜色过深
            const childs: Node[] = [];

            rowNode.children.forEach((child) => {
              const rowNodeTreeIconCfg = getTreeIconCfg(rowNode);
              const childTreeIconCfg = getTreeIconCfg(child);

              if (rowNodeTreeIconCfg && childTreeIconCfg) {
                const x1 =
                  rowNode.x +
                  rowNodeTreeIconCfg.x +
                  rowNodeTreeIconCfg.width / 2;
                let y1 =
                  colHeaderHeight +
                  rowNodeTreeIconCfg.y +
                  rowNodeTreeIconCfg.height;

                if (childs?.length > 0) {
                  const preChild = childs?.pop()!;
                  const preChildTreeIconCfg = getTreeIconCfg(preChild);

                  y1 =
                    colHeaderHeight +
                    preChildTreeIconCfg.y +
                    preChildTreeIconCfg.height / 2;
                }

                childs.push(child);
                const x2 = child.x + childTreeIconCfg.x;
                const y2 =
                  colHeaderHeight +
                  childTreeIconCfg.y +
                  childTreeIconCfg.height / 2;
                const points = [
                  [
                    x1,
                    Math.min(
                      Math.max(y1 - offsetHeight, colHeaderHeight),
                      viewportHeight,
                    ),
                  ],
                  [
                    x1,
                    Math.min(
                      Math.max(y2 - offsetHeight, colHeaderHeight),
                      viewportHeight,
                    ),
                  ],
                ];

                if (
                  y2 - offsetHeight >= colHeaderHeight &&
                  y2 - offsetHeight <= viewportHeight
                ) {
                  points.push([x2, y2 - offsetHeight]);
                }

                const dottedLine = canvas.appendChild(
                  new Polyline({
                    style: {
                      points: points as any,
                      stroke: '#000',
                      lineDash: [2, 3],
                      lineWidth: 1,
                      lineJoin: 'round',
                      zIndex: 999,
                    },
                  }),
                );

                dottedLines.push(dottedLine);
              }
            });
          }
        });
      }
    }
  };

  return {
    drawDottedLines,
  };
};
