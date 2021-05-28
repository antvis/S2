// hierarchy to layout headers
import * as _ from 'lodash';
import { Node } from './node';
import { ID_SEPARATOR } from '../../common/constant';

export interface MaxMinLabel {
  minLabel: string;
  maxLabel: string;
}

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

  private indexNode: Node[] = [];

  private maxLabelInLevel: Map<number, string> = new Map<number, string>();

  private minLabelInLevel: Map<number, string> = new Map<number, string>();

  // get all leaf nodes
  public getLeaves(): Node[] {
    return this.allNodesWithoutRoot.filter((value) => value.isLeaf);
  }

  public getNotNullLeaves(): Node[] {
    return this.allNodesWithoutRoot.filter(
      (value) => value.isLeaf && value.id !== `root${ID_SEPARATOR}undefined`,
    );
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
   */
  public pushNode(value: Node) {
    this.allNodesWithoutRoot.push(value);
  }

  public pushIndexNode(value: Node) {
    this.indexNode.push(value);
  }

  public getIndexNodes(): Node[] {
    return this.indexNode;
  }

  /**
   * get max/min label in specific level
   * @param level
   */
  public getMinMaxLabelInLevel(level = 0): MaxMinLabel {
    // the top 50 nodes in level
    const allNodesInLevel = this.getNodes(level).slice(0, 50);
    let maxLabel;
    let minLabel;
    if (this.maxLabelInLevel.get(level) === undefined) {
      maxLabel = _.maxBy(allNodesInLevel, (value) =>
        _.get(value, 'label.length'),
      ).label;
      this.maxLabelInLevel.set(level, maxLabel);
    } else {
      maxLabel = this.maxLabelInLevel.get(level);
    }

    if (this.minLabelInLevel.get(level) === undefined) {
      minLabel = _.minBy(allNodesInLevel, (value) =>
        _.get(value, 'label.length'),
      ).label;
      this.minLabelInLevel.set(level, minLabel);
    } else {
      minLabel = this.minLabelInLevel.get(level);
    }
    return {
      minLabel,
      maxLabel,
    } as MaxMinLabel;
  }
}
