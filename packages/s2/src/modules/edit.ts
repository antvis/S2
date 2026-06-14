import type { WorkbookModel } from '../core/model';
import type { ModuleDefinition } from '../module/types';
import type { Operation } from '../operation/types';

interface EditState {
  editing: { sheet: number; row: number; col: number } | null;
}

export const EditModule: ModuleDefinition = {
  name: 'edit',

  state: (): EditState => ({ editing: null }),

  operations: {
    'edit.start': {
      meta: { affectLayout: false, undoable: false },
      execute(this: { state: EditState }, _model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, row, col } = payload as { sheet: number; row: number; col: number };
        this.state.editing = { sheet, row, col };
        return [];
      },
    },
    'edit.commit': {
      meta: { affectLayout: false, undoable: true },
      execute(this: { state: EditState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, row, col, value } = payload as { sheet: number; row: number; col: number; value: string | number | boolean | null };
        this.state.editing = null;

        const old = model.getCell(sheet, row, col);
        const oldValue = old?.value ?? null;

        if (value === null) {
          model.setCell(sheet, row, col, {});
        } else {
          model.setCell(sheet, row, col, { ...old, value });
        }

        return [{ type: 'edit.commit', payload: { sheet, row, col, value: oldValue } }];
      },
    },
    'edit.cancel': {
      meta: { affectLayout: false, undoable: false },
      execute(this: { state: EditState }, _model: WorkbookModel, _payload: Record<string, unknown>): Operation[] {
        this.state.editing = null;
        return [];
      },
    },
  },

  queries: {
    'edit.getEditing': (state: unknown, _params: Record<string, unknown>, _model: WorkbookModel) => {
      return (state as EditState).editing;
    },
  },
};
