/**
 * @description spec for issue #507
 * https://github.com/antvis/S2/issues/507
 * Show err when hierarchyType is tree and data is empty
 *
 */

import { cloneDeep } from 'lodash';
import { getContainer } from '../util/helpers';
import { valueInCols } from '../data/data-issue-507.json';
import { type S2Options, PivotSheet } from '@/index';

const valueInRows = cloneDeep(valueInCols);

valueInRows.fields.valueInCols = false;

const gridOptions: S2Options = {
  width: 600,
  height: 200,
};

const treeOptions: S2Options = {
  width: 600,
  height: 200,
  hierarchyType: 'tree',
};

describe('Spreadsheet Empty Test', () => {
  test('should render skeleton when grid sheet in the valueInCols mode', async () => {
    const valueInColsGridS2 = new PivotSheet(
      getContainer(),
      valueInCols,
      gridOptions,
    );

    await valueInColsGridS2.render();

    const layoutResult = valueInColsGridS2.facet.getLayoutResult();

    expect(layoutResult.colNodes).toHaveLength(5);
    expect(layoutResult.rowNodes).toHaveLength(2);
  });

  test('should render skeleton when grid sheet in the valueInRows mode', async () => {
    const valueInRowsGridS2 = new PivotSheet(
      getContainer(),
      valueInRows,
      gridOptions,
    );

    await valueInRowsGridS2.render();

    const layoutResult = valueInRowsGridS2.facet.getLayoutResult();

    expect(layoutResult.colNodes).toHaveLength(2);
    expect(layoutResult.rowNodes).toHaveLength(5);
  });

  test('should render skeleton when tree sheet in the valueInCols mode', async () => {
    const valueInColsTreeS2 = new PivotSheet(
      getContainer(),
      valueInCols,
      treeOptions,
    );

    await valueInColsTreeS2.render();

    const layoutResult = valueInColsTreeS2.facet.getLayoutResult();

    expect(layoutResult.colNodes).toHaveLength(5);
    expect(layoutResult.rowNodes).toBeEmpty();
  });

  test('should render skeleton when tree sheet in the valueInRows mode', async () => {
    const valueInRowsTreeS2 = new PivotSheet(
      getContainer(),
      valueInRows,
      treeOptions,
    );

    await valueInRowsTreeS2.render();

    const layoutResult = valueInRowsTreeS2.facet.getLayoutResult();

    expect(layoutResult.colNodes).toHaveLength(2);
    expect(layoutResult.rowNodes).toBeEmpty();
  });
});
