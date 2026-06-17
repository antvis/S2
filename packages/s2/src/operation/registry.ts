import type { OperationDefinition } from './types';

export class OperationRegistry {
  private readonly handlers = new Map<string, OperationDefinition>();

  register(type: string, definition: OperationDefinition): void {
    if (this.handlers.has(type)) {
      throw new Error(`Operation "${type}" is already registered`);
    }
    this.handlers.set(type, definition);
  }

  get(type: string): OperationDefinition | undefined {
    return this.handlers.get(type);
  }

  has(type: string): boolean {
    return this.handlers.has(type);
  }

  list(): Map<string, OperationDefinition> {
    return new Map(this.handlers);
  }
}
