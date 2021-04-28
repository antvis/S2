import { Group } from '@antv/g-canvas';
import * as _ from 'lodash';
import { Hierarchy } from './hierarchy';
import { BaseSpreadSheet } from '../..';

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
  spreadsheet?: BaseSpreadSheet;
  query?: Record<string, any>;
  belongsCell?: Group;
  inCollapseNode?: boolean;
  rowIndexHeightExist?: number;
  [key: string]: any;
}

/**
 * Create By Bruce Too
 * On 2019-09-26
 * Node for cornerHeader, colHeader, rowHeader
 */
export class Node {
  public static blankNode(): Node {
    return new Node({
      id: '',
      key: '',
      value: '',
    });
  }

  public static rootNode(): Node {
    return new Node({
      id: 'root',
      key: '',
      value: '',
    });
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
      leaves.push(node);
      return leaves;
    }
    // current root node children
    const nodes = node.children.slice(0);
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
    // current root node children
    const nodes = node.children.slice(0);
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
        if (!_.isEqual(pa, parent)) {
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
  public cellIndex = -1;

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

  // node represent grand total
  public isGrandTotals: boolean;

  // node represent sub total
  public isSubTotals: boolean;

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
  public spreadsheet: BaseSpreadSheet;

  // node self's query condition(represent where node stay)
  public query?: Record<string, any>;

  public belongsCell?: Group;

  public inCollapseNode?: boolean;

  // 高度存在的时候(不为0)的行索引，用于决策模式下的隔行颜色区分
  public rowIndexHeightExist?: number;

  [key: string]: any;

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
      isSubTotals,
      isGrandTotals,
      isCollapsed,
      hierarchy,
      isPivotMode,
      seriesNumberWidth,
      field,
      spreadsheet,
      query,
      belongsCell,
      inCollapseNode,
      rowIndexHeightExist,
    } = cfg;
    this.id = id;
    this.key = key;
    this.value = value;
    this.label = label || value;
    this.parent = parent;
    this.level = level;
    this.rowIndex = rowIndex;
    this.isTotals = isTotals;
    this.isGrandTotals = isGrandTotals;
    this.isSubTotals = isSubTotals;
    this.isCollapsed = isCollapsed;
    this.hierarchy = hierarchy;
    this.isPivotMode = isPivotMode;
    this.seriesNumberWidth = seriesNumberWidth;
    this.field = field;
    this.spreadsheet = spreadsheet;
    this.query = query;
    this.belongsCell = belongsCell;
    this.inCollapseNode = inCollapseNode;
    this.rowIndexHeightExist = rowIndexHeightExist;
    if (parent) {
      parent.children.push(this);
    }
  }

  public hideRowNode() {
    this.height = 0;
  }

  public hideColNode() {
    this.width = 0;
  }

  public isHide() {
    return this.height === 0 || this.width === 0;
  }
}
