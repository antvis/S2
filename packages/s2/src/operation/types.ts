export interface Operation {
  type: string;
  payload: Record<string, unknown>;
  source?: 'human' | 'agent';
}

export interface OperationMeta {
  needReCalc?: boolean;
  indexChanged?: boolean;
  affectLayout?: boolean;
  undoable?: boolean;
  description?: string;
  inputSchema?: Record<string, unknown>;
}

import type { WorkbookModel } from '../core/model';

export type OperationHandler = (
  model: WorkbookModel,
  payload: Record<string, unknown>
) => Operation[];

export interface OperationDefinition {
  meta: OperationMeta;
  execute: OperationHandler;
}
