/**
 * Class to mark '小计' & '总计'
 */

export interface TotalClassConfig {
  label: string;
  // 是否属于小计汇总格
  isSubTotals: boolean;
  // 是否属于总计汇总格
  isGrandTotals: boolean;
  // 是否是”小计“、”总计“单元格本身
  isTotalRoot?: boolean;
}
export class TotalClass {
  public label: string;

  public isSubTotals: boolean;

  public isGrandTotals: boolean;

  // 是否为 小计/总计 根结点，即 value = “小计”，单元格，此类结点不参与 query
  public isTotalRoot: boolean;

  public constructor(params: TotalClassConfig) {
    const { label, isSubTotals, isGrandTotals, isTotalRoot = false } = params;

    this.label = label;
    this.isSubTotals = isSubTotals;
    this.isGrandTotals = isGrandTotals;
    this.isTotalRoot = isTotalRoot;
  }
}
