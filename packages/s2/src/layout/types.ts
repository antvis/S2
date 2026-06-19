export const DETAIL_HEADER_WIDTH = 50;
export const DETAIL_HEADER_HEIGHT = 28;
export const PIVOT_LEVEL_WIDTH = 120;
export const PIVOT_LEVEL_HEIGHT = 28;
export const DEFAULT_ROW_HEIGHT = 28;
export const DEFAULT_COL_WIDTH = 100;

export interface Viewport {
  scrollX: number;
  scrollY: number;
  viewWidth: number;
  viewHeight: number;
}

export interface VisibleRange {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
}

export interface CellBox {
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HeaderBox {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  /** Number of leaf rows/cols this header spans (for merged parent headers) */
  span?: number;
  /** Level depth: 0 = outermost (e.g. Country), 1 = next level (e.g. City) */
  level?: number;
  /** Total number of hierarchy levels */
  depth?: number;
  nodeId?: string;
  hasChildren?: boolean;
  isCollapsed?: boolean;
}

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface FreezeConfig {
  frozenRows: number;
  frozenCols: number;
}

/** A node in a hierarchical header tree (row or column dimension) */
export interface HierarchyTreeNode {
  value: string;
  children: HierarchyTreeNode[];
  field?: string;
  isCollapsed?: boolean;
  nodeId?: string;
}

/** Layout descriptor produced by a module that provides hierarchical headers */
export interface HierarchyLayout {
  rowTree: HierarchyTreeNode[];
  colTree: HierarchyTreeNode[];
  rowFields: string[];
  colFields: string[];
  valueFields: string[];
  rowLeafCount: number;
  colLeafCount: number;
  hierarchyType?: 'grid' | 'tree' | 'grid-tree' | 'list' | 'list-transpose';
}

export interface LayoutPlan {
  cells: CellBox[];
  frozenCells: CellBox[];
  rowHeaders: HeaderBox[];
  colHeaders: HeaderBox[];
  gridlines: Line[];
  frozenGridlines: Line[];
  viewport: Viewport;
  totalWidth: number;
  totalHeight: number;
  freeze: FreezeConfig | null;
  frozenRowHeight: number;
  frozenColWidth: number;
  /** Data area origin — everything before (left, top) is header space */
  headerArea: { left: number; top: number };
  /** Multi-level row headers grouped by level (level 0 = outermost). Empty for detail tables. */
  hierarchyRowHeaders: HeaderBox[][];
  /** Multi-level column headers grouped by level (level 0 = outermost). Empty for detail tables. */
  hierarchyColHeaders: HeaderBox[][];
  /** Corner headers (dimension names in the top-left area). Empty for detail tables. */
  cornerHeaders: HeaderBox[];
  /** Actual data content bounds (right/bottom edges). null = extends to viewport. */
  dataBounds: { right: number; bottom: number } | null;
}
