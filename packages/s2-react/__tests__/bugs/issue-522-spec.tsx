/**
 * @description spec for issue #522
 * https://github.com/antvis/S2/issues/522
 * The corner cell error rendering state
 *
 */

import type { Node, SpreadSheet } from '@antv/s2';
import { waitFor } from '@testing-library/react';
import React from 'react';
import dataCfg from '../data/data-issue-522.json';
import { renderComponent } from '../util/helpers';
import { type SheetComponentsProps, SheetComponent } from '../../src';

let sheetInstance: SpreadSheet;

function MainLayout() {
  const options: SheetComponentsProps['options'] = {
    width: 1180,
    height: 525,
    totals: {
      row: {
        showGrandTotals: true,
        showSubTotals: true,
        reverseGrandTotalsLayout: true,
        reverseSubTotalsLayout: true,
        subTotalsDimensions: ['company', 'grade'],
      },
      col: {
        showGrandTotals: false,
        showSubTotals: false,
        reverseGrandTotalsLayout: true,
        reverseSubTotalsLayout: true,
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
  test(`sampleForAllLevels shouldn't include total node`, async () => {
    renderComponent(<MainLayout />);

    await waitFor(() => {
      const { sampleNodesForAllLevels } =
        sheetInstance.facet.getLayoutResult().rowsHierarchy;

      expect(sampleNodesForAllLevels).toHaveLength(3);

      expect(sampleNodesForAllLevels).toSatisfyAll(
        (node: Node) => !node.isTotals,
      );
    });
  });
});
