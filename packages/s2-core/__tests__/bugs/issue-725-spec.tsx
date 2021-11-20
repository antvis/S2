/**
 * @description spec for issue #725
 * https://github.com/antvis/S2/issues/725
 * Wrong multi measure render
 * Wrong group sort
 *
 */

import * as mockDataConfig from 'tests/data/data-issue-725.json';
import { assembleDataCfg } from '../util';
import { S2DataConfig } from '@/common/interface';
import { PivotSheet } from '@/sheet-type';
import { PivotDataSet } from '@/data-set';
import { EXTRA_FIELD } from '@/common/constant';
import { getDimensionsWithoutPathPre } from '@/utils/dataset/pivot-data-set';

jest.mock('@/sheet-type');

const MockPivotSheet = PivotSheet as unknown as jest.Mock<PivotSheet>;
let dataSet: PivotDataSet;

describe('Multi Measure Correct Render Tests1', () => {
  const dataCfg: S2DataConfig = assembleDataCfg({
    ...mockDataConfig,
  });

  beforeEach(() => {
    MockPivotSheet.mockClear();
    const mockSheet = new MockPivotSheet();
    dataSet = new PivotDataSet(mockSheet);
    dataSet.setDataCfg(dataCfg);
  });

  test('should get correct values', () => {
    expect(
      getDimensionsWithoutPathPre(dataSet.getDimensionValues(EXTRA_FIELD)),
    ).toEqual(['price', 'cost']);
  });
});

describe('Group Sort When Have Same Child Measure', () => {
  const dataCfg: S2DataConfig = assembleDataCfg({
    ...mockDataConfig,
    sortParams: [
      {
        sortFieldId: 'type',
        sortByMeasure: 'cost',
        sortMethod: 'asc',
      },
    ],
  });

  beforeEach(() => {
    dataSet.setDataCfg(dataCfg);
  });

  test('should get correct group sort', () => {
    expect(
      getDimensionsWithoutPathPre(dataSet.getDimensionValues('type')),
    ).toEqual(['办公用品', '家具产品', '家具产品', '办公用品']);
    expect(
      getDimensionsWithoutPathPre(
        dataSet.getDimensionValues('type', { city: '白山' }),
      ),
    ).toEqual(['办公用品', '家具产品']);
    expect(
      getDimensionsWithoutPathPre(
        dataSet.getDimensionValues('type', { city: '抚顺' }),
      ),
    ).toEqual(['家具产品', '办公用品']);
  });
});
