export interface CellChange {
  sheet: number;
  row: number;
  col: number;
}

export class ChangeSet {
  private readonly cells = new Set<string>();
  private readonly rows = new Set<string>();
  private readonly columns = new Set<string>();
  private sheetStructureChanged = false;

  markCell(sheet: number, row: number, col: number): void {
    this.cells.add(`${sheet}:${row}:${col}`);
  }

  markRow(sheet: number, row: number): void {
    this.rows.add(`${sheet}:${row}`);
  }

  markColumn(sheet: number, col: number): void {
    this.columns.add(`${sheet}:${col}`);
  }

  markSheetStructure(): void {
    this.sheetStructureChanged = true;
  }

  isCellDirty(sheet: number, row: number, col: number): boolean {
    return this.sheetStructureChanged || this.cells.has(`${sheet}:${row}:${col}`);
  }

  hasChanges(): boolean {
    return this.cells.size > 0 || this.rows.size > 0 || this.columns.size > 0 || this.sheetStructureChanged;
  }

  clear(): void {
    this.cells.clear();
    this.rows.clear();
    this.columns.clear();
    this.sheetStructureChanged = false;
  }
}
