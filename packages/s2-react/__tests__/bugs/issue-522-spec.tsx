/**
 * @description spec for issue #522
 * https://github.com/antvis/S2/issues/522
 * The corner cell error rendering state
 *
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import type { SpreadSheet, Node } from '@antv/s2';
import { getContainer } from '../util/helpers';
import dataCfg from '../data/data-issue-522.json';
import { SheetComponent, type SheetComponentsProps } from '@/components';

let sheetInstance: SpreadSheet;

function MainLayout() {
  const options: SheetComponentsProps['options'] = {
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
        subTotalsDimensions: [],
      },
    },
  };

  return (
    <div>
      <SheetComponent
        onMounted={(s2) => {
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
