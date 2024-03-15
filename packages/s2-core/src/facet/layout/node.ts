import { head, isEmpty } from 'lodash';
import { SERIES_NUMBER_FIELD } from '../../common';
import { ROOT_NODE_ID } from '../../common/constant/node';
import type {
  CornerNodeType,
  HiddenColumnsInfo,
  S2CellType,
} from '../../common/interface';
import type { Query } from '../../data-set';
import type { SpreadSheet } from '../../sheet-type';
import type { Hierarchy } from './hierarchy';

export interface BaseNodeConfig {
  /**
   * id 只在行头、列头 node 以及 hierarchy 中有用，是当前 node query 的拼接产物
   */
  id: string;

  /**
   * 当前 node 的 field 属性， 在角头、行列头中 node 使用，和 dataCfg.fields 对应
   */
  field: string;
  value: string;
  level?: number;
  rowIndex?: number;
  colIndex?: number;
  parent?: Node;
  isTotals?: boolean;
  isSubTotals?: boolean;
  isCollapsed?: boolean | null;
  isGrandTotals?: boolean;
  isTotalRoot?: boolean;
  hierarchy?: Hierarchy;
  isPivotMode?: boolean;
  seriesNumberWidth?: number;
  spreadsheet?: SpreadSheet;
  query?: Record<string, any>;
  belongsCell?: S2CellType;
  isTotalMeasure?: boolean;
  inCollapseNode?: boolean;
  isLeaf?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  padding?: number;
  children?: Node[];
  hiddenColumnsInfo?: HiddenColumnsInfo | null;
  // 额外的节点信息
  extra?: Record<string, any>;
}

/**
 * Node for cornerHeader, colHeader, rowHeader
 */
export class Node {
  // node unique id: {parent fieldName - fieldName(total name)}
  public id: string;

  public value: string;

  // field key
  public field: string;

  // node top-left x-coordinate
  public x = 0;

  // node top-left y-coordinate
  public y = 0;

  // node width
  public width = 0;

  // node height
  public height = 0;

  // cell index in layout list
  public colIndex = -1;

  // node's level in tree hierarchy
  public level = 0;

  // list table row index.
  public rowIndex: number;

  // node's parent node
  public parent: Node | undefined;

  // check if node is leaf(the max level in tree)
  public isLeaf = false;

  // node is grand total or subtotal(not normal node)
  public isTotals: boolean;

  public colId: string;

  // node represent total measure
  public isTotalMeasure: boolean;

  // node is collapsed
  public isCollapsed: boolean;

  // node's children
  public children: Node[] = [];

  // node width adaptive mode need paddingLeft = paddingRight
  public padding = 0;

  // node's hierarchy
  public hierarchy: Hierarchy;

  // is pivot mode
  public isPivotMode: boolean;

  // series number width
  public seriesNumberWidth: number;

  // spreadsheet instance
  public spreadsheet: SpreadSheet;

  // node self's query condition(represent where node stay)
  public query?: Query;

  public belongsCell?: S2CellType | null | undefined;

  public inCollapseNode?: boolean;

  public cornerType?: CornerNodeType;

  public isGrandTotals?: boolean;

  public isSubTotals?: boolean;

  public isTotalRoot?: boolean;

  public isFrozen?: boolean;

  public extra?: {
    description?: string;
    isCustomNode?: boolean;
    [key: string]: any;
  };

  [key: string]: any;

  constructor(cfg: BaseNodeConfig) {
    const {
      id,
      field,
      value,
      parent,
      level,
      rowIndex,
      isTotals,
      isGrandTotals,
      isSubTotals,
      isCollapsed,
      isTotalRoot,
      hierarchy,
      isPivotMode,
      seriesNumberWidth,
      spreadsheet,
      query,
      belongsCell,
      inCollapseNode,
      isTotalMeasure,
      isLeaf,
      extra,
    } = cfg;

    this.id = id;
    this.field = field;
    this.value = value;
    this.parent = parent;
    this.level = level!;
    this.rowIndex = rowIndex!;
    this.isTotals = isTotals!;
    this.isCollapsed = isCollapsed!;
    this.hierarchy = hierarchy!;
    this.isPivotMode = isPivotMode!;
    this.seriesNumberWidth = seriesNumberWidth!;
    this.spreadsheet = spreadsheet!;
    this.query = query;
    this.inCollapseNode = inCollapseNode;
    this.isTotalMeasure = isTotalMeasure!;
    this.isLeaf = isLeaf!;
    this.isGrandTotals = isGrandTotals;
    this.isSubTotals = isSubTotals;
    this.belongsCell = belongsCell;
    this.isTotalRoot = isTotalRoot;
    this.extra = extra;
  }

