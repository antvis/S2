/**
 * Class to mark '小计' & '总计'
 */
export class TotalClass {
  public label: string;

  public isSubTotals: boolean;

  public isGrandTotals: boolean;

  // 是否为 小计 总计 根结点，即value = “小计”，单元格，此类结点不参与 query
  public isTotalRoot: boolean;

  public constructor(
    label: string,
    isSubTotals = false,
    isGrandTotals = false,
    isTotalRoot = false,
  ) {
    this.label = label;
    this.isSubTotals = isSubTotals;
    this.isGrandTotals = isGrandTotals;
    this.isTotalRoot = isTotalRoot;
  }
}
