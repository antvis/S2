import {
  EXTRA_FIELD,
  Hierarchy,
  Node,
  ROOT_NODE_ID,
  SpreadSheet,
  type LayoutResult,
  type Query,
} from '@antv/s2';
import {
  forEach,
  head,
  includes,
  initial,
  isEmpty,
  isNumber,
  last,
  uniq,
} from 'lodash';
import { PLACEHOLDER_FIELD, SUPPORT_CHART } from '../constant';

export function isCartesianCoordinate(chartType: string) {
  return includes(SUPPORT_CHART.cartesian, chartType);
}

/**
 * 需要考虑的场景：
 *   1. 数值置于行头、列头
 *      1.1 数值置于列头时，hideValue 开启关闭
 *   2. 单指标、多指标
 *   3. 总计、小计分组
 */

function getMeasureValue(s2: SpreadSheet, query: Query = {}) {
  return query[EXTRA_FIELD] ?? s2.dataSet.fields.values?.[0];
}

function createAxisHierarchy(width: number = 0, height: number = 0) {
  const axisHierarchy = new Hierarchy();

  axisHierarchy.maxLevel = 0;
  axisHierarchy.width = width;
  axisHierarchy.height = height;

  return axisHierarchy;
}

function pushAxisNode(
  axisHierarchy: Hierarchy,
  axisNode: Node,
  indexField: 'rowIndex' | 'colIndex' = 'rowIndex',
) {
  axisNode.isLeaf = true;

  axisHierarchy.pushNode(axisNode);
  axisHierarchy.pushIndexNode(axisNode);
  axisNode[indexField] = axisHierarchy.getIndexNodes().length - 1;

  if (!axisNode.isTotals && isEmpty(axisHierarchy.sampleNodesForAllLevels)) {
    axisHierarchy.sampleNodesForAllLevels.push(axisNode);
    axisHierarchy.sampleNodeForLastLevel = axisNode;
  }
}

function shrinkHierarchy(
  hierarchy: Hierarchy,
  field: 'width' | 'height' = 'width',
  size: number = 0,
) {
  hierarchy.maxLevel--;
  hierarchy.sampleNodesForAllLevels = initial(
    hierarchy.sampleNodesForAllLevels,
  );

  hierarchy.sampleNodeForLastLevel =
    last(hierarchy.sampleNodesForAllLevels) ?? null;

  hierarchy[field] -= size;
}

function updateRowNode(rowsHierarchy: Hierarchy, rowNode: Node) {
  const sampleNodeForLastLevel = rowsHierarchy.sampleNodeForLastLevel!;

  rowNode.isLeaf = true;
  rowNode.children = [];

  rowNode.width = sampleNodeForLastLevel.x - rowNode.x;

  rowsHierarchy.pushIndexNode(rowNode);
  rowNode.rowIndex = rowsHierarchy.getIndexNodes().length - 1;
}

function separateRowMeasureNodes(
  rowsHierarchy: Hierarchy,
  s2: SpreadSheet,
): Pick<
  LayoutResult,
  'rowsHierarchy' | 'rowNodes' | 'rowLeafNodes' | 'rowAxisHierarchy'
> {
  const sampleNodeForLastLevel = rowsHierarchy.sampleNodeForLastLevel!;
  const sampleNodeForLastLevelWidth = sampleNodeForLastLevel.width ?? 0;

  const rowAxisHierarchy = createAxisHierarchy(
    sampleNodeForLastLevelWidth,
    rowsHierarchy.height,
  );

  const parents = new Set();

  forEach(rowsHierarchy.getLeaves(), (leaf: Node) => {
    const axisNode = leaf.clone();

    if (axisNode.field !== EXTRA_FIELD) {
      // 总计、小计单指标时不展示
      axisNode.field = EXTRA_FIELD;
      axisNode.value = getMeasureValue(s2, axisNode.query);
    }

    axisNode.x = 0;
    axisNode.width = sampleNodeForLastLevelWidth;
    axisNode.children = [axisNode];

    pushAxisNode(rowAxisHierarchy, axisNode);

    if (leaf.field === EXTRA_FIELD) {
      leaf.width = 0;
    }

    const parent = leaf.field === EXTRA_FIELD ? leaf.parent : leaf;

    if (!parent || parent.id === ROOT_NODE_ID || parents.has(parent)) {
      return;
    }

    parents.add(parent);
    parent.width = sampleNodeForLastLevel.x - parent.x;
  });

  shrinkHierarchy(rowsHierarchy, 'width', sampleNodeForLastLevelWidth);

  return {
    rowAxisHierarchy,
    rowsHierarchy,
    rowNodes: rowsHierarchy.getNodes(),
    rowLeafNodes: rowsHierarchy.getLeaves(),
  };
}

export function getAxisLeafNodes(hierarchy: Hierarchy) {
  const axisLeafNodes = hierarchy.getLeaves().reduce((acc, leaf) => {
    const parent = leaf.parent;

    if (parent) {
      acc.push(parent);
    }

    return acc;
  }, [] as Node[]);

  return uniq(axisLeafNodes);
}