  /**
   * Get node's field path
   * eg: node.id = root[&]东北[&]黑龙江
   * => [area, province]
   * @param node
   */
  public static getFieldPath(node: Node, isDrillDown?: boolean): string[] {
    if ((node && !node.isTotals) || (node && isDrillDown)) {
      // total nodes don't need rows from node self except in drill down mode
      let parent = node.parent;
      const fieldPath = [node.field];

      while (parent && parent.id !== ROOT_NODE_ID) {
        fieldPath.push(parent.field);
        parent = parent.parent;
      }

      return fieldPath.reverse();
    }

    return [];
  }

  /**
   * Get all leaves in this node branch, eg:
   *        c1
   *    b1〈
   *        c2
   * a〈
   *        c3
   *    b2〈
   *        c4
   * get a branch's all leaves(c1~c4)
   * @param node
   */
  public static getAllLeaveNodes(node: Node): Node[] {
    const leaves: Node[] = [];

    if (node.isLeaf) {
      return [node];
    }

    // current root node children
    const nodes = [...(node.children || [])];
    let current = nodes.shift();

    while (current) {
      if (current.isLeaf) {
        leaves.push(current);
      } else {
        nodes.unshift(...current.children);
      }

      current = nodes.shift();
    }

    return leaves;
  }

  /**
   * Get all children nodes in this node branch, eg:
   *        c1
   *    b1〈
   *        c2
   * a〈
   *        c3
   *    b2〈
   *        c4
   * get a branch's all nodes(c1~c4, b1, b2)
   * @param node
   */
  public static getAllChildrenNodes(node: Node): Node[] {
    const all: Node[] = [];

    if (node.isLeaf) {
      return [node];
    }

    // current root node children
    const nodes = [...(node.children || [])];
    let current = nodes.shift();

    while (current) {
      all.push(current);
      nodes.unshift(...current.children);
      current = nodes.shift();
    }

    return all;
  }

  /**
   *        c1
   *    b1〈
   *        c2
   * a〈
   *        c3
   *    b2〈
   *        c4
   * c1 => (a, b1, c1)
   * @param node
   */
  public static getBranchNodes(node: Node): Node[] {
    if (node && !node.isTotals) {
      let parent = node.parent;
      const pathNodes = [node];

      while (parent && parent.id !== ROOT_NODE_ID) {
        pathNodes.push(parent);
        parent = parent.parent;
      }

      return pathNodes.reverse();
    }

    return [];
  }

  public static blankNode(): Node {
    return new Node({
      id: '',
      field: '',
      value: '',
    });
  }

  public static rootNode(): Node {
    return new Node({
      id: ROOT_NODE_ID,
      field: '',
      value: '',
    });
  }

  public getHeadLeafChild() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let leafChild: Node | undefined = this;

    while (!isEmpty(leafChild?.children)) {
      leafChild = head(leafChild?.children);
    }

    return leafChild;
  }

  /**
   * 获取树状模式下，当前节点以及其所有子节点的高度总和
   *
   */
  public getTotalHeightForTreeHierarchy(): number {
    if (this.height === 0 || isEmpty(this.children)) {
      return this.height;
    }

    return this.children.reduce(
      (sum, child) => sum + child.getTotalHeightForTreeHierarchy(),
      this.height,
    );
  }

  public isSeriesNumberNode() {
    return this.field === SERIES_NUMBER_FIELD;
  }
}
