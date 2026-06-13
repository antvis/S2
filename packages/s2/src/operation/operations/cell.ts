import type { WorkbookModel } from '../../core/model';
import type { Operation, OperationDefinition } from '../types';

export const setCellValue: OperationDefinition = {
  meta: { needReCalc: true, affectLayout: false, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, row, col, value } = payload as { sheet: number; row: number; col: number; value: unknown };
    const old = model.getCell(sheet, row, col);
    // setCellValue clears formula/computedValue — cell becomes pure value
    model.setCell(sheet, row, col, { value: value as string | number | boolean | null });
    // Inverse restores the full old cell state
    if (!old) {
      if (value === null) return [];
      return [{ type: 'deleteCellValue', payload: { sheet, row, col } }];
    }
    if (old.formula) {
      // Old cell had formula — inverse needs to restore it
      return [{ type: 'restoreCell', payload: { sheet, row, col, cell: old } }];
    }
    const oldValue = old.value ?? null;
    if (oldValue === value) return [];
    return [{ type: 'setCellValue', payload: { sheet, row, col, value: oldValue } }];
  },
};

export const deleteCellValue: OperationDefinition = {
  meta: { needReCalc: true, affectLayout: false, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, row, col } = payload as { sheet: number; row: number; col: number };
    const old = model.deleteCell(sheet, row, col);
    if (!old) return [];
    return [{ type: 'restoreCell', payload: { sheet, row, col, cell: old } }];
  },
};

// Internal operation for undo — restores a full CellState
export const restoreCell: OperationDefinition = {
  meta: { needReCalc: true, affectLayout: false, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, row, col, cell } = payload as { sheet: number; row: number; col: number; cell: Record<string, unknown> };
    const old = model.getCell(sheet, row, col);
    model.setCell(sheet, row, col, cell as Parameters<WorkbookModel['setCell']>[3]);
    if (!old) {
      return [{ type: 'deleteCellValue', payload: { sheet, row, col } }];
    }
    return [{ type: 'restoreCell', payload: { sheet, row, col, cell: old } }];
  },
};
