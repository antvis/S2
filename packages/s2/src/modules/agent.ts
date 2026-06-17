import type { ModuleDefinition } from '../module/types';
import type { Operation, OperationDefinition } from '../operation/types';
import type { WorkbookModel } from '../core/model';

export interface AgentContext {
  sheets: { name: string; rowCount: number; colCount: number }[];
  schema: Record<string, string>;
  pivotConfig?: unknown;
  currentFilters: unknown[];
  sortState: unknown;
  cellCount: number;
  formulaCount: number;
}

export interface MCPToolSchema {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface FormulaTrace {
  formula: string;
  dependencies: { sheet: number; row: number; col: number }[];
  result: unknown;
}

export interface AuditEntry {
  timestamp: number;
  operations: Operation[];
  source: 'human' | 'agent' | 'unknown';
}

interface AgentState {
  _operationRegistry: { list(): Map<string, OperationDefinition> } | null;
  _engine: { getAuditLog(limit?: number): AuditEntry[] } | null;
  _queryLayer: { moduleQuery(name: string, params: Record<string, unknown>): unknown } | null;
}

export const AgentModule: ModuleDefinition = {
  name: 'agent',

  state: (): AgentState => ({
    _operationRegistry: null,
    _engine: null,
    _queryLayer: null,
  }),

  queries: {
    'agent.getContext': (state: unknown, params: Record<string, unknown>, model: WorkbookModel) => {
      const s = state as AgentState;
      const targetSheet = (params as { sheet?: number }).sheet;

      const sheets: AgentContext['sheets'] = [];
      for (const sheet of model.state.sheets) {
        let maxRow = 0;
        let maxCol = 0;
        for (const [row, rowData] of sheet.cells) {
          if (row > maxRow) maxRow = row;
          for (const [col] of rowData) {
            if (col > maxCol) maxCol = col;
          }
        }
        sheets.push({ name: sheet.name, rowCount: maxRow + 1, colCount: maxCol + 1 });
      }

      const sheetIdx = targetSheet ?? 0;
      const targetSheetState = model.state.sheets[sheetIdx];
      let cellCount = 0;
      let formulaCount = 0;
      const schema: Record<string, string> = {};
      if (targetSheetState) {
        const headerRow = targetSheetState.cells.get(0);
        for (const [row, rowData] of targetSheetState.cells) {
          for (const [col, cell] of rowData) {
            cellCount++;
            if (cell.formula) formulaCount++;
            if (row === 1 && cell.value !== null && cell.value !== undefined) {
              const headerCell = headerRow?.get(col);
              const colName = headerCell?.value != null ? String(headerCell.value) : `col${col}`;
              schema[colName] = typeof cell.value;
            }
          }
        }
      }

      let pivotConfig: unknown = null;
      let currentFilters: unknown[] = [];
      let sortState: unknown = null;
      if (s._queryLayer) {
        try { pivotConfig = s._queryLayer.moduleQuery('pivot.getConfig', { sheet: sheetIdx }); } catch {}
        try { currentFilters = (s._queryLayer.moduleQuery('filter.getRules', { sheet: sheetIdx }) as unknown[]) ?? []; } catch {}
        try { sortState = s._queryLayer.moduleQuery('sort.getState', { sheet: sheetIdx }); } catch {}
      }

      return { sheets, schema, pivotConfig, currentFilters, sortState, cellCount, formulaCount } as AgentContext;
    },

    'agent.getMCPTools': (state: unknown, _params: Record<string, unknown>, _model: WorkbookModel) => {
      const s = state as AgentState;
      if (!s._operationRegistry) return [];
      const tools: MCPToolSchema[] = [];
      for (const [name, def] of s._operationRegistry.list()) {
        if (def.meta.inputSchema && def.meta.description) {
          tools.push({ name, description: def.meta.description, inputSchema: def.meta.inputSchema });
        }
      }
      return tools;
    },

    'agent.traceFormula': (state: unknown, params: Record<string, unknown>, _model: WorkbookModel) => {
      const s = state as AgentState;
      if (!s._queryLayer) return null;
      try {
        return s._queryLayer.moduleQuery('formula.traceFormula', params);
      } catch {
        return null;
      }
    },

    'agent.getAuditLog': (state: unknown, params: Record<string, unknown>, _model: WorkbookModel) => {
      const s = state as AgentState;
      if (!s._engine) return [];
      const { limit } = params as { limit?: number };
      return s._engine.getAuditLog(limit);
    },
  },
};
