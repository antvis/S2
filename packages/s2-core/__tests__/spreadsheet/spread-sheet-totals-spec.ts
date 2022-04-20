import { getContainer } from 'tests/util/helpers';
import { assembleDataCfg, assembleOptions, TOTALS_OPTIONS } from 'tests/util';
import { flatMap, merge } from 'lodash';
import { PivotSheet } from '@/sheet-type';

describe('Spreadsheet Totals Tests', () => {
  let spreadsheet: PivotSheet;
  const dataCfg = assembleDataCfg();

  beforeEach(() => {
    spreadsheet = new PivotSheet(getContainer(), dataCfg, assembleOptions());
  });

  test('should render total nodes on row header', () => {
    spreadsheet.setOptions({ totals: TOTALS_OPTIONS });
    spreadsheet.render();
    const totalNodes = spreadsheet.facet.layoutResult.rowNodes.filter(
      (node) => node.isTotals,
    );
    expect(totalNodes).toHaveLength(3);

    // grand total
    const grandTotalNode = totalNodes.filter(
      (node) => node.isGrandTotals && node.level === 0,
    );
    expect(grandTotalNode).toBeDefined();

    // sub total
    const provinceSubTotalNodes = totalNodes.filter(
      (node) => node.field === 'city' && node.level === 1,
    );
    expect(provinceSubTotalNodes).toHaveLength(2); // 四川、浙江
  });

  test('should render total nodes on col header', () => {
    spreadsheet.setOptions({ totals: TOTALS_OPTIONS });
    spreadsheet.render();
    const totalNodes = spreadsheet.facet.layoutResult.colNodes.filter(
      (node) => node.isTotals,
    );
    expect(totalNodes).toHaveLength(3);

    // grand total
    const grandTotalNode = totalNodes.filter(
      (node) => node.isGrandTotals && node.level === 0,
    );
    expect(grandTotalNode).toBeDefined();

    // sub total
    const typeSubTotalNodes = totalNodes.filter(
      (node) => node.field === 'sub_type' && node.level === 1,
    );
    expect(typeSubTotalNodes).toHaveLength(2); // 家具、办公用品
  });

  test('should not render grand total nodes', () => {
    spreadsheet.setOptions({
      totals: merge({}, TOTALS_OPTIONS, {
        row: {
          showGrandTotals: false,
        },
        col: {
          showGrandTotals: false,
        },
      }),
    });
    spreadsheet.render();

    const { rowNodes, colNodes } = spreadsheet.facet.layoutResult;
    const totalNodes = flatMap([rowNodes, colNodes], (nodes) => {
      return nodes.filter((node) => node.isTotals);
    });

    expect(totalNodes.filter((node) => node.isGrandTotals)).toHaveLength(0);
    expect(totalNodes).toHaveLength(4);
  });
});
