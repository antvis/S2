export class TotalMeasure {
  public label: string;

  public constructor(label: string) {
    this.label = label;
  }

  static isTotalMeasureInstance(value: unknown): value is TotalMeasure {
    return value instanceof TotalMeasure;
  }
}
