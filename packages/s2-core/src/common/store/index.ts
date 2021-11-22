import { StoreKey } from '@/common/interface';

/**
 * Store something in {@link SpreadSheet} temporary along with it's lifecycle
 * All the keys need be declare in {@see StoreKey} first
 */
export class Store {
  private store = new Map<keyof StoreKey, unknown>();

  public set<T extends keyof StoreKey>(key: T, value: StoreKey[T]) {
    this.store.set(key, value);
  }

  public get<T extends keyof StoreKey>(
    key: T,
    defaultValue?: StoreKey[T],
  ): StoreKey[T] {
    const value = this.store.get(key);
    return (value as StoreKey[T]) ?? defaultValue;
  }

  public clear() {
    this.store.clear();
  }

  public size() {
    return this.store.size;
  }
}
