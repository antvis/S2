import type { WorkbookModel } from '../../core/model';
import type { Operation, OperationDefinition } from '../types';

export const setSelection: OperationDefinition = {
  meta: { undoable: false, affectLayout: false },
  execute(_model: WorkbookModel, _payload: Record<string, unknown>): Operation[] {
    return [];
  },
};
