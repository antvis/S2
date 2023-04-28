import type { Hierarchy } from '../../facet/layout/hierarchy';
import type { Node } from '../../facet/layout/node';
import type { ViewMeta } from './basic';

export interface AdjustLeafNodesParams {
  leafNodes: Node[];
  hierarchy: Hierarchy;
}

export interface ScrollChangeParams {
  offset: number;
  updateThumbOffset: boolean;
}

export type GetCellMeta = (
  rowIndex: number,
  colIndex: number,
) => ViewMeta | null;

export interface LayoutResult {
  /**
   * 列头节点, 对应 colCell (含可视范围外)
   */
  colNodes: Node[];
  /**
   * 列头叶子节点, 对应 colCell (含可视范围外)
   */
  colLeafNodes: Node[];
  /**
   * 列头节点层级结构 (含可视范围外)
   */
  colsHierarchy: Hierarchy;
  /**
   * 行头节点, 对应 rowCell (含可视范围外)
   */
  rowNodes: Node[];
  /**
   * 行头节点层级结构 (含可视范围外)
   */
  rowsHierarchy: Hierarchy;
  /**
   * 行头叶子节点, 对应 rowCell (含可视范围外)
   */
  rowLeafNodes: Node[];
  /**
   * 角头节点, 对应 cornerCell
   */
  cornerNodes: Node[];
  /**
   * 根据行列索引获取单元格元数据
   * @ref facet.getCellMeta
   * @example layoutResult.getCellMeta(rowIndex, colIndex)
   */
  getCellMeta: GetCellMeta;
}
