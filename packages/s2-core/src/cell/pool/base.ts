export class BaseCellPool<T> {
  pool: T[] = [];

  acquire(): T | undefined {
    return this.pool.pop();
  }

  release(cell: T) {
    this.pool.push(cell);
  }
}
