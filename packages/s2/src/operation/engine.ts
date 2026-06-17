import type { WorkbookModel } from '../core/model';
import type { Operation } from './types';
import type { OperationRegistry } from './registry';

export interface AuditEntry {
  timestamp: number;
  operations: Operation[];
  source: 'human' | 'agent' | 'unknown';
}

export interface OperationEngineOptions {
  model: WorkbookModel;
  registry: OperationRegistry;
  onApplied?: (ops: Operation[], inverseOps: Operation[]) => void;
}

interface HistoryEntry {
  operations: Operation[];
  inverseOps: Operation[];
}

export class OperationEngine {
  private readonly model: WorkbookModel;
  private readonly registry: OperationRegistry;
  private readonly undoStack: HistoryEntry[] = [];
  private readonly redoStack: HistoryEntry[] = [];
  private readonly auditLog: AuditEntry[] = [];
  private readonly maxAuditEntries = 1000;
  private readonly onApplied?: (ops: Operation[], inverseOps: Operation[]) => void;

  constructor(options: OperationEngineOptions) {
    this.model = options.model;
    this.registry = options.registry;
    this.onApplied = options.onApplied;
  }

  apply(operations: Operation[]): void {
    const allInverse: Operation[] = [];

    try {
      for (const op of operations) {
        const def = this.registry.get(op.type);
        if (!def) {
          throw new Error(`Unknown operation: "${op.type}"`);
        }
        const inverse = def.execute(this.model, op.payload);
        allInverse.push(...inverse);
      }
    } catch (e) {
      for (let i = allInverse.length - 1; i >= 0; i--) {
        try {
          const invOp = allInverse[i]!;
          const def = this.registry.get(invOp.type);
          if (def) {
            def.execute(this.model, invOp.payload);
          }
        } catch {
          // Swallow rollback errors to preserve the original exception
        }
      }
      throw e;
    }

    if (allInverse.length > 0) {
      const undoable = operations.every((op) => {
        const def = this.registry.get(op.type);
        return def?.meta.undoable !== false;
      });
      if (undoable) {
        this.undoStack.push({ operations, inverseOps: allInverse });
        this.redoStack.length = 0;
      }
    }

    this.onApplied?.(operations, allInverse);

    const source = operations[0]?.source ?? 'unknown';
    this.auditLog.push({ timestamp: Date.now(), operations, source });
    if (this.auditLog.length > this.maxAuditEntries) this.auditLog.shift();
  }

  getAuditLog(limit?: number): AuditEntry[] {
    if (limit === undefined) return [...this.auditLog];
    return this.auditLog.slice(-limit);
  }

  undo(): boolean {
    const entry = this.undoStack.pop();
    if (!entry) return false;

    for (const op of entry.inverseOps) {
      const def = this.registry.get(op.type);
      if (!def) throw new Error(`Unknown operation: "${op.type}"`);
      def.execute(this.model, op.payload);
    }

    this.redoStack.push(entry);
    return true;
  }

  redo(): boolean {
    const entry = this.redoStack.pop();
    if (!entry) return false;

    for (const op of entry.operations) {
      const def = this.registry.get(op.type);
      if (!def) throw new Error(`Unknown operation: "${op.type}"`);
      def.execute(this.model, op.payload);
    }

    this.undoStack.push(entry);
    return true;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  getUndoStackSize(): number {
    return this.undoStack.length;
  }
}
