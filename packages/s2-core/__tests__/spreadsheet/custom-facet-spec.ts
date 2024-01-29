/* eslint-disable max-classes-per-file */
import { createPivotSheet, createTableSheet } from 'tests/util/helpers';
import { PivotFacet, TableFacet, type ViewMeta } from '../../src';

describe('SpreadSheet Custom Facet Tests', () => {
  test('should render custom pivot facet for custom cell meta', async () => {
    const getCellMeta = jest.fn();

    const s2 = createPivotSheet({
      layoutCellMeta() {
        getCellMeta();

        return {} as ViewMeta;
      },
    });

    await s2.render();

    expect(s2.facet.getCellMeta(0, 0)).toEqual({});
    expect(getCellMeta).toHaveBeenCalledTimes(5);
  });

  test('should render custom table facet for custom cell meta', async () => {
    const getCellMeta = jest.fn();

    const s2 = createTableSheet({
      layoutCellMeta() {
        getCellMeta();

        return {} as ViewMeta;
      },
    });

    await s2.render();

    expect(s2.facet.getCellMeta(0, 0)).toEqual({});
    expect(getCellMeta).toHaveBeenCalledTimes(4);
  });

  test('should render custom pivot facet', async () => {
    // @ts-ignore
    class CustomPivotFacet extends PivotFacet {
      calculateColLeafNodesWidth() {
        return 200;
      }
    }

    const s2 = createPivotSheet({
      facet: (spreadsheet) => new CustomPivotFacet(spreadsheet),
    });

    await s2.render();

    expect(s2.facet.getColLeafNodes().map((node) => node.width)).toEqual([
      200, 200,
    ]);
  });

  test('should render custom table facet', async () => {
    // @ts-ignore
    class CustomTableFacet extends TableFacet {
      calculateColLeafNodesWidth() {
        return 200;
      }
    }

    const s2 = createTableSheet({
      facet: (spreadsheet) => new CustomTableFacet(spreadsheet),
    });

    await s2.render();

    expect(s2.facet.getColLeafNodes().map((node) => node.width)).toEqual([200]);
  });
});
