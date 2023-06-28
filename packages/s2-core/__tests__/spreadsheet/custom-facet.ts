/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createPivotSheet, createTableSheet } from 'tests/util/helpers';

describe('SpreadSheet Custom Facet Tests', () => {
  test('should render custom pivot facet for custom cell meta', () => {
    const getCellMeta = jest.fn();

    const layoutCellMeta = () => {
      getCellMeta();

      return null;
    };

    const s2 = createPivotSheet({
      layoutCellMeta,
    });

    s2.render();

    expect(s2.facet.getCellMeta(0, 0)).toBeNull();
    expect(getCellMeta).toHaveBeenCalledTimes(1);
  });

  test('should render custom table facet for custom cell meta', () => {
    const getCellMeta = jest.fn();

    const layoutCellMeta = () => {
      getCellMeta();

      return null;
    };

    const s2 = createTableSheet({
      layoutCellMeta,
    });

    s2.render();

    expect(s2.facet.getCellMeta(0, 0)).toBeNull();
    expect(getCellMeta).toHaveBeenCalledTimes(1);
  });
});
