import type { WorkbookModel } from '../../core/model';
import type { Operation, OperationDefinition } from '../types';

export const setCellStyle: OperationDefinition = {
  meta: { affectLayout: false, undoable: true },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, row, col, style } = payload as { sheet: number; row: number; col: number; style: string };
    const old = model.getCell(sheet, row, col);
    const oldStyle = old?.style ?? null;
    if (old) {
      model.setCell(sheet, row, col, { ...old, style });
    } else {
      model.setCell(sheet, row, col, { style });
    }
    return [{ type: 'setCellStyle', payload: { sheet, row, col, style: oldStyle } }];
  },
};
