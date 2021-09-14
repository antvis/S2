/**
 * LRU cache, can specify cache size
 */
export class LruCache<T, P> {
  // cache map
  private cache: Map<T, P>;

  // cache size
  private readonly limit: number;

  constructor(limit?: number) {
    this.cache = new Map();
    // default cache size is 1000
    this.limit = limit || 1000;
  }

  public get(key: T): P {
    const v = this.cache.get(key);
    if (v) {
      // delete pre-one and move it to end
      this.cache.delete(key);
      this.cache.set(key, v);
    }
    return v;
  }

  public put(key: T, value: P, deleteCallback?: (value: P) => void) {
    if (this.has(key)) {
      if (deleteCallback) {
        deleteCallback(this.cache.get(key));
      }
      this.cache.delete(key);
    }
    // reach limit, delete the oldest one
    if (this.cache.size >= this.limit) {
      const deleteKey = this.cache.keys().next().value;
      if (deleteCallback) {
        deleteCallback(this.cache.get(deleteKey));
      }
      this.cache.delete(deleteKey);
    }
    this.cache.set(key, value);
  }

  public has(key: T) {
    return this.cache.has(key);
  }

  public hasValue(value: P) {
    return Array.from(this.cache.values()).indexOf(value) > -1;
  }

  public getAllValues() {
    return this.cache.values();
  }

  public clear() {
    this.cache.clear();
  }

  public size() {
    return this.cache.size;
  }
}
