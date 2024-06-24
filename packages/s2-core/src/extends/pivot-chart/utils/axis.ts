import {
  Hierarchy,
  Node,
  ROOT_NODE_ID,
  SpreadSheet,
  type LayoutResult,
} from '@antv/s2';
import { forEach, includes, initial, last } from 'lodash';
import { SUPPORT_CHART } from '../constant';

export function isCartesianCoordinate(chartType: string) {
  return includes(SUPPORT_CHART.cartesian, chartType);
}

function separateRowLeafNodes(
  rowsHierarchy: Hierarchy,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  s2: SpreadSheet,
): Pick<
  LayoutResult,
  'rowsHierarchy' | 'rowNodes' | 'rowLeafNodes' | 'rowAxisNodes'
> | null {
  const maxLevel = rowsHierarchy.maxLevel;

  if (maxLevel === -1) {
    return null;
  }

  const sampleNodeForLastLevel = rowsHierarchy.sampleNodeForLastLevel!;
  const sampleNodeForLastLevelWidth = sampleNodeForLastLevel.width ?? 0;

  const rowAxisNodes: Node[] = [];

  const lastRow = last(s2.dataSet.fields.rows) as string;

  // 只有一个维度层级时，会被全部收敛到坐标轴中
  if (maxLevel === 0) {
    const root = rowsHierarchy.rootNode.clone();

    root.field = lastRow;

    root.width = sampleNodeForLastLevelWidth;
    rowAxisNodes.push(root);

    rowsHierarchy.indexNode = [];
    rowsHierarchy.allNodesWithoutRoot = [];
    rowsHierarchy.rootNode.children = [];
  } else {
    // 当存在多个维度时，需要考虑叶子节点被拆分出去后，行头区域可能存在空缺的情况，比如总计格子横跨多个维度
    const parents = new Set();

    rowsHierarchy.indexNode = [];

    forEach(rowsHierarchy.getLeaves(), (leaf) => {
      const parent = leaf.parent;

      if (!parent || parents.has(parent)) {
        return;
      }

      parents.add(parent);

      let axisNode;

      if (parent.id === ROOT_NODE_ID) {
        axisNode = leaf.clone();

        rowsHierarchy.pushIndexNode(leaf);
        leaf.rowIndex = rowsHierarchy.getIndexNodes().length - 1;
        leaf.width -= sampleNodeForLastLevelWidth;
      } else {
        axisNode = parent.clone();

        rowsHierarchy.pushIndexNode(parent);
        parent.rowIndex = rowsHierarchy.getIndexNodes().length - 1;
        parent.isLeaf = true;
        parent.children = [];
        parent.width = sampleNodeForLastLevel.x - parent.x;
      }

      rowsHierarchy.allNodesWithoutRoot =
        rowsHierarchy.allNodesWithoutRoot.filter(
          (node) => !includes(axisNode.children, node),
        );

      axisNode.field = lastRow;
      axisNode.x = 0;
      axisNode.width = sampleNodeForLastLevelWidth;

      rowAxisNodes.push(axisNode);
    });
  }

  rowsHierarchy.maxLevel--;
  rowsHierarchy.sampleNodesForAllLevels = initial(
    rowsHierarchy.sampleNodesForAllLevels,
  );

  rowsHierarchy.sampleNodeForLastLevel =
    last(rowsHierarchy.sampleNodesForAllLevels) ?? null;

  rowsHierarchy.width -= sampleNodeForLastLevelWidth;

  return {
    rowAxisNodes,
    rowsHierarchy,
    rowNodes: rowsHierarchy.getNodes(),
    rowLeafNodes: rowsHierarchy.getLeaves(),
  };
}

function separateColLeafNodes(
  colsHierarchy: Hierarchy,
  s2: SpreadSheet,
): Pick<
  LayoutResult,
  'colsHierarchy' | 'colNodes' | 'colLeafNodes' | 'colAxisNodes'
> | null {
  const maxLevel = colsHierarchy.maxLevel;

  if (maxLevel === -1) {
    return null;
  }

  const sampleNodeForLastLevel = colsHierarchy.sampleNodeForLastLevel!;
  const sampleNodeForLastLevelHeight = sampleNodeForLastLevel.height ?? 0;
  const lastCol = last(s2.dataSet.fields.columns) as string;
  const colAxisNodes: Node[] = [];

  // 只有一个维度层级时，会被全部收敛到坐标轴中
  // 和行头不同的是，列头需要再给一个Node用于占位，否则会缺一块
  if (maxLevel === 0) {
    const root = colsHierarchy.rootNode.clone();

    root.height = sampleNodeForLastLevelHeight;
    colAxisNodes.push(root);

    const placeholderNode = sampleNodeForLastLevel.clone();

    placeholderNode.field = lastCol;
    placeholderNode.x = 0;
    placeholderNode.width = colsHierarchy.width;
    placeholderNode.value = s2.dataSet.getFieldName(placeholderNode.field);
    // 保证占位格子内容是自适应滚动的
    placeholderNode.isLeafPlaceholder = false;

    colsHierarchy.indexNode = [placeholderNode];
    colsHierarchy.allNodesWithoutRoot = [placeholderNode];
    colsHierarchy.rootNode.children = [placeholderNode];
    colsHierarchy.sampleNodesForAllLevels = [placeholderNode];
    colsHierarchy.sampleNodeForLastLevel = placeholderNode;
  } else {
    // 当存在多个维度时，需要考虑叶子节点被拆分出去后，行头区域可能存在空缺的情况，比如总计格子横跨多个维度
    const parents = new Set();

    colsHierarchy.indexNode = [];

    forEach(colsHierarchy.getLeaves(), (leaf) => {
      const parent = leaf.parent;

      if (!parent || parents.has(parent)) {
        return;
      }

      parents.add(parent);

      let axisNode;

      if (parent.id === ROOT_NODE_ID) {
        axisNode = leaf.clone();

        colsHierarchy.pushIndexNode(leaf);
        leaf.colIndex = colsHierarchy.getIndexNodes().length - 1;
        leaf.height -= sampleNodeForLastLevelHeight;
      } else {
        axisNode = parent.clone();

        colsHierarchy.pushIndexNode(parent);
        parent.colIndex = colsHierarchy.getIndexNodes().length - 1;
        parent.isLeaf = true;
        parent.children = [];
        parent.height = sampleNodeForLastLevel.y - parent.y;
      }

      colsHierarchy.allNodesWithoutRoot =
        colsHierarchy.allNodesWithoutRoot.filter(
          (node) => !includes(axisNode.children, node),
        );

      axisNode.field = lastCol;
      axisNode.y = 0;
      axisNode.height = sampleNodeForLastLevelHeight;
      colAxisNodes.push(axisNode);
    });

    colsHierarchy.maxLevel--;
    colsHierarchy.sampleNodesForAllLevels = initial(
      colsHierarchy.sampleNodesForAllLevels,
    );

    colsHierarchy.sampleNodeForLastLevel =
      last(colsHierarchy.sampleNodesForAllLevels) ?? null;

    colsHierarchy.height -= sampleNodeForLastLevelHeight;
  }

  return {
    colAxisNodes,
    colsHierarchy,
    colNodes: colsHierarchy.getNodes(),
    colLeafNodes: colsHierarchy.getLeaves(),
  };
}

export function separateRowColLeafNodes(
  layoutResult: LayoutResult,
  s2: SpreadSheet,
): LayoutResult {
  return {
    ...layoutResult,
    ...separateRowLeafNodes(layoutResult.rowsHierarchy, s2),
    ...separateColLeafNodes(layoutResult.colsHierarchy, s2),
  };
}
