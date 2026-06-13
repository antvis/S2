import type { WorkbookModel } from '../../core/model';
import type { Operation, OperationDefinition } from '../types';

export const createSheet: OperationDefinition = {
  meta: { indexChanged: true, affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { name } = payload as { name?: string };
    const index = model.addSheet(name);
    return [{ type: 'deleteSheet', payload: { sheet: index } }];
  },
};

export const deleteSheet: OperationDefinition = {
  meta: { indexChanged: true, affectLayout: true, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet } = payload as { sheet: number };
    const sheetState = model.getSheet(sheet);
    if (!sheetState) return [];
    const removed = model.removeSheet(sheet);
    if (!removed) return [];
    return [{ type: 'createSheet', payload: { name: removed.name } }];
  },
};
