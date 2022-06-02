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

  test('should render total nodes correctly', () => {
    spreadsheet.setOptions({
      totals: {
        col: {
          showGrandTotals: true,
        },
      },
    });
    spreadsheet.render();

    // 行总计节点
    const rowTotalNodes = spreadsheet.facet.layoutResult.rowNodes.filter(
      (node) => node.isTotals,
    );
    expect(rowTotalNodes).toHaveLength(0);

    // 列总计节点
    const columnTotalNodes = spreadsheet.facet.layoutResult.colNodes.filter(
      (node) => node.isTotals,
    );
    expect(columnTotalNodes).toHaveLength(1);
  });
});
