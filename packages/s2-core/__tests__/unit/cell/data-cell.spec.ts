import { doc } from 'prettier';
import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant/basic';
import { ViewMeta } from '@/common';
import { PivotDataSet } from '@/data-set';
import { SpreadSheet, PivotSheet } from '@/sheet-type';
import { DataCell } from '@/cell';

const MockPivotSheet = PivotSheet as unknown as jest.Mock<PivotSheet>;
const MockPivotDataSet = PivotDataSet as unknown as jest.Mock<PivotDataSet>;
describe('data cell formatter test', () => {
  const meta = {
    data: {
      city: 'chengdu',
      value: 12,
      [VALUE_FIELD]: 'value',
      [EXTRA_FIELD]: 12,
    },
  } as unknown as ViewMeta;

  let s2: SpreadSheet;
  beforeEach(() => {
    const container = document.createElement('div');

    s2 = new MockPivotSheet(container);
    const dataSet: PivotDataSet = new MockPivotDataSet(s2);
    s2.dataSet = dataSet;
  });
  test('should pass complete data into formater', () => {
    const formatter = jest.fn();
    jest.spyOn(s2.dataSet, 'getFieldFormatter').mockReturnValue(formatter);

    const dataCell = new DataCell(meta, s2);

    expect(formatter).toHaveBeenCalledWith(undefined, {
      city: 'chengdu',
      value: 12,
      [VALUE_FIELD]: 'value',
      [EXTRA_FIELD]: 12,
    });
  });
});
