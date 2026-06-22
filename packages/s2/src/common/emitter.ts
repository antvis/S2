export type EventHandler<T = unknown> = (payload: T) => void;

export class TypedEmitter<E extends Record<string, unknown>> {
  private listeners = new Map<keyof E, Set<EventHandler<unknown>>>();

  on<K extends keyof E>(event: K, handler: EventHandler<E[K]>): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(handler as EventHandler<unknown>);
    return () => {
      set!.delete(handler as EventHandler<unknown>);
    };
  }

  emit<K extends keyof E>(event: K, payload: E[K]): void {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const handler of set) {
      (handler as EventHandler<E[K]>)(payload);
    }
  }

  removeAllListeners(event?: keyof E): void {
    if (event) this.listeners.delete(event);
    else this.listeners.clear();
  }
}
