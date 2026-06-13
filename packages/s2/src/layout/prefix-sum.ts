export class PrefixSumArray {
  private readonly sums: number[];
  private readonly defaultSize: number;
  private readonly customSizes: Map<number, number>;
  private count: number;

  constructor(count: number, defaultSize: number) {
    this.count = count;
    this.defaultSize = defaultSize;
    this.customSizes = new Map();
    this.sums = new Array(count + 1);
    this.rebuild();
  }

  getCount(): number {
    return this.count;
  }

  setCount(count: number): void {
    if (count === this.count) return;
    this.count = count;
    this.rebuild();
  }

  setSize(index: number, size: number): void {
    this.customSizes.set(index, size);
    this.rebuild();
  }

  getOffset(index: number): number {
    if (index <= 0) return 0;
    if (index > this.count) return this.sums[this.count]!;
    return this.sums[index]!;
  }

  getSize(index: number): number {
    return this.customSizes.get(index) ?? this.defaultSize;
  }

  getTotalSize(): number {
    return this.sums[this.count]!;
  }

  findIndexAtOffset(offset: number): number {
    if (offset <= 0) return 0;
    let lo = 0;
    let hi = this.count;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (this.sums[mid + 1]! <= offset) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    return Math.min(lo, this.count - 1);
  }

  private rebuild(): void {
    if (this.sums.length !== this.count + 1) {
      this.sums.length = this.count + 1;
    }
    this.sums[0] = 0;
    for (let i = 0; i < this.count; i++) {
      this.sums[i + 1] = this.sums[i]! + (this.customSizes.get(i) ?? this.defaultSize);
    }
  }
}
