/**
 * @description spec for issue #2528
 * https://github.com/antvis/S2/issues/2528
 */

import type { S2DataConfig, S2Options, SpreadSheet } from '@/index';
import { TableSheet } from '@/sheet-type';
import * as mockDataConfig from '../data/simple-table-data.json';
import { getContainer } from '../util/helpers';

const s2DataConfig: S2DataConfig = {
  ...mockDataConfig,
  meta: [{ field: 'cost', formatter: (v) => `${v}-@` }],
};

const s2Options: S2Options = {
  width: 800,
  height: 400,
};

describe('Table Sheet Editable Formatter Tests', () => {
  let s2: SpreadSheet;

  beforeEach(async () => {
    s2 = new TableSheet(getContainer(), s2DataConfig, s2Options);

    await s2.render();
  });

  test('should get formatted data', () => {
    const costValues = s2.facet
      .getDataCells()
      .filter((cell) => cell.getMeta().valueField === 'cost')
      .map((cell) => cell.getFieldValue());

    expect(costValues).toEqual(['2-@', '2-@', '2-@']);
  });

  test('should only format data once after data edited', async () => {
    const id = '0-root[&]cost';
    const inputValue = 'test';

    // 模拟一次编辑 (更新第一行的 cost)
    const displayData = s2.dataSet.getDisplayDataSet();

    displayData[0]['cost'] = inputValue;
    s2.dataSet.displayFormattedValueMap?.set(id, inputValue);

    await s2.render();

    const costValues = s2.facet
      .getDataCells()
      .filter((cell) => cell.getMeta().valueField === 'cost')
      .map((cell) => cell.getFieldValue());

    expect(costValues).toEqual([inputValue, '2-@', '2-@']);
  });
});
