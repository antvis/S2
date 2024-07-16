/**
 * @description spec for issue #2385
 * https://github.com/antvis/S2/issues/2385
 */
import { PivotSheet, SpreadSheet, TableSheet } from '@/sheet-type';
import { LayoutWidthType, type S2Options } from '../../src';
import * as mockDataConfig from '../data/data-issue-2385.json';
import { getContainer } from '../util/helpers';

const s2Options: S2Options = {
  width: 800,
  height: 600,
  style: {
    dataCell: {
      width: 200,
    },
    layoutWidthType: LayoutWidthType.Compact,
  },
  showDefaultHeaderActionIcon: false,
};

describe('Compare Layout Tests', () => {
  const expectTextOverflowing = (s2: SpreadSheet) => {
    [...s2.facet.getColCells(), ...s2.facet.getDataCells()].forEach((cell) => {
      expect(cell.getTextShape().isOverflowing()).toBeFalsy();
    });
  };

  const mapWidthList = (s2: SpreadSheet) => {
    const colLeafNodeWidthList = s2.facet
      .getColLeafNodes()
      .map((node) => Math.floor(node.width));
    const dataCellWidthList = s2.facet
      .getDataCells()
      .map((cell) => Math.floor(cell.getMeta().width));

    return {
      colLeafNodeWidthList,
      dataCellWidthList,
    };
  };

  test.each([
    { showDefaultHeaderActionIcon: true },
    { showDefaultHeaderActionIcon: false },
  ])('should get max col width for pivot sheet by %o', async (options) => {
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
    await s2.render();

    const colLeafNodes = s2.facet.getColLeafNodes();

    expect(Math.floor(colLeafNodes[0].width)).toBeCloseTo(189);
    expect(Math.floor(colLeafNodes[1].width)).toEqual(90);
    expectTextOverflowing(s2);
  });

  test.each([
    { showDefaultHeaderActionIcon: true },
    { showDefaultHeaderActionIcon: false },
  ])('should get max col width for table sheet by %o', async (options) => {
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

    await s2.render();

    const colLeafNodes = s2.facet.getColLeafNodes();

    expect(Math.floor(colLeafNodes[0].width)).toBeCloseTo(182);
    expectTextOverflowing(s2);
    const { dataCellWidthList, colLeafNodeWidthList } = mapWidthList(s2);

    expect(dataCellWidthList.every((width) => width === 182)).toBeTruthy();
    expect(colLeafNodeWidthList).toEqual([182]);
  });

  test.skip.each([
    { showDefaultHeaderActionIcon: true },
    { showDefaultHeaderActionIcon: false },
  ])(
    'should get max col width for pivot sheet by condition and %o',
    async (options) => {
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
      await s2.render();

      const { dataCellWidthList, colLeafNodeWidthList } = mapWidthList(s2);

      expect(dataCellWidthList).toEqual(
        options.showDefaultHeaderActionIcon
          ? [197, 197, 197, 197, 116, 116, 116, 116, 81, 81, 81, 81]
          : [197, 197, 197, 197, 116, 116, 116, 116, 62, 62, 62, 62],
      );
      expect(colLeafNodeWidthList).toEqual(
        options.showDefaultHeaderActionIcon ? [197, 116, 81] : [197, 116, 62],
      );
    },
  );
});
