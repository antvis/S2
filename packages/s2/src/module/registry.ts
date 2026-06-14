import type { ModuleDefinition } from './types';
import type { WorkbookModel } from '../core/model';
import type { OperationRegistry } from '../operation/registry';
import type { QueryLayer } from '../query/query';
import type { Operation } from '../operation/types';

interface ModuleInstance {
  definition: ModuleDefinition;
  state: unknown;
}

export class ModuleRegistry {
  private readonly modules: ModuleInstance[] = [];
  private sorted = false;

  register(definition: ModuleDefinition, operationRegistry: OperationRegistry, queryLayer?: QueryLayer): void {
    this.checkDeps(definition);

    const state = definition.state?.() ?? null;
    this.modules.push({ definition, state });

    if (definition.operations) {
      for (const [type, opDef] of Object.entries(definition.operations)) {
        const boundExecute = (model: WorkbookModel, payload: Record<string, unknown>) => {
          const ctx = { state } as { state: unknown };
          return opDef.execute.call(ctx, model as never, payload);
        };
        operationRegistry.register(type, { meta: opDef.meta, execute: boundExecute });
      }
    }

    if (definition.queries && queryLayer) {
      for (const [name, handler] of Object.entries(definition.queries)) {
        queryLayer.registerModuleQuery(name, handler, () => state);
      }
    }

    this.sorted = false;
  }

  init(): void {
    this.ensureSorted();
    for (const mod of this.modules) {
      const ctx = { state: mod.state };
      mod.definition.lifecycle?.onInit?.call(ctx);
    }
  }

  destroy(): void {
    for (const mod of this.modules) {
      const ctx = { state: mod.state };
      mod.definition.lifecycle?.onDestroy?.call(ctx);
    }
  }

  notifyOperationApplied(ops: Operation[], model?: WorkbookModel): void {
    this.ensureSorted();
    for (const mod of this.modules) {
      const ctx = { state: mod.state };
      mod.definition.lifecycle?.onOperationApplied?.call(ctx, ops, model!);
    }
  }

  getModuleState(name: string): unknown {
    const mod = this.modules.find((m) => m.definition.name === name);
    return mod?.state;
  }

  serializeAll(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const mod of this.modules) {
      if (mod.definition.serialize) {
        result[mod.definition.name] = mod.definition.serialize(mod.state);
      }
    }
    return result;
  }

  deserializeAll(data: Record<string, unknown>): void {
    for (const mod of this.modules) {
      const moduleData = data[mod.definition.name];
      if (moduleData !== undefined && mod.definition.deserialize) {
        mod.definition.deserialize(moduleData, mod.state);
      }
    }
  }

  private checkDeps(definition: ModuleDefinition): void {
    if (!definition.deps) return;
    for (const dep of definition.deps) {
      const found = this.modules.some((m) => m.definition.name === dep.name);
      if (!found) {
        throw new Error(
          `Module "${definition.name}" depends on "${dep.name}" which is not registered. ` +
          `Register "${dep.name}" before "${definition.name}".`
        );
      }
    }
  }

  private ensureSorted(): void {
    if (this.sorted) return;
    const sorted: ModuleInstance[] = [];
    const visited = new Set<string>();
    const visit = (mod: ModuleInstance) => {
      if (visited.has(mod.definition.name)) return;
      visited.add(mod.definition.name);
      if (mod.definition.deps) {
        for (const dep of mod.definition.deps) {
          const depMod = this.modules.find((m) => m.definition.name === dep.name);
          if (depMod) visit(depMod);
        }
      }
      sorted.push(mod);
    };
    for (const mod of this.modules) {
      visit(mod);
    }
    this.modules.length = 0;
    this.modules.push(...sorted);
    this.sorted = true;
  }
}
