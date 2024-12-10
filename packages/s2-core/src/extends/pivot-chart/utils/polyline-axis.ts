import { Polyline } from '@antv/g';
import { dottedTreeLines, Node, SpreadSheet } from '@antv/s2';
import { get } from 'lodash';

/**
 * 销毁已存在的虚线
 */
function destroyDottedLines(lines: Polyline[] = []) {
  while (lines.length) {
    lines?.pop()?.destroy();
  }
}

/**
 * 获取列头的高度
 */
function getColHeaderHeight(s2: SpreadSheet) {
  return s2.facet.getColNodes(0)?.[0]?.hierarchy?.height;
}

/**
 * 获取滚动高度
 */
function getOffsetHeight(s2: SpreadSheet) {
  return s2.facet.getScrollOffset().scrollY;
}

/**
 * 获取树级行头嵌套深度
 */
function getRowHeaderTreeDepth(s2: SpreadSheet) {
  return s2.facet.getRowNodes(0)?.[0]?.hierarchy?.maxLevel;
}

/**
 * 获取视口高度（列头 + 数值区域）
 */
function getViewportHeight(s2: SpreadSheet) {
  return s2.facet.panelBBox.viewportHeight + getColHeaderHeight(s2);
}

/**
 * 获取 tree icon 的信息
 */
function getTreeIconCfg(node: Node) {
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
}

/**
 * 画线
 */
export function drawDottedLines(s2: SpreadSheet) {
  if (
    s2.options.hierarchyType === 'tree' &&
    s2?.options?.style?.rowCell?.showTreeLine
  ) {
    destroyDottedLines(dottedTreeLines);
    const canvas = s2.container;
    const colHeaderHeight = getColHeaderHeight(s2);
    const viewportHeight = getViewportHeight(s2);
    const offsetHeight = getOffsetHeight(s2);

    // console.log(colHeaderHeight, 'colHeaderHeight');

    const rowHeaderTreeDepth = getRowHeaderTreeDepth(s2);

    for (let i = 0; i <= rowHeaderTreeDepth; i++) {
      // 获取当前层级的节点
      const rowNodes = s2.facet.getRowNodes(i);

      // console.log(rowNodes, 'rowNodes');

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

            // console.log(rowNodeTreeIconCfg, 'rowNodeTreeIconCfg');

            if (rowNodeTreeIconCfg && childTreeIconCfg) {
              const x1 =
                rowNode.x + rowNodeTreeIconCfg.x + rowNodeTreeIconCfg.width / 2;
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

              const { stroke, lineDash, lineWidth } = s2?.theme?.polyline;
              const dottedLine = canvas.appendChild(
                new Polyline({
                  style: {
                    points: points as any,
                    stroke,
                    lineDash,
                    lineWidth,
                    lineJoin: 'round',
                    zIndex: 9999,
                  },
                }),
              );

              dottedTreeLines.push(dottedLine);
            }
          });
        }
      });
    }
  } else {
    destroyDottedLines(dottedTreeLines);
  }
}
