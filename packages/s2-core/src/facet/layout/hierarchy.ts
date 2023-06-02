import type { Node } from './node';

/**
 * Row and Column hierarchy to handle all contained nodes
 */
export class Hierarchy {
  // row fields
  public rows: string[];

  // the full width contains all nodes
  public width = 0;

  // the full height contains all nodes
  public height = 0;

  // just a mark to get node from each level
  public maxLevel = -1;

  // each level's first node
  public sampleNodesForAllLevels: Node[] = [];

  // last level's first node
  public sampleNodeForLastLevel: Node | null = null;

  // all nodes in this hierarchy
  private allNodesWithoutRoot: Node[] = [];

  // all nodes in the lastLevel
  private indexNode: Node[] = [];

  // get all leaf nodes
  public getLeaves(): Node[] {
    return this.allNodesWithoutRoot.filter((node) => node.isLeaf);
  }

  /**
   * Get all or level-related nodes in hierarchy
   * @param level
   */
  public getNodes(level?: number): Node[] {
    if (level !== undefined) {
      return this.allNodesWithoutRoot.filter((node) => node.level === level);
    }

    return this.allNodesWithoutRoot;
  }

  /**
   * Get all or less than level-related nodes in hierarchy
   * @param lessThanLevel
   */
  public getNodesLessThanLevel(lessThanLevel: number): Node[] {
    return this.allNodesWithoutRoot.filter(
      (node) => node.level <= lessThanLevel,
    );
  }

  /**
   * Add new node
   * @param node
   * @param insetIndex
   */
  public pushNode(node: Node, insetIndex = -1) {
    if (insetIndex === -1) {
      this.allNodesWithoutRoot.push(node);
    } else {
      this.allNodesWithoutRoot.splice(insetIndex, 0, node);
    }
  }

  public pushIndexNode(node: Node) {
    this.indexNode.push(node);
  }

  public getIndexNodes(): Node[] {
    return this.indexNode;
  }
}
