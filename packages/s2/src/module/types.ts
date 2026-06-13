import type { Operation, OperationDefinition } from '../operation/types';
import type { WorkbookModel } from '../core/model';

export interface ModuleLifecycle {
  onInit?: () => void;
  onDestroy?: () => void;
  onOperationApplied?: (ops: Operation[], model: WorkbookModel) => void;
}

export interface ModuleQueryDef {
  [queryName: string]: (state: unknown, params: Record<string, unknown>) => unknown;
}

export interface ModuleDefinition {
  name: string;
  deps?: ModuleDefinition[];
  state?: () => unknown;
  operations?: Record<string, OperationDefinition>;
  queries?: ModuleQueryDef;
  lifecycle?: ModuleLifecycle;
}
