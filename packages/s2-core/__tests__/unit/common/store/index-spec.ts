import { Store } from '@/common/store';

describe('Store Test', () => {
  let store: Store;

  beforeEach(() => {
    store = new Store();
  });

  test('should set and get valid key', () => {
    store.set('scrollX', 100);
    expect(store.get('scrollX')).toEqual(100);
  });

  test("should get default value when doesn't exist target key-value", () => {
    expect(store.get('scrollX', 1000)).toEqual(1000);

    store.set('scrollX', 100);
    expect(store.get('scrollX', 1000)).toEqual(100);
  });

  test('should clear exist store when call clear function', () => {
    store.set('scrollX', 100);
    expect(store.get('scrollX')).toEqual(100);

    store.clear();
    expect(store.get('scrollX')).toBeUndefined();
  });

  test('should get store size', () => {
    store.set('scrollX', 100);

    expect(store.size()).toEqual(1);
  });
});
