/**
 * @description spec for issue #2385
 * https://github.com/antvis/S2/issues/2385
 */
import type { S2Options, SpreadSheet } from '../../src';
import * as mockDataConfig from '../data/data-issue-2385.json';
import { getContainer } from '../util/helpers';
import { PivotSheet, TableSheet } from '@/sheet-type';

const s2Options: S2Options = {
  width: 800,
  height: 600,
  style: {
    cellCfg: {
      width: 200,
    },
    layoutWidthType: 'compact',
  },
  showDefaultHeaderActionIcon: false,
};

describe('Compare Layout Tests', () => {
  const mapWidthList = (s2: SpreadSheet) => {
    const colLeafNodeWidthList = s2.facet.layoutResult.colLeafNodes.map(
      (node) => Math.floor(node.width),
    );
    const dataCellWidthList = s2.interaction
      .getPanelGroupAllDataCells()
      .map((cell) => Math.floor(cell.getMeta().width));

    return {
      colLeafNodeWidthList,
      dataCellWidthList,
    };
  };

  test.each([
    { showDefaultHeaderActionIcon: true },
    { showDefaultHeaderActionIcon: false },
  ])('should get max col width for pivot sheet by %o', (options) => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, {
      ...s2Options,
      ...options,
    });
    s2.setTheme({
      dataCell: {
        text: {
          fontSize: 20,
        },
      },
    });
    s2.render();

    const { dataCellWidthList, colLeafNodeWidthList } = mapWidthList(s2);

    expect(dataCellWidthList).toEqual(
      options.showDefaultHeaderActionIcon
        ? [179, 179, 179, 179, 98, 98, 98, 98, 81, 81, 81, 81]
        : [179, 179, 179, 179, 98, 98, 98, 98, 69, 69, 69, 69],
    );
    expect(colLeafNodeWidthList).toEqual(
      options.showDefaultHeaderActionIcon ? [179, 98, 81] : [179, 98, 69],
    );
  });

  test.each([
    { showDefaultHeaderActionIcon: true },
    { showDefaultHeaderActionIcon: false },
  ])('should get max col width for table sheet by %o', (options) => {
    const s2 = new TableSheet(getContainer(), mockDataConfig, {
      ...s2Options,
      ...options,
    });
    s2.setDataCfg({
      fields: {
        columns: ['price'],
      },
    });
    s2.setTheme({
      dataCell: {
        text: {
          fontSize: 20,
        },
      },
    });
    s2.render();

    const { dataCellWidthList, colLeafNodeWidthList } = mapWidthList(s2);

    expect(dataCellWidthList.every((width) => width === 165)).toBeTruthy();
    expect(colLeafNodeWidthList).toEqual(
      options.showDefaultHeaderActionIcon ? [165] : [165],
    );
  });

  test.each([
    { showDefaultHeaderActionIcon: true },
    { showDefaultHeaderActionIcon: false },
  ])(
    'should get max col width for pivot sheet by condition and %o',
    (options) => {
      const s2 = new PivotSheet(getContainer(), mockDataConfig, {
        ...s2Options,
        ...options,
        conditions: {
          icon: [
            {
              field: 'price',
              position: 'left',
              mapping: () => {
                return {
                  icon: 'Plus',
                  fill: '#396',
                };
              },
            },
          ],
        },
      });
      s2.setTheme({
        dataCell: {
          text: {
            fontSize: 20,
          },
        },
      });
      s2.render();

      const { dataCellWidthList, colLeafNodeWidthList } = mapWidthList(s2);

      expect(dataCellWidthList).toEqual(
        options.showDefaultHeaderActionIcon
          ? [179, 179, 179, 179, 98, 98, 98, 98, 81, 81, 81, 81]
          : [179, 179, 179, 179, 98, 98, 98, 98, 69, 69, 69, 69],
      );
      expect(colLeafNodeWidthList).toEqual(
        options.showDefaultHeaderActionIcon ? [179, 98, 81] : [179, 98, 69],
      );
    },
  );
});
