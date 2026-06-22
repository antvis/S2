import { format as numfmtFormat, isDateFormat, isPercentFormat, isTextFormat, dateToSerial } from 'numfmt';
import type { WorkbookModel } from '../core/model';
import type { CellStyle } from '../core/types';
import type { ModuleDefinition } from '../module/types';
import type { Operation } from '../operation/types';
import type { CellFormatter } from '../query/query';

interface Range {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
}

export type FormatPreset =
  | { kind: 'number'; decimal?: number; group?: boolean }
  | { kind: 'currency'; decimal?: number; symbol?: string }
  | { kind: 'percent'; decimal?: number }
  | { kind: 'date' }
  | { kind: 'datetime' }
  | { kind: 'time' };

export function presetToPattern(preset: FormatPreset): string {
  const dec = (n: number | undefined) => (n && n > 0 ? '.' + '0'.repeat(n) : '');
  switch (preset.kind) {
    case 'number': {
      const g = preset.group ? '#,##0' : '0';
      return `${g}${dec(preset.decimal)}`;
    }
    case 'currency': {
      const sym = preset.symbol ?? '¥';
      const g = '#,##0';
      return `${sym}${g}${dec(preset.decimal)}`;
    }
    case 'percent':
      return `0${dec(preset.decimal)}%`;
    case 'date':
      return 'yyyy-mm-dd';
    case 'datetime':
      return 'yyyy-mm-dd hh:mm';
    case 'time':
      return 'hh:mm';
  }
}

export function getPatternType(pattern: string | undefined): 'general' | 'number' | 'percent' | 'date' | 'text' {
  if (!pattern) return 'general';
  if (isTextFormat(pattern)) return 'text';
  if (isDateFormat(pattern)) return 'date';
  if (isPercentFormat(pattern)) return 'percent';
  return 'number';
}

export function safeFormat(value: number, pattern: string, _locale: string): string {
  try {
    return numfmtFormat(pattern, value);
  } catch {
    return String(value);
  }
}

// 编辑框初值:percent 显示值*100,date 显示格式化串,其他显示 raw
export function getEditValue(value: unknown, pattern: string | undefined): string {
  if (typeof value !== 'number') return value === null ? '' : String(value);
  const type = getPatternType(pattern);
  if (type === 'percent') return String(value * 100);
  if (type === 'date' && pattern) return safeFormat(value, pattern, 'en');
  return String(value);
}

// "2023-01-15" → serial,用本地时区构造(与 autoFormat 的 new Date(y,m,d) 对齐),失败返回 null
function parseDateSerial(input: string): number | null {
  const m = input.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (isNaN(d.getTime())) return null;
  return dateToSerial(d);
}

// 编辑提交:percent 除以100,date 解析回 serial(失败降级为字符串,不清 pattern——显示/编辑仍自洽),其他 Number 或字符串
export function parseEditValue(input: string, pattern: string | undefined): { value: string | number | boolean | null } {
  if (input === '') return { value: null };
  const type = getPatternType(pattern);
  if (type === 'percent') {
    const n = Number(input);
    return isNaN(n) ? { value: input } : { value: n / 100 };
  }
  if (type === 'date') {
    const serial = parseDateSerial(input);
    return serial === null ? { value: input } : { value: serial };
  }
  const n = Number(input);
  return isNaN(n) ? { value: input } : { value: n };
}

function withNumFmt(style: CellStyle | undefined, pattern: string): CellStyle | undefined {
  if (!pattern) {
    if (!style?.numFmt) return style;
    const { numFmt: _drop, ...rest } = style;
    return rest;
  }
  return { ...style, numFmt: pattern };
}

function applyPatternToRange(model: WorkbookModel, sheet: number, range: Range, pattern: string): Operation[] {
  const inverse: Operation[] = [];
  for (let r = range.startRow; r <= range.endRow; r++) {
    for (let c = range.startCol; c <= range.endCol; c++) {
      const old = model.getCell(sheet, r, c);
      const oldPattern = old?.style?.numFmt ?? '';
      const newStyle = withNumFmt(old?.style, pattern);
      if (old) {
        model.setCell(sheet, r, c, { ...old, style: newStyle });
      } else {
        model.setCell(sheet, r, c, { style: newStyle });
      }
      inverse.push({
        type: 'format.setPattern',
        payload: { sheet, range: { startRow: r, endRow: r, startCol: c, endCol: c }, pattern: oldPattern },
      });
    }
  }
  return inverse;
}

export const FormatModule: ModuleDefinition = {
  name: 'format',

  operations: {
    'format.setPattern': {
      meta: { affectDisplayValue: true, undoable: true, description: 'Set number format pattern for a range' },
      execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, range, pattern } = payload as { sheet: number; range: Range; pattern: string };
        if (!model.getSheet(sheet)) return [];
        return applyPatternToRange(model, sheet, range, pattern);
      },
    },
    'format.setPreset': {
      meta: { affectDisplayValue: true, undoable: true, description: 'Set number format from a preset' },
      execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, range, preset } = payload as { sheet: number; range: Range; preset: FormatPreset };
        if (!model.getSheet(sheet)) return [];
        const pattern = presetToPattern(preset);
        const inverse = applyPatternToRange(model, sheet, range, pattern);
        // inverse 用 setPattern 还原旧 pattern(预设已展开为 pattern,undo 直接还原 pattern 即可)
        return inverse;
      },
    },
    'format.clear': {
      meta: { affectDisplayValue: true, undoable: true, description: 'Clear number format for a range' },
      execute(model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, range } = payload as { sheet: number; range: Range };
        if (!model.getSheet(sheet)) return [];
        return applyPatternToRange(model, sheet, range, '');
      },
    },
  },

  queries: {
    'format.getPattern': (_state: unknown, params: Record<string, unknown>, model: WorkbookModel) => {
      const { sheet, row, col } = params as { sheet: number; row: number; col: number };
      const cell = model.getCell(sheet, row, col);
      return cell?.style?.numFmt ?? null;
    },
    'format.getPatternType': (_state: unknown, params: Record<string, unknown>) => {
      const { pattern } = params as { pattern?: string };
      return getPatternType(pattern);
    },
    'format.getEditValue': (_state: unknown, params: Record<string, unknown>, _model: WorkbookModel) => {
      const { value, pattern } = params as { value: unknown; pattern?: string };
      return getEditValue(value, pattern);
    },
    'format.parseEditValue': (_state: unknown, params: Record<string, unknown>, _model: WorkbookModel) => {
      const { input, pattern } = params as { input: string; pattern?: string };
      return parseEditValue(input, pattern);
    },
  },

  lifecycle: {
    onInit(_model, queryLayer) {
      const fn: CellFormatter = (value, pattern, locale) => safeFormat(value, pattern, locale);
      queryLayer.setFormatter(fn);
    },
  },
};