function separateRowDimensionNodes(
  rowsHierarchy: Hierarchy,
): Pick<
  LayoutResult,
  'rowsHierarchy' | 'rowNodes' | 'rowLeafNodes' | 'rowAxisHierarchy'
> {
  const sampleNodeForLastLevel = rowsHierarchy.sampleNodeForLastLevel!;
  const sampleNodeForLastLevelWidth = sampleNodeForLastLevel.width ?? 0;

  const rowAxisHierarchy = createAxisHierarchy(
    sampleNodeForLastLevelWidth,
    rowsHierarchy.height,
  );

  // 只有一个维度层级时，会被全部收敛到坐标轴中
  if (rowsHierarchy.maxLevel === 0) {
    const root = rowsHierarchy.rootNode.clone();

    root.field = sampleNodeForLastLevel.field;
    root.x = 0;
    root.width = sampleNodeForLastLevelWidth;
    pushAxisNode(rowAxisHierarchy, root);

    rowsHierarchy = new Hierarchy();

    return {
      rowAxisHierarchy,
      rowsHierarchy,
      rowNodes: rowsHierarchy.getNodes(),
      rowLeafNodes: rowsHierarchy.getLeaves(),
    };
  }

  // 当存在多个维度时，需要考虑叶子节点被拆分出去后，行头区域可能存在空缺的情况，比如总计格子横跨多个维度
  const parents = new Set();

  rowsHierarchy.indexNode = [];

  forEach(rowsHierarchy.getLeaves(), (leaf) => {
    const parent = leaf.parent;

    if (!parent || parents.has(parent)) {
      return;
    }

    parents.add(parent);

    let axisNode: Node;

    if (parent.id === ROOT_NODE_ID) {
      axisNode = leaf.clone();
      axisNode.children = [axisNode];

      updateRowNode(rowsHierarchy, leaf);
    } else {
      axisNode = parent.clone();
      updateRowNode(rowsHierarchy, parent);

      rowsHierarchy.allNodesWithoutRoot =
        rowsHierarchy.allNodesWithoutRoot.filter(
          (node) => !includes(axisNode.children, node),
        );
    }

    axisNode.field = head(axisNode.children)?.field || axisNode.field;

    axisNode.x = 0;
    axisNode.width = sampleNodeForLastLevelWidth;
    pushAxisNode(rowAxisHierarchy, axisNode);
  });

  shrinkHierarchy(rowsHierarchy, 'width', sampleNodeForLastLevelWidth);

  return {
    rowAxisHierarchy,
    rowsHierarchy,
    rowNodes: rowsHierarchy.getNodes(),
    rowLeafNodes: rowsHierarchy.getLeaves(),
  };
}

function separateRowNodesToAxis(rowsHierarchy: Hierarchy, s2: SpreadSheet) {
  if (rowsHierarchy.maxLevel === -1) {
    return null;
  }

  const isValueInCols = s2.isValueInCols?.();

  return isValueInCols
    ? separateRowDimensionNodes(rowsHierarchy)
    : separateRowMeasureNodes(rowsHierarchy, s2);
}

function createPlaceholderHierarchy(
  field: string,
  width: number,
  height: number,
  s2: SpreadSheet,
) {
  const draggedHeight =
    s2.options.style?.colCell?.heightByField?.[PLACEHOLDER_FIELD];

  height = isNumber(draggedHeight) ? draggedHeight : height;

  const placeholderNode = new Node({
    id: ROOT_NODE_ID,
    field: PLACEHOLDER_FIELD,
    value: s2.dataSet.getFieldName(field),
    x: 0,
    y: 0,
    width,
    height,
    isLeaf: true,
    // 保证占位格子内容是自适应滚动的
    isLeafPlaceholder: true,
  });

  const hierarchy = new Hierarchy();

  hierarchy.width = width;
  hierarchy.height = height;
  hierarchy.maxLevel = 0;

  hierarchy.pushNode(placeholderNode);
  hierarchy.pushIndexNode(placeholderNode);

  hierarchy.sampleNodesForAllLevels = [placeholderNode];
  hierarchy.sampleNodeForLastLevel = placeholderNode;

  return hierarchy;
}

function updateColNode(colsHierarchy: Hierarchy, colNode: Node) {
  const sampleNodeForLastLevel = colsHierarchy.sampleNodeForLastLevel!;

  colNode.isLeaf = true;
  colNode.children = [];
  colNode.height = sampleNodeForLastLevel.y - colNode.y;

  colsHierarchy.pushIndexNode(colNode);
  colNode.colIndex = colsHierarchy.getIndexNodes().length - 1;
}

function separateColMeasureNodes(
  colsHierarchy: Hierarchy,
  s2: SpreadSheet,
): Pick<
  LayoutResult,
  'colsHierarchy' | 'colNodes' | 'colLeafNodes' | 'colAxisHierarchy'
