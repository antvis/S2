/**
 * Class to mark '小计' & '总计'
 */
export class TotalClass {
  public label: string;

  public isSubTotals: boolean;

  public isGrandTotals: boolean;

  public constructor(
    label: string,
    isSubTotals = false,
    isGrandTotals = false,
  ) {
    this.label = label;
    this.isSubTotals = isSubTotals;
    this.isGrandTotals = isGrandTotals;
  }
}
