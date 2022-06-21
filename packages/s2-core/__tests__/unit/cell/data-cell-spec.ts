import { get } from 'lodash';
import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant/basic';
import type { Formatter, ViewMeta } from '@/common';
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

  test('should return correct formatted value', () => {
    const formatter: Formatter = (value, data) => `${get(data, 'value') * 10}`;
    jest.spyOn(s2.dataSet, 'getFieldFormatter').mockReturnValue(formatter);

    const dataCell = new DataCell(meta, s2);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(dataCell.textShape.attr('text')).toEqual('120');
  });

  test('should draw condition interval shape', () => {
    const cellWidth = 120;
    const fieldValue = 27.334666666666667;
    const anotherMeta = {
      width: cellWidth,
      valueField: 'value',
      fieldValue,
      data: {
        city: 'chengdu',
        value: fieldValue,
        [VALUE_FIELD]: 'value',
        [EXTRA_FIELD]: fieldValue,
      },
    } as unknown as ViewMeta;

    jest.spyOn(s2.dataSet, 'getValueRangeByField').mockReturnValue({
      minValue: 0,
      maxValue: fieldValue,
    });

    s2.setOptions({
      conditions: {
        interval: [
          {
            field: 'value',
            mapping: () => ({ fill: 'red' }),
          },
        ],
      },
    });

    const dataCell = new DataCell(anotherMeta, s2);
    expect(get(dataCell, 'conditionIntervalShape.attrs.width')).toEqual(
      cellWidth,
    );
  });
});
