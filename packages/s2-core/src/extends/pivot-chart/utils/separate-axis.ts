import type { Pick } from '@antv/g2/lib/data';
import {
  EXTRA_FIELD,
  Hierarchy,
  Node,
  ROOT_NODE_ID,
  SpreadSheet,
  generateId,
  type LayoutResult,
  type NodeProperties,
  type Query,
} from '@antv/s2';
import {
  forEach,
  head,
  includes,
  initial,
  isEmpty,
  last,
  merge,
  reduce,
  uniq,
} from 'lodash';
import { PLACEHOLDER_FIELD } from '../constant';

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

type Index = 'rowIndex' | 'colIndex';

/**
 * 需要考虑的场景：
 *   1. 数值置于行头、列头
 *   2. 单指标、多指标
 *   3. 总计、小计分组
 */

function getMeasureValue(query: Query = {}, s2: SpreadSheet) {
  return query[EXTRA_FIELD] ?? s2.dataSet.fields.values?.[0];
}

function createHierarchy() {
  const axisHierarchy = new Hierarchy();

  axisHierarchy.maxLevel = 0;

  return axisHierarchy;
}

function pushAxisIndexNode(
  axisHierarchy: Hierarchy,
  axisNode: Node,
  key: Index,
) {
  axisNode.isLeaf = true;

  axisHierarchy.pushNode(axisNode);
  axisHierarchy.pushIndexNode(axisNode);
  axisNode[key] = axisHierarchy.getIndexNodes().length - 1;

  if (!axisNode.isTotals && isEmpty(axisHierarchy.sampleNodesForAllLevels)) {
    axisHierarchy.sampleNodesForAllLevels.push(axisNode);
    axisHierarchy.sampleNodeForLastLevel = axisNode;
  }
}

function pushIndexNode(hierarchy: Hierarchy, node: Node, key: Index) {
  node.isLeaf = true;
  node.children = [];

  hierarchy.pushIndexNode(node);
  node[key] = hierarchy.getIndexNodes().length - 1;
}

function shrinkHierarchy(hierarchy: Hierarchy) {
  hierarchy.maxLevel--;
  hierarchy.sampleNodesForAllLevels = initial(
    hierarchy.sampleNodesForAllLevels,
  );

  hierarchy.sampleNodeForLastLevel =
    last(hierarchy.sampleNodesForAllLevels) ?? null;
}

function convertToMeasurePlaceholderHierarchy(
  hierarchy: Hierarchy,
  s2: SpreadSheet,
) {
  const placeholderNode = new Node({
    id: generateId(ROOT_NODE_ID, PLACEHOLDER_FIELD),
    field: PLACEHOLDER_FIELD,
    value: s2.dataSet.getFieldName(hierarchy.sampleNodeForLastLevel!.field),
    level: 0,
    isLeaf: false,
    parent: hierarchy.rootNode,
    children: hierarchy.rootNode.children,
  });

  hierarchy.rootNode.children.forEach((child) => {
    child.parent = placeholderNode;
    child.level++;
  });

  hierarchy.rootNode.children = [placeholderNode];

  hierarchy.pushNode(placeholderNode);

  hierarchy.sampleNodesForAllLevels = [placeholderNode];
  hierarchy.sampleNodeForLastLevel = placeholderNode;
}

function separateMeasureNodes(
  hierarchy: Hierarchy,
  key: Index,
  s2: SpreadSheet,
) {
  const axisHierarchy = createHierarchy();

  forEach(hierarchy.getLeaves(), (leaf: Node) => {
    const axisNode = leaf.clone();

    leaf.relatedNode = axisNode;

    leaf.hideColCellHorizontalResize = true;
    leaf.hideRowCellVerticalResize = true;

    if (axisNode.field !== EXTRA_FIELD) {
      // 总计、小计单指标时不展示
      axisNode.field = EXTRA_FIELD;
      axisNode.value = getMeasureValue(axisNode.query, s2);
    }

    axisNode.children = [axisNode];

    pushAxisIndexNode(axisHierarchy, axisNode, key);
  });

  if (hierarchy.maxLevel === 0) {
    convertToMeasurePlaceholderHierarchy(hierarchy, s2);
  } else {
    shrinkHierarchy(hierarchy);
  }

  return {
    axisHierarchy,
    hierarchy,
  };
}

function separateRowMeasureNodes(
  rowsHierarchy: Hierarchy,
  s2: SpreadSheet,
): Pick<LayoutResult, 'rowsHierarchy' | 'axisRowsHierarchy'> {
  const { axisHierarchy, hierarchy } = separateMeasureNodes(
    rowsHierarchy,
    'rowIndex',
    s2,
  );

  return {
    rowsHierarchy: hierarchy,
    axisRowsHierarchy: axisHierarchy,
  };
}

function separateColMeasureNodes(
  colsHierarchy: Hierarchy,
  s2: SpreadSheet,
): Pick<LayoutResult, 'colsHierarchy' | 'axisColsHierarchy'> {
  const { axisHierarchy, hierarchy } = separateMeasureNodes(
    colsHierarchy,
    'colIndex',
    s2,
  );

  return {
    colsHierarchy: hierarchy,
    axisColsHierarchy: axisHierarchy,
  };
}

