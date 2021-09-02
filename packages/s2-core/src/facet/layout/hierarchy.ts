// hierarchy to layout headers
import { Node } from './node';

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
  public sampleNodesForAllLevels?: Node[] = [];

  // last level's first node
  public sampleNodeForLastLevel?: Node = null;

  // all nodes in this hierarchy
  private allNodesWithoutRoot: Node[] = [];

  // all nodes in the lastLevel
  private indexNode: Node[] = [];

  // get all leaf nodes
  public getLeaves(): Node[] {
    return this.allNodesWithoutRoot.filter((value) => value.isLeaf);
  }

  /**
   * Get all or level-related nodes in hierarchy
   * @param level
   */
  public getNodes(level?: number): Node[] {
    if (level !== undefined) {
      return this.allNodesWithoutRoot.filter((value) => value.level === level);
    }
    return this.allNodesWithoutRoot;
  }

  /**
   * Get all or less than level-related nodes in hierarchy
   * @param lessThanLevel
   */
  public getNodesLessThanLevel(lessThanLevel: number): Node[] {
    return this.allNodesWithoutRoot.filter(
      (value) => value.level <= lessThanLevel,
    );
  }

  /**
   * Add new node
   * @param value
   * @param insetIndex
   */
  public pushNode(value: Node, insetIndex = -1) {
    if (insetIndex === -1) {
      this.allNodesWithoutRoot.push(value);
    } else {
      this.allNodesWithoutRoot.splice(insetIndex, 0, value);
    }
  }

  public pushIndexNode(value: Node) {
    this.indexNode.push(value);
  }

  public getIndexNodes(): Node[] {
    return this.indexNode;
  }
}