> {
  const sampleNodeForLastLevel = colsHierarchy.sampleNodeForLastLevel!;
  const sampleNodeForLastLevelHeight = sampleNodeForLastLevel.height ?? 0;

  const colAxisHierarchy = createAxisHierarchy(
    colsHierarchy.width,
    sampleNodeForLastLevelHeight,
  );

  const parents = new Set();

  forEach(colsHierarchy.getLeaves(), (leaf: Node) => {
    const axisNode = leaf.clone();

    if (axisNode.field !== EXTRA_FIELD) {
      // 总计、小计单指标时不展示
      axisNode.field = EXTRA_FIELD;
      axisNode.value = getMeasureValue(s2, axisNode.query);
    }

    axisNode.children = [axisNode];
    axisNode.y = 0;
    axisNode.height = sampleNodeForLastLevelHeight;

    pushAxisNode(colAxisHierarchy, axisNode, 'colIndex');

    if (leaf.field === EXTRA_FIELD) {
      leaf.height = 0;
    }

    const parent = leaf.field === EXTRA_FIELD ? leaf.parent : leaf;

    if (!parent || parent.id === ROOT_NODE_ID || parents.has(parent)) {
      return;
    }

    parents.add(parent);
    parent.height = sampleNodeForLastLevel.y - parent.y;
  });

  if (colsHierarchy.maxLevel === 0) {
    colsHierarchy = createPlaceholderHierarchy(
      sampleNodeForLastLevel.field,
      colAxisHierarchy.width,
      sampleNodeForLastLevelHeight,
      s2,
    );
  } else {
    shrinkHierarchy(colsHierarchy, 'height', sampleNodeForLastLevelHeight);
  }

  return {
    colAxisHierarchy,
    colsHierarchy,
    colNodes: colsHierarchy.getNodes(),
    colLeafNodes: colsHierarchy.getLeaves(),
  };
}

function separateColDimensionNodes(
  colsHierarchy: Hierarchy,
  s2: SpreadSheet,
): Pick<
  LayoutResult,
  'colsHierarchy' | 'colNodes' | 'colLeafNodes' | 'colAxisHierarchy'
> | null {
  const maxLevel = colsHierarchy.maxLevel;

  const sampleNodeForLastLevel = colsHierarchy.sampleNodeForLastLevel!;
  const sampleNodeForLastLevelHeight = sampleNodeForLastLevel.height ?? 0;

  const colAxisHierarchy = createAxisHierarchy(
    colsHierarchy.width,
    sampleNodeForLastLevelHeight,
  );

  // 只有一个维度层级时，会被全部收敛到坐标轴中
  // 和行头不同的是，列头需要再给一个Node用于占位，否则会缺一块
  if (maxLevel === 0) {
    const root = colsHierarchy.rootNode.clone();

    root.field = sampleNodeForLastLevel.field;

    root.y = 0;
    root.height = sampleNodeForLastLevelHeight;

    pushAxisNode(colAxisHierarchy, root, 'colIndex');

    colsHierarchy = createPlaceholderHierarchy(
      sampleNodeForLastLevel.field,
      colAxisHierarchy.width,
      sampleNodeForLastLevelHeight,
      s2,
    );

    return {
      colAxisHierarchy,
      colsHierarchy,
      colNodes: colsHierarchy.getNodes(),
      colLeafNodes: colsHierarchy.getLeaves(),
    };
  }

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
      axisNode.children = [axisNode];

      updateColNode(colsHierarchy, leaf);
    } else {
      axisNode = parent.clone();

      updateColNode(colsHierarchy, parent);
    }

    axisNode.field = head(axisNode.children)?.field || axisNode.field;
    axisNode.y = 0;
    axisNode.height = sampleNodeForLastLevelHeight;

    pushAxisNode(colAxisHierarchy, axisNode, 'colIndex');

    colsHierarchy.allNodesWithoutRoot =
      colsHierarchy.allNodesWithoutRoot.filter(
        (node) => !includes(axisNode.children, node),
      );
  });

  shrinkHierarchy(colsHierarchy, 'height', sampleNodeForLastLevelHeight);

  return {
    colAxisHierarchy,
    colsHierarchy,
    colNodes: colsHierarchy.getNodes(),
    colLeafNodes: colsHierarchy.getLeaves(),
  };
}

function separateColNodesToAxis(colsHierarchy: Hierarchy, s2: SpreadSheet) {
  if (colsHierarchy.maxLevel === -1) {
    return null;
  }

  const isValueInCols = s2.isValueInCols?.();

  return isValueInCols
    ? separateColMeasureNodes(colsHierarchy, s2)
    : separateColDimensionNodes(colsHierarchy, s2);
}

export function separateRowColLeafNodes(
  layoutResult: LayoutResult,
  s2: SpreadSheet,
): LayoutResult {
  return {
    ...layoutResult,
    ...separateRowNodesToAxis(layoutResult.rowsHierarchy, s2),
    ...separateColNodesToAxis(layoutResult.colsHierarchy, s2),
  };
}
