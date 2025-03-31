export class BaseCellPool<T> {
  pool: T[] = [];

  acquire(): T | undefined {
    return this.pool.shift();
  }

  release(cell: T) {
    this.pool.push(cell);
  }
}
