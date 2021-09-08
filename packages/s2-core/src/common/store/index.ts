import { StoreKey } from '@/common/interface';

/**
 * Store something in {@link SpreadSheet} temporary along with it's lifecycle
 * All the keys need be declare in {@see StoreKey} first
 */
export class Store {
  private store: Partial<StoreKey> = {};

  public set<T extends keyof StoreKey>(key: T, val: StoreKey[T]) {
    this.store[key] = val;
  }

  public get<T extends keyof StoreKey>(
    key: T,
    defaultValue?: StoreKey[T],
  ): StoreKey[T] {
    const v = this.store[key];
    return (v as StoreKey[T]) ?? defaultValue;
  }

  public clear() {
    this.store = {};
  }
}
