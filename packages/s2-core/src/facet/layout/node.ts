import { omit, isEqual } from 'lodash';
import { Hierarchy } from './hierarchy';
import { SpreadSheet } from '@/index';
import { S2CellType } from '@/common/interface';

export interface BaseNodeConfig {
  id: string;
  key: string;
  value: string;
  label?: string;
  level?: number;
  rowIndex?: number;
  parent?: Node;
  isTotals?: boolean;
  isSubTotals?: boolean;
  isCollapsed?: boolean;
  isGrandTotals?: boolean;
  hierarchy?: Hierarchy;
  isPivotMode?: boolean;
  seriesNumberWidth?: number;
  field?: string;
  spreadsheet?: SpreadSheet;
  query?: Record<string, any>;
  belongsCell?: S2CellType;
  inCollapseNode?: boolean;
  isLeaf?: boolean;
  [key: string]: any;
}

/**
 * Create By Bruce Too
 * On 2019-09-26
 * Node for cornerHeader, colHeader, rowHeader
 */
export class Node {
  // node represent total measure
  public isTotalMeasure: boolean;

  public config: BaseNodeConfig;

  constructor(cfg: BaseNodeConfig) {
    const {
      id,
      key,
      value,
      label,
      parent,
      level,
      rowIndex,
      isTotals,
      isGrandTotals,
      isSubTotals,
      isCollapsed,
      hierarchy,
      isPivotMode,
      seriesNumberWidth,
      field,
      spreadsheet,
      query,
      belongsCell,
      inCollapseNode,
      isTotalMeasure,
      isLeaf,
    } = cfg;
    this.id = id;
    this.key = key;
    this.value = value;
    this.label = label || value;
    this.parent = parent;
    this.level = level;
    this.rowIndex = rowIndex;
    this.isTotals = isTotals;
    this.isCollapsed = isCollapsed;
    this.hierarchy = hierarchy;
    this.isPivotMode = isPivotMode;
    this.seriesNumberWidth = seriesNumberWidth;
    this.field = field;
    this.spreadsheet = spreadsheet;
    this.query = query;
    this.belongsCell = belongsCell;
    this.inCollapseNode = inCollapseNode;
    this.isTotalMeasure = isTotalMeasure;
    this.isLeaf = isLeaf;
    this.isGrandTotals = isGrandTotals;
    this.isSubTotals = isSubTotals;
    // if (parent) {
    //   parent.children.push(this);
    // }
    // 这里存在一个问题，由于目前所有内置成员变量都是public, 可以直接通过实例.属性 来更新
    // 属性值，导致更新后有些无法同步到config中，后续再处理下
    this.config = Object.getOwnPropertyNames(this).reduce((result, name) => {
      return { ...result, [name]: this[name] };
    }, {}) as BaseNodeConfig;
  }

  /**
   * Get node's field path
   * eg: node.id = root[&]东北[&]黑龙江
   * => [area, province]
   * @param node
   */
  public static getFieldPath(node: Node): string[] {
    if (node && !node.isTotals) {
      // total nodes don't need rows from node self
      let parent = node.parent;
      const fieldPath = [node.field];
      while (parent && parent.id !== 'root') {
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
  public static getAllLeavesOfNode(node: Node): Node[] {
    const leaves: Node[] = [];
    if (node.isLeaf) {
      return [node];
    }
    // current root node children
    const nodes = [...node.children];
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
  public static getAllChildrenNode(node: Node): Node[] {
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
   * Get all children branch in this node branch, eg:
   *        c1
   *    b1〈
   *        c2
   * a〈
   *        c3
   *    b2〈
   *        c4
   * get all branch [[b1,c1],[b1,c2],[b2,c3],[b2,c4]]
   * @param parent
   */
  public static getAllBranch(parent: Node): Node[][] {
    const all: Node[][] = [];
    const leaves = this.getAllLeavesOfNode(parent);
    let current = leaves.shift();
    let tempBranch = [];
    while (current) {
      tempBranch.unshift(current);
      let pa = current.parent;
      while (pa) {
        if (!isEqual(pa, parent)) {
          tempBranch.unshift(pa);
        } else {
          break;
        }
        pa = pa.parent;
      }
      all.push(tempBranch);
      current = leaves.shift();
      tempBranch = [];
    }
    return all;
  }

  // node unique id: {parent fieldName - fieldName(total name)}
  public id: string;

  // node top-left x-coordinate
  public x = 0;

  // node top-left y-coordinate
  public y = 0;

  // node width
  public width = 0;

  // node height
  public height = 0;

  // node real display text label
  public label: string;

  // node field name
  public key: string;

  // the same as {@see label}
  public value: string;

  // cell index in layout list(TODO What's use for?)
  public colIndex = -1;

  // node's level in tree hierarchy
  public level = 0;

  // list table row index.
  public rowIndex: number;

  // node's parent node
  public parent: Node;

  // check if node is leaf(the max level in tree)
  public isLeaf = false;

  // node is grand total or subtotal(not normal node)
  public isTotals: boolean;

  public static blankNode(): Node {
    return new Node({
      id: '',
      key: '',
      value: '',
    });
  }

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

  // field key
  public field: string;

  // spreadsheet instance
  public spreadsheet: SpreadSheet;

  // node self's query condition(represent where node stay)
  public query?: Record<string, any>;

  public belongsCell?: S2CellType;

  public inCollapseNode?: boolean;

  [key: string]: any;

  public static rootNode(): Node {
    return new Node({
      id: 'root',
      key: '',
      value: '',
    });
  }

  public toJSON() {
    return omit(this, ['config', 'hierarchy', 'parent', 'spreadsheet']);
  }
}
