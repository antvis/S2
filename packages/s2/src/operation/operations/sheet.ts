import type { WorkbookModel } from '../../core/model';
import type { SheetState } from '../../core/types';
import type { Operation, OperationDefinition } from '../types';

export const createSheet: OperationDefinition = {
  meta: {
    indexChanged: true, affectLayout: true, undoable: true,
    description: 'Create a new sheet',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string' } },
    },
  },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { name, snapshot } = payload as { name?: string; snapshot?: SheetState };
    if (snapshot) {
      model.state.sheets.push(structuredClone(snapshot));
      return [{ type: 'deleteSheet', payload: { sheet: model.state.sheets.length - 1 } }];
    }
    const index = model.addSheet(name);
    return [{ type: 'deleteSheet', payload: { sheet: index } }];
  },
};

export const deleteSheet: OperationDefinition = {
  meta: {
    indexChanged: true, affectLayout: true, undoable: true,
    description: 'Delete a sheet by index',
    inputSchema: {
      type: 'object',
      properties: { sheet: { type: 'number' } },
      required: ['sheet'],
    },
  },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet } = payload as { sheet: number };
    const removed = model.removeSheet(sheet);
    if (!removed) return [];
    return [{ type: 'createSheet', payload: { snapshot: structuredClone(removed) } }];
  },
};

export const renameSheet: OperationDefinition = {
  meta: {
    undoable: true,
    description: 'Rename a sheet',
    inputSchema: {
      type: 'object',
      properties: { sheet: { type: 'number' }, name: { type: 'string' } },
      required: ['sheet', 'name'],
    },
  },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, name } = payload as { sheet: number; name: string };
    const sheetState = model.getSheet(sheet);
    if (!sheetState) return [];
    const oldName = sheetState.name;
    sheetState.name = name;
    return [{ type: 'renameSheet', payload: { sheet, name: oldName } }];
  },
};
