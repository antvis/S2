import type { WorkbookModel } from '../../core/model';
import type { Operation, OperationDefinition } from '../types';

export const setCellValue: OperationDefinition = {
  meta: {
    needReCalc: true, affectLayout: false, undoable: true,
    description: 'Set the value of a cell',
    inputSchema: {
      type: 'object',
      properties: { sheet: { type: 'number' }, row: { type: 'number' }, col: { type: 'number' }, value: {} },
      required: ['sheet', 'row', 'col', 'value'],
    },
  },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, row, col, value } = payload as { sheet: number; row: number; col: number; value: unknown };
    if (!model.getSheet(sheet)) return [];
    const old = model.getCell(sheet, row, col);
    model.setCell(sheet, row, col, { value: value as string | number | boolean | null });
    if (!old) {
      if (value === null) return [];
      return [{ type: 'deleteCellValue', payload: { sheet, row, col } }];
    }
    if (old.formula) {
      return [{ type: 'restoreCell', payload: { sheet, row, col, cell: old } }];
    }
    const oldValue = old.value ?? null;
    if (oldValue === value) return [];
    return [{ type: 'setCellValue', payload: { sheet, row, col, value: oldValue } }];
  },
};

export const deleteCellValue: OperationDefinition = {
  meta: {
    needReCalc: true, affectLayout: false, undoable: true,
    description: 'Delete the value of a cell',
    inputSchema: {
      type: 'object',
      properties: { sheet: { type: 'number' }, row: { type: 'number' }, col: { type: 'number' } },
      required: ['sheet', 'row', 'col'],
    },
  },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, row, col } = payload as { sheet: number; row: number; col: number };
    if (!model.getSheet(sheet)) return [];
    const old = model.deleteCell(sheet, row, col);
    if (!old) return [];
    return [{ type: 'restoreCell', payload: { sheet, row, col, cell: old } }];
  },
};

export const restoreCell: OperationDefinition = {
  meta: { needReCalc: true, affectLayout: false, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, row, col, cell } = payload as { sheet: number; row: number; col: number; cell: Record<string, unknown> };
    if (!model.getSheet(sheet)) return [];
    const old = model.getCell(sheet, row, col);
    model.setCell(sheet, row, col, cell as Parameters<WorkbookModel['setCell']>[3]);
    if (!old) {
      return [{ type: 'deleteCellValue', payload: { sheet, row, col } }];
    }
    return [{ type: 'restoreCell', payload: { sheet, row, col, cell: old } }];
  },
};
