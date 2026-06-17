import type { WorkbookModel } from '../core/model';
import type { ModuleDefinition } from '../module/types';
import type { Operation } from '../operation/types';

interface FreezeConfig {
  frozenRows: number;
  frozenCols: number;
}

interface FreezeState {
  configs: Map<number, FreezeConfig>; // sheet -> config
}

export const FreezeModule: ModuleDefinition = {
  name: 'freeze',

  state: (): FreezeState => ({ configs: new Map() }),

  operations: {
    'freeze.set': {
      meta: {
        affectLayout: true, undoable: true,
        description: 'Freeze rows and/or columns',
        inputSchema: { type: 'object', properties: { sheet: { type: 'number' }, frozenRows: { type: 'number' }, frozenCols: { type: 'number' } }, required: ['sheet', 'frozenRows', 'frozenCols'] },
      },
      execute(this: { state: FreezeState }, _model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, frozenRows, frozenCols } = payload as { sheet: number; frozenRows: number; frozenCols: number };
        const oldConfig = this.state.configs.get(sheet);

        this.state.configs.set(sheet, { frozenRows, frozenCols });

        if (oldConfig) {
          return [{ type: 'freeze.set', payload: { sheet, ...oldConfig } }];
        }
        return [{ type: 'freeze.clear', payload: { sheet } }];
      },
    },
    'freeze.clear': {
      meta: {
        affectLayout: true, undoable: true,
        description: 'Clear frozen rows/columns',
        inputSchema: { type: 'object', properties: { sheet: { type: 'number' } }, required: ['sheet'] },
      },
      execute(this: { state: FreezeState }, _model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet } = payload as { sheet: number };
        const oldConfig = this.state.configs.get(sheet);

        this.state.configs.delete(sheet);

        if (oldConfig) {
          return [{ type: 'freeze.set', payload: { sheet, ...oldConfig } }];
        }
        return [];
      },
    },
  },

  queries: {
    'freeze.getConfig': (state: unknown, params: Record<string, unknown>, _model: WorkbookModel) => {
      const freezeState = state as FreezeState;
      const { sheet } = params as { sheet: number };
      return freezeState.configs.get(sheet) ?? null;
    },
  },

  lifecycle: {},
};
