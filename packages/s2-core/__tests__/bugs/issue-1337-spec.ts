/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * @description spec for issue #1337
 * https://github.com/antvis/S2/issues/1337
 * Row with only value field should not render total node
 */
import { getContainer } from 'tests/util/helpers';
import { assembleDataCfg, assembleOptions } from 'tests/util';
import { PivotSheet } from '@/sheet-type';

describe('Totals Tests', () => {
  let spreadsheet: PivotSheet;
  const dataCfg = assembleDataCfg({
    fields: {
      rows: [],
      columns: ['type', 'sub_type'],
      values: ['number'],
      valueInCols: false,
    },
  });

  beforeEach(() => {
    spreadsheet = new PivotSheet(getContainer(), dataCfg, assembleOptions());
  });

  test('should render total nodes correctly', async () => {
    spreadsheet.setOptions({
      totals: {
        col: {
          showGrandTotals: true,
        },
      },
    });
    await spreadsheet.render();

    // 行总计节点
    const rowTotalNodes = spreadsheet.facet.getRowTotalsNodes();

    expect(rowTotalNodes).toHaveLength(0);

    // 列总计节点
    const colTotalNodes = spreadsheet.facet.getColTotalsNodes();

    expect(colTotalNodes).toHaveLength(1);
  });
});
