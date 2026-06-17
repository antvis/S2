export interface CellRange {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
}

function colLabelToIndex(label: string): number {
  let result = 0;
  for (let i = 0; i < label.length; i++) {
    result = result * 26 + (label.toUpperCase().charCodeAt(i) - 64);
  }
  return result - 1;
}

export function parseRange(range: string): CellRange {
  const match = range.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/i);
  if (!match) throw new Error(`Invalid range: ${range}`);
  return {
    startCol: colLabelToIndex(match[1]!),
    startRow: parseInt(match[2]!, 10) - 1,
    endCol: colLabelToIndex(match[3]!),
    endRow: parseInt(match[4]!, 10) - 1,
  };
}

export function parseCellAddress(addr: string): { row: number; col: number } {
  const match = addr.match(/^([A-Z]+)(\d+)$/i);
  if (!match) throw new Error(`Invalid cell address: ${addr}`);
  return {
    col: colLabelToIndex(match[1]!),
    row: parseInt(match[2]!, 10) - 1,
  };
}
