/**
 * Create By Bruce Too
 * On 2019-10-22
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
