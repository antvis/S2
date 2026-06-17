import type { WorkbookModel } from '../../core/model';
import type { CellStyle } from '../../core/types';
import type { Operation, OperationDefinition } from '../types';

export const setCellStyle: OperationDefinition = {
  meta: {
    affectLayout: false, undoable: true,
    description: 'Set the style of a cell (bold, color, backgroundColor)',
    inputSchema: {
      type: 'object',
      properties: {
        sheet: { type: 'number' }, row: { type: 'number' }, col: { type: 'number' },
        style: { type: 'object', properties: { bold: { type: 'boolean' }, color: { type: 'string' }, backgroundColor: { type: 'string' } } },
      },
      required: ['sheet', 'row', 'col', 'style'],
    },
  },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, row, col, style } = payload as { sheet: number; row: number; col: number; style: CellStyle };
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
