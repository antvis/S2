import type { S2DataConfig, S2Options } from '@/common';
import { get } from 'lodash';
import { CustomTreeData, customTreeFields } from 'tests/data/data-custom-tree';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { createPivotSheet, getContainer } from 'tests/util/helpers';
import { CornerNodeType, Node, PivotSheet } from '../../src';

const s2Options: S2Options = {
  width: 200,
  height: 200,
  hierarchyType: 'tree',
};

describe('SpreadSheet Tree Mode Tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = getContainer();
  });

  afterEach(() => {
    // container?.remove();
  });

  describe('Facet Tests', () => {
    test('should re-calc row header width', async () => {
      const s2 = createPivotSheet(s2Options);

      await s2.render();

      const rowsHierarchyWidth = s2.facet.getLayoutResult().rowsHierarchy.width;

      expect(Math.round(rowsHierarchyWidth)).toEqual(120);

      // 行头维度均更改为较长的 name
      const newDataCfg: S2DataConfig = {
        ...mockDataConfig,
        meta: [
          {
            field: 'province',
            name: '省1234567890份',
          },
          {
            field: 'city',
            name: '城1234567890市',
          },
        ],
      };

      s2.setDataCfg(newDataCfg);
      await s2.render();

      expect(s2.facet.getLayoutResult().rowsHierarchy.width).not.toEqual(
        rowsHierarchyWidth,
      );
    });

    // https://github.com/antvis/S2/issues/2389
    test('the corner should only have one line with action icon', async () => {
      // 行头维度更改为较长的 name
      const newDataCfg: S2DataConfig = {
        ...mockDataConfig,
        meta: [
          {
            field: 'province',
            name: '省1234567890份',
          },
          {
            field: 'city',
            name: '城1234567890市',
          },
        ],
      };

      // 添加 icon
      const newS2Options: S2Options = {
        ...s2Options,
        headerActionIcons: [
          {
            icons: ['SortDownSelected'],
            belongsCell: 'cornerCell',
          },
        ],
      };
      const s2 = new PivotSheet(container, newDataCfg, newS2Options);

      await s2.render();

      // 检查文本是否只有一行
      const cornerCell = s2.facet.getCornerCells()[0];

      expect(cornerCell.getTextShapes()).toHaveLength(1);
      expect(cornerCell.isMultiLineText()).toBeFalsy();
    });

    // https://github.com/antvis/S2/issues/2563
    test('should render correctly tree icon position in row cell', async () => {
      const s2 = createPivotSheet({
        ...s2Options,
        width: 300,
        seriesNumber: {
          enable: true,
        },
      });

      await s2.render();

      const [seriesNumberCell, rowCell] = s2.facet
        .getCornerCells()
        .filter((cell) => cell.getMeta().cornerType !== CornerNodeType.Col);

      expect(seriesNumberCell.getTreeIcon()).toBeFalsy();
      expect(rowCell.getTreeIcon()).toBeTruthy();
    });

    // https://github.com/antvis/S2/issues/2995
    test('should render correctly tree polyline', async () => {
      const customTreeDataCfg: S2DataConfig = {
        data: CustomTreeData,
        fields: customTreeFields,
      };
      // 正常渲染树形图和polyline
      const customTreeOptions: S2Options = {
        debug: true,
        width: 600,
        height: 480,
        hierarchyType: 'tree',
        style: {
          rowCell: {
            showTreeLine: true,
          },
        },
      };
      const s2 = new PivotSheet(
        container,
        customTreeDataCfg,
        customTreeOptions,
      );

      await s2.render();
      const dottedLinesLenght = s2.getDottedLinesLengh();

      expect(dottedLinesLenght).toEqual(8);
      // 渲染polyline时的坐标位置与节点位置一致
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
      const maxLevel = s2.facet.getRowNodes(0)?.[0]?.hierarchy?.maxLevel;
      const colHeaderHeight = s2.facet.getColNodes(0)?.[0]?.hierarchy?.height;
      const viewportHeight =
        s2.facet.panelBBox.viewportHeight + colHeaderHeight;
      const offsetHeight = s2.facet.getScrollOffset().scrollY;
      const dottedLines = s2.getDottedLines();

      for (let i = 0; i <= maxLevel; i++) {
        const rowNodes = s2.facet.getRowNodes(i);

        rowNodes.forEach((rowNode) => {
          if (rowNode.children.length) {
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

                const isExist = dottedLines.some((line) => {
                  const pointsLine = line?.attributes?.points;

                  return JSON.stringify(points) === JSON.stringify(pointsLine);
                });

                // eslint-disable-next-line jest/no-conditional-expect
                expect(isExist).toEqual(true);
              }
            });
          }
        });
      }

      // 树形图全部收起时，不展示polyline
      const customTreeOptions1: S2Options = {
        debug: true,
        width: 600,
        height: 480,
        hierarchyType: 'tree',
        style: {
          rowCell: {
            showTreeLine: true,
            collapseAll: true,
          },
        },
      };

      s2.setOptions(customTreeOptions1);
      await s2.render();
      const dottedLines1 = s2.getDottedLinesLengh();

      expect(dottedLines1).toEqual(0);
      // showTreeLine为false时， 关闭polyline
      const customTreeOptions2: S2Options = {
        debug: true,
        width: 600,
        height: 480,
        hierarchyType: 'tree',
        style: {
          rowCell: {
            showTreeLine: false,
          },
        },
      };

      s2.setOptions(customTreeOptions2);
      await s2.render();
      const dottedLines2 = s2.getDottedLinesLengh();

      expect(dottedLines2).toEqual(0);
    });
  });
});
