export { createWorkbook } from './workbook';
export type { Workbook, CreateWorkbookOptions, AgentAPI } from './workbook';
export { defineModule } from './module/define';
export type { ModuleDefinition, ModuleLifecycle, ModuleQueryDef, CellRendererFn, CellRenderContext } from './module/types';
export type { Operation, OperationMeta, OperationDefinition } from './operation/types';
export type { AuditEntry } from './operation/engine';
export type { CellState, RowState, ColumnState, SheetState, WorkbookState, Sparse, MergeRange, CellStyle } from './core/types';
export type { HierarchyTreeNode, HierarchyLayout } from './layout/types';
export { PivotModule } from './modules/pivot';
export type { PivotConfig } from './modules/pivot';
export { FormulaModule } from './modules/formula';
export { FilterModule } from './modules/filter';
export { SortModule } from './modules/sort';
export { FreezeModule } from './modules/freeze';
export { EditModule } from './modules/edit';
export { ConditionalFormatModule } from './modules/conditional-format';
export { AgentModule } from './modules/agent';
export type { AgentContext, MCPToolSchema, FormulaTrace } from './modules/agent';

import { PivotModule } from './modules/pivot';
import { FormulaModule } from './modules/formula';
import { FilterModule } from './modules/filter';
import { SortModule } from './modules/sort';
import { FreezeModule } from './modules/freeze';
import { EditModule } from './modules/edit';
import { ConditionalFormatModule } from './modules/conditional-format';
import { AgentModule } from './modules/agent';
import type { ModuleDefinition } from './module/types';

export const allModules: ModuleDefinition[] = [
  PivotModule,
  FormulaModule,
  FilterModule,
  SortModule,
  FreezeModule,
  EditModule,
  ConditionalFormatModule,
  AgentModule,
];
export { mountCanvas } from './canvas/mount';
export type { CanvasHandle } from './canvas/mount';
export { createPivotTable, createTable, WorkbookFacade, SheetFacade, CellFacade, RangeFacade, parseRange, parseCellAddress } from './facade/index';
export type { PivotTableConfig, TableConfig } from './facade/index';
