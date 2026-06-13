import type { WorkbookModel } from '../../core/model';
import type { Operation, OperationDefinition } from '../types';

export const setSelection: OperationDefinition = {
  meta: { undoable: false, affectLayout: false },
  execute(_model: WorkbookModel, _payload: Record<string, unknown>): Operation[] {
    // Selection is transient state — not persisted in model, not undoable.
    // Canvas Runtime will read this from a separate selection store.
    // For now, this is a no-op placeholder that validates the operation protocol.
    return [];
  },
};