function createDimensionPlaceholderHierarchy(nodeProperties: NodeProperties) {
  const hierarchy = createHierarchy();

  hierarchy.isPlaceholder = true;

  const placeholderNode = new Node({
    id: generateId(ROOT_NODE_ID, PLACEHOLDER_FIELD),
    field: PLACEHOLDER_FIELD,
    level: 0,
    isLeaf: true,
    rowIndex: 0,
    colIndex: 0,
    parent: hierarchy.rootNode,
    ...nodeProperties,
  });

  hierarchy.rootNode.children = [placeholderNode];
  hierarchy.pushNode(placeholderNode);
  hierarchy.pushIndexNode(placeholderNode);

  hierarchy.sampleNodesForAllLevels = [placeholderNode];
  hierarchy.sampleNodeForLastLevel = placeholderNode;

  return hierarchy;
}

function separateDimensionNodes(
  hierarchy: Hierarchy,
  key: Index,
  s2: SpreadSheet,
) {
  const axisHierarchy = createHierarchy();

  const sampleNodeForLastLevel = hierarchy.sampleNodeForLastLevel!;

  // 只有一个维度层级时，会被全部收敛到坐标轴中
  // 再给一个Node用于占位
  if (hierarchy.maxLevel === 0) {
    const root = hierarchy.rootNode.clone();

    root.id = generateId(ROOT_NODE_ID, PLACEHOLDER_FIELD);
    root.field = sampleNodeForLastLevel.field;
    pushAxisIndexNode(axisHierarchy, root, key);

    const value = s2.dataSet.getFieldName(sampleNodeForLastLevel.field);

    hierarchy = createDimensionPlaceholderHierarchy(
      merge(
        {
          value,
          relatedNode: root,
        },
        key === 'rowIndex' && { field: sampleNodeForLastLevel.field },
      ),
    );

    return {
      hierarchy,
      axisHierarchy,
    };
  }

  const leafNodeParentMapping = reduce(
    hierarchy.getLeaves(),
    (acc, leaf) => {
      const parent = leaf.parent;

      if (!parent) {
        return acc;
      }

      if (!acc.get(parent)) {
        acc.set(parent, []);
      }

      const exist = acc.get(parent)!;

      exist.push(leaf);

      return acc;
    },
    new Map<Node, Node[]>(),
  );

  hierarchy.indexNode = [];
  leafNodeParentMapping.forEach((children, parent) => {
    let axisNode;

    // 总计、小计跨多行展示时，会出现不一致的情况下，只需要将 leaf 节点复制一份，无需剔除
    if (parent.children.length !== children.length) {
      children.forEach((leaf) => {
        axisNode = leaf.clone();
        axisNode.children = [axisNode];
        leaf.relatedNode = axisNode;
        pushIndexNode(hierarchy, leaf, key);
      });
    } else {
      axisNode = parent.clone();

      parent.relatedNode = axisNode;
      pushIndexNode(hierarchy, parent, key);
      axisNode.field = head(children)!.field;

      hierarchy.allNodesWithoutRoot = hierarchy.allNodesWithoutRoot.filter(
        (node) => !includes(children, node),
      );
    }

    if (axisNode) {
      pushAxisIndexNode(axisHierarchy, axisNode, key);
    }
  });

  shrinkHierarchy(hierarchy);

  return {
    axisHierarchy,
    hierarchy,
  };
}

function separateRowDimensionNodes(
  rowsHierarchy: Hierarchy,
  s2: SpreadSheet,
): Pick<LayoutResult, 'rowsHierarchy' | 'axisRowsHierarchy'> {
  const { axisHierarchy, hierarchy } = separateDimensionNodes(
    rowsHierarchy,
    'rowIndex',
    s2,
  );

  return {
    axisRowsHierarchy: axisHierarchy,
    rowsHierarchy: hierarchy,
  };
}

function separateColDimensionNodes(
  colsHierarchy: Hierarchy,
  s2: SpreadSheet,
): Pick<LayoutResult, 'colsHierarchy' | 'axisColsHierarchy'> {
  const { axisHierarchy, hierarchy } = separateDimensionNodes(
    colsHierarchy,
    'colIndex',
    s2,
  );

  return {
    axisColsHierarchy: axisHierarchy,
    colsHierarchy: hierarchy,
  };
}

function separateRowNodesToAxis(hierarchy: Hierarchy, s2: SpreadSheet) {
  if (hierarchy.maxLevel === -1) {
    return null;
  }

  const isValueInCols = s2.isValueInCols?.();

  const { rowsHierarchy, axisRowsHierarchy } = isValueInCols
    ? separateRowDimensionNodes(hierarchy, s2)
    : separateRowMeasureNodes(hierarchy, s2);

  return {
    rowsHierarchy,
    rowLeafNodes: rowsHierarchy.getLeaves(),
    axisRowsHierarchy,
  };
}

function separateColNodesToAxis(hierarchy: Hierarchy, s2: SpreadSheet) {
  if (hierarchy.maxLevel === -1) {
    return null;
  }

  const isValueInCols = s2.isValueInCols?.();

  const { colsHierarchy, axisColsHierarchy } = isValueInCols
    ? separateColMeasureNodes(hierarchy, s2)
    : separateColDimensionNodes(hierarchy, s2);

  return {
    colsHierarchy,
    colLeafNodes: colsHierarchy.getLeaves(),
    axisColsHierarchy,
  };
}

export function separateRowColLeafNodes(
  layoutResult: LayoutResult,
  s2: SpreadSheet,
): LayoutResult {
  const { rowsHierarchy, colsHierarchy } = layoutResult;

  return {
    ...layoutResult,
    ...separateRowNodesToAxis(rowsHierarchy, s2),
    ...separateColNodesToAxis(colsHierarchy, s2),
  };
}
