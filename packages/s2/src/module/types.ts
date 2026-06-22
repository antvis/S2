import type { Operation, OperationDefinition } from '../operation/types';
import type { WorkbookModel } from '../core/model';
import type { QueryLayer } from '../query/query';

export interface ModuleLifecycle {
  onInit?: (model: WorkbookModel, queryLayer: QueryLayer) => void;
  onDestroy?: () => void;
  onOperationApplied?: (ops: Operation[], model: WorkbookModel) => void;
}

export interface ModuleQueryDef {
  [queryName: string]: (state: unknown, params: Record<string, unknown>, model: WorkbookModel) => unknown;
}

export interface CellRenderContext {
  sheet: number;
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type CellRendererFn = (
  ctx: CanvasRenderingContext2D,
  box: CellRenderContext,
  query: { moduleQuery: (name: string, params: Record<string, unknown>) => unknown },
) => void;

export interface ModuleDefinition {
  name: string;
  deps?: ModuleDefinition[];
  state?: () => unknown;
  operations?: Record<string, OperationDefinition>;
  queries?: ModuleQueryDef;
  renderers?: Record<string, CellRendererFn>;
  lifecycle?: ModuleLifecycle;
  serialize?: (state: unknown) => unknown;
  deserialize?: (data: unknown, state: unknown) => void;
}
