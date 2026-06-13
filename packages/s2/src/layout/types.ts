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
}

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface LayoutPlan {
  cells: CellBox[];
  rowHeaders: HeaderBox[];
  colHeaders: HeaderBox[];
  gridlines: Line[];
  viewport: Viewport;
  totalWidth: number;
  totalHeight: number;
}
