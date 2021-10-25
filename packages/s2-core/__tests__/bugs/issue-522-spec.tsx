/**
 * @description spec for issue #522
 * https://github.com/antvis/S2/issues/522
 * Show err when hierarchyTypxe is tree and data is empty
 *
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getContainer } from '../util/helpers';
import dataCfg from '../data/data-issue-522.json';
import { SheetComponent, SpreadSheet, Node } from '@/index';

let sheetInstance: SpreadSheet;

function MainLayout() {
  const options = {
    style: {
      treeRowsWidth: 120,
      cellCfg: {
        height: 32,
      },
    },
    containsRowHeader: true,
    valueInCols: true,
    width: 1180,
    height: 525,
    totals: {
      row: {
        showGrandTotals: true,
        showSubTotals: true,
        reverseLayout: true,
        reverseSubLayout: true,
        subTotalsDimensions: ['company', 'grade'],
      },
      col: {
        showGrandTotals: false,
        showSubTotals: false,
        reverseLayout: true,
        reverseSubLayout: true,
        subTotalsDimensions: null,
      },
    },
  };
  return (
    <div>
      <SheetComponent
        getSpreadsheet={(s2) => {
          sheetInstance = s2;
        }}
        dataCfg={dataCfg}
        options={options}
      />
    </div>
  );
}

describe('spreadsheet normal spec', () => {
  act(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });
  test(`sampleForAllLevels shouldn't include total node`, () => {
    const { sampleNodesForAllLevels } =
      sheetInstance.facet.layoutResult.rowsHierarchy;

    expect(sampleNodesForAllLevels).toHaveLength(3);

    expect(sampleNodesForAllLevels).toSatisfyAll(
      (node: Node) => !node.isTotals,
    );
  });
});
