import type { WorkbookModel } from '../core/model';
import type { ModuleDefinition } from '../module/types';
import type { Operation } from '../operation/types';

export interface ConditionalFormatStyle {
  backgroundColor?: string;
  color?: string;
}

export interface ConditionalFormatRule {
  id: string;
  range: { startRow: number; endRow: number; startCol: number; endCol: number };
  rule: ConditionalRule;
  style: ConditionalFormatStyle;
}

export type ConditionalRule =
  | { type: 'greaterThan'; value: number }
  | { type: 'lessThan'; value: number }
  | { type: 'between'; min: number; max: number }
  | { type: 'equal'; value: number | string }
  | { type: 'colorScale'; min: string; max: string };

interface ConditionalFormatState {
  rules: Map<number, ConditionalFormatRule[]>;
  nextId: number;
}

function evaluateRule(cellValue: unknown, rule: ConditionalRule): boolean {
  if (rule.type === 'colorScale') return true;
  const num = Number(cellValue);
  if (rule.type === 'equal') return cellValue === rule.value || num === rule.value;
  if (isNaN(num)) return false;
  switch (rule.type) {
    case 'greaterThan': return num > rule.value;
    case 'lessThan': return num < rule.value;
    case 'between': return num >= rule.min && num <= rule.max;
  }
}

function interpolateColor(min: string, max: string, t: number): string {
  const parseHex = (hex: string) => {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)] as const;
  };
  const [r1, g1, b1] = parseHex(min);
  const [r2, g2, b2] = parseHex(max);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export const ConditionalFormatModule: ModuleDefinition = {
  name: 'conditionalFormat',

  state: (): ConditionalFormatState => ({ rules: new Map(), nextId: 1 }),

  operations: {
    'conditionalFormat.addRule': {
      meta: {
        affectLayout: false, undoable: true,
        description: 'Add a conditional formatting rule',
        inputSchema: {
          type: 'object',
          properties: { sheet: { type: 'number' }, range: { type: 'object' }, rule: { type: 'object' }, style: { type: 'object' } },
          required: ['sheet', 'range', 'rule', 'style'],
        },
      },
      execute(this: { state: ConditionalFormatState }, _model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, range, rule, style } = payload as {
          sheet: number;
          range: { startRow: number; endRow: number; startCol: number; endCol: number };
          rule: ConditionalRule;
          style: ConditionalFormatStyle;
        };

        const id = `cf_${this.state.nextId++}`;
        const entry: ConditionalFormatRule = { id, range, rule, style };

        if (!this.state.rules.has(sheet)) {
          this.state.rules.set(sheet, []);
        }
        this.state.rules.get(sheet)!.push(entry);

        return [{ type: 'conditionalFormat.removeRule', payload: { sheet, ruleId: id } }];
      },
    },

    'conditionalFormat.removeRule': {
      meta: {
        affectLayout: false, undoable: true,
        description: 'Remove a conditional formatting rule by ID',
        inputSchema: { type: 'object', properties: { sheet: { type: 'number' }, ruleId: { type: 'string' } }, required: ['sheet', 'ruleId'] },
      },
      execute(this: { state: ConditionalFormatState }, _model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet, ruleId } = payload as { sheet: number; ruleId: string };
        const rules = this.state.rules.get(sheet);
        if (!rules) return [];

        const idx = rules.findIndex((r) => r.id === ruleId);
        if (idx === -1) return [];

        const removed = rules.splice(idx, 1)[0]!;
        return [{
          type: 'conditionalFormat.addRule',
          payload: { sheet, range: removed.range, rule: removed.rule, style: removed.style },
        }];
      },
    },

    'conditionalFormat.clearRules': {
      meta: { affectLayout: false, undoable: true },
      execute(this: { state: ConditionalFormatState }, _model: WorkbookModel, payload: Record<string, unknown>): Operation[] {
        const { sheet } = payload as { sheet: number };
        const rules = this.state.rules.get(sheet);
        if (!rules || rules.length === 0) return [];

        const oldRules = [...rules];
        rules.length = 0;

        const inverseOps: Operation[] = oldRules.map((r) => ({
          type: 'conditionalFormat.addRule',
          payload: { sheet, range: r.range, rule: r.rule, style: r.style },
        }));
        return inverseOps;
      },
    },
  },

  serialize(state: unknown): unknown {
    const s = state as ConditionalFormatState;
    const rules: Record<string, ConditionalFormatRule[]> = {};
    for (const [sheet, ruleList] of s.rules) {
      rules[String(sheet)] = ruleList;
    }
    return { rules, nextId: s.nextId };
  },

  deserialize(data: unknown, state: unknown): void {
    const s = state as ConditionalFormatState;
    const d = data as { rules?: Record<string, ConditionalFormatRule[]>; nextId?: number };
    if (d.rules) {
      for (const [key, ruleList] of Object.entries(d.rules)) {
        s.rules.set(Number(key), ruleList);
      }
    }
    if (d.nextId) s.nextId = d.nextId;
  },

  queries: {
    'conditionalFormat.getCellStyle': (state: unknown, params: Record<string, unknown>, model: WorkbookModel) => {
      const cfState = state as ConditionalFormatState;
      const { sheet, row, col } = params as { sheet: number; row: number; col: number };

      const rules = cfState.rules.get(sheet);
      if (!rules) return null;

      const cell = model.getCell(sheet, row, col);
      const value = cell?.computedValue ?? cell?.value ?? null;

      for (let i = rules.length - 1; i >= 0; i--) {
        const entry = rules[i]!;
        const { range, rule, style } = entry;
        if (row < range.startRow || row > range.endRow || col < range.startCol || col > range.endCol) continue;

        if (rule.type === 'colorScale') {
          if (value === null || value === undefined) continue;
          const num = Number(value);
          if (isNaN(num)) continue;

          let min = Infinity;
          let max = -Infinity;
          for (let r = range.startRow; r <= range.endRow; r++) {
            for (let c = range.startCol; c <= range.endCol; c++) {
              const cv = model.getCell(sheet, r, c);
              const raw = cv?.computedValue ?? cv?.value;
              if (raw === null || raw === undefined) continue;
              const v = Number(raw);
              if (!isNaN(v)) {
                if (v < min) min = v;
                if (v > max) max = v;
              }
            }
          }

          if (min === max) return { backgroundColor: rule.min };
          const t = (num - min) / (max - min);
          return { backgroundColor: interpolateColor(rule.min, rule.max, t) };
        }

        if (evaluateRule(value, rule)) {
          return style;
        }
      }

      return null;
    },

    'conditionalFormat.getRules': (state: unknown, params: Record<string, unknown>, _model: WorkbookModel) => {
      const cfState = state as ConditionalFormatState;
      const { sheet } = params as { sheet: number };
      return cfState.rules.get(sheet) ?? [];
    },
  },
};
