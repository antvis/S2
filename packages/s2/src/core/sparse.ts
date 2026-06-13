import type { Sparse } from './types';

export function createSparse<T>(): Sparse<T> {
  return new Map();
}

export function sparseGet<T>(sparse: Sparse<T>, index: number): T | undefined {
  return sparse.get(index);
}

export function sparseSet<T>(sparse: Sparse<T>, index: number, value: T): void {
  sparse.set(index, value);
}

export function sparseDelete<T>(sparse: Sparse<T>, index: number): boolean {
  return sparse.delete(index);
}

export function sparseHas<T>(sparse: Sparse<T>, index: number): boolean {
  return sparse.has(index);
}

export function sparseSize<T>(sparse: Sparse<T>): number {
  return sparse.size;
}

export function sparseInsert<T>(sparse: Sparse<T>, index: number, count: number): void {
  const entries: [number, T][] = [];
  for (const [key, val] of sparse) {
    if (key >= index) {
      entries.push([key, val]);
    }
  }
  entries.sort((a, b) => b[0] - a[0]);
  for (const [key, val] of entries) {
    sparse.delete(key);
    sparse.set(key + count, val);
  }
}

export function sparseRemove<T>(sparse: Sparse<T>, index: number, count: number): void {
  for (let i = index; i < index + count; i++) {
    sparse.delete(i);
  }
  const entries: [number, T][] = [];
  for (const [key, val] of sparse) {
    if (key >= index + count) {
      entries.push([key, val]);
    }
  }
  entries.sort((a, b) => a[0] - b[0]);
  for (const [key, val] of entries) {
    sparse.delete(key);
    sparse.set(key - count, val);
  }
}
