import type { TotalSelectionsOfMultiData } from '../../data-set/interface';

export const DEFAULT_TOTAL_SELECTIONS: TotalSelectionsOfMultiData = {
  row: {
    grandTotalOnly: false,
    subTotalOnly: false,
    totalDimensions: true,
  },
  column: {
    grandTotalOnly: false,
    subTotalOnly: false,
    totalDimensions: true,
  },
};

export enum DataSelectType {
  // 获取所有的数据
  All = 'all',
  // 只需要明细数据
  DetailOnly = 'detailOny',
  // 只需要总计/小计数据
  TotalOnly = 'totalOnly',
}
