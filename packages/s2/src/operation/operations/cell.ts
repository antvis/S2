import { dateToSerial } from 'numfmt';
import type { WorkbookModel } from '../../core/model';
import type { CellStyle } from '../../core/types';
import type { Operation, OperationDefinition } from '../types';

const DATE_PATTERN = 'yyyy-mm-dd';

function coerceValue(value: unknown, autoFormat?: boolean): { value: string | number | boolean | null; style?: CellStyle } {
  if (autoFormat && value instanceof Date) {
    return { value: dateToSerial(value), style: { numFmt: DATE_PATTERN } };
  }
  return { value: value as string | number | boolean | null };
}

export const setCellValue: OperationDefinition = {
  meta: {
    needReCalc: true, affectLayout: false, undoable: true,
    description: 'Set the value of a cell',
    inputSchema: {
      type: 'object',
      properties: { sheet: { type: 'number' }, row: { type: 'number' }, col: { type: 'number' }, value: {}, autoFormat: { type: 'boolean' } },
      required: ['sheet', 'row', 'col', 'value'],
    },
  },
  execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
    const { sheet, row, col, value, autoFormat } = payload as { sheet: number; row: number; col: number; value: unknown; autoFormat?: boolean };
    if (!model.getSheet(sheet)) return [];
    const old = model.getCell(sheet, row, col);
    const { value: coerced, style: autoStyle } = coerceValue(value, autoFormat);
    if (autoStyle) {
      model.setCell(sheet, row, col, { ...(old ?? {}), value: coerced, style: { ...old?.style, ...autoStyle } });
    } else {
      // 保留 style,但清掉 formula——setCellValue 与 formula 互斥(RFC 设计决策)。
      // 整体替换会丢 numFmt 等格式,故显式列出保留字段
      const { formula: _drop, computedValue: _drop2, ...rest } = old ?? {};
      model.setCell(sheet, row, col, { ...rest, value: coerced });
    }
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
