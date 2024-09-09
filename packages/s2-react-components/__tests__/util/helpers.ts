import { PivotSheet, type SpreadSheet } from '@antv/s2';

export const sleep = async (timeout = 0) => {
  await new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export function getMockSheetInstance(Sheet: typeof SpreadSheet = PivotSheet) {
  const instance = Object.create(Sheet.prototype);

  return instance as unknown as SpreadSheet;
}
