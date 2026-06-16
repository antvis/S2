import type { WorkbookModel } from '../core/model';
import type { ModuleDefinition } from '../module/types';
import type { Operation } from '../operation/types';

interface ClipboardData {
  values: (string | number | boolean | null)[][];
  rows: number;
  cols: number;
}

interface EditState {
  editing: { sheet: number; row: number; col: number } | null;
  clipboard: ClipboardData | null;
}

export const EditModule: ModuleDefinition = {
  name: 'edit',

  state: (): EditState => ({ editing: null, clipboard: null }),

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
      meta: { affectLayout: false, undoable: true, needReCalc: true },
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
    'edit.copy': {
      meta: { affectLayout: false, undoable: false },
      execute(this: { state: EditState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, range } = payload as {
          sheet: number;
          range: { startRow: number; endRow: number; startCol: number; endCol: number };
        };

        const values: (string | number | boolean | null)[][] = [];
        for (let r = range.startRow; r <= range.endRow; r++) {
          const row: (string | number | boolean | null)[] = [];
          for (let c = range.startCol; c <= range.endCol; c++) {
            const cell = model.getCell(sheet, r, c);
            row.push(cell?.computedValue ?? cell?.value ?? null);
          }
          values.push(row);
        }

        this.state.clipboard = {
          values,
          rows: range.endRow - range.startRow + 1,
          cols: range.endCol - range.startCol + 1,
        };

        return [];
      },
    },
    'edit.paste': {
      meta: { affectLayout: true, undoable: true },
      execute(this: { state: EditState }, model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, row, col } = payload as { sheet: number; row: number; col: number };
        if (!this.state.clipboard) return [];

        const { values } = this.state.clipboard;
        const inverseOps: Operation[] = [];

        for (let r = 0; r < values.length; r++) {
          const rowData = values[r]!;
          for (let c = 0; c < rowData.length; c++) {
            const targetRow = row + r;
            const targetCol = col + c;
            const old = model.getCell(sheet, targetRow, targetCol);
            const oldValue = old?.value ?? null;

            const newValue = rowData[c];
            if (newValue === null) {
              model.setCell(sheet, targetRow, targetCol, {});
            } else {
              model.setCell(sheet, targetRow, targetCol, { value: newValue });
            }

            inverseOps.push({
              type: 'setCellValue',
              payload: { sheet, row: targetRow, col: targetCol, value: oldValue },
            });
          }
        }

        return inverseOps;
      },
    },
  },

  queries: {
    'edit.getEditing': (state: unknown, _params: Record<string, unknown>, _model: WorkbookModel) => {
      return (state as EditState).editing;
    },
    'edit.getClipboard': (state: unknown, _params: Record<string, unknown>, _model: WorkbookModel) => {
      return (state as EditState).clipboard;
    },
  },
};
