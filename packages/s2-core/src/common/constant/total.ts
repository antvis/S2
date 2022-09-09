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
  All = 'all', // 获取所有的数据
  DetailOnly = 'detailOny', // 只需要明细数据
  TotalOnly = 'totalOnly', // 只需要总计/小计数据
}
