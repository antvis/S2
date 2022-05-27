/**
 * @description spec for issue #507
 * https://github.com/antvis/S2/issues/507
 * Show err when hierarchyType is tree and data is empty
 *
 */

import { cloneDeep } from 'lodash';
import { getContainer } from '../util/helpers';
import { valueInCols } from '../data/data-issue-507.json';
import { S2Options, PivotSheet } from '@/index';

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
  const valueInColsGridS2 = new PivotSheet(
    getContainer(),
    valueInCols,
    gridOptions,
  );
  valueInColsGridS2.render();
  test('should render skeleton when grid sheet in the valueInCols mode', () => {
    const layoutResult = valueInColsGridS2.facet.layoutResult;
    expect(layoutResult.colNodes).toHaveLength(5);
    expect(layoutResult.rowNodes).toHaveLength(2);
  });

  const valueInRowsGridS2 = new PivotSheet(
    getContainer(),
    valueInRows,
    gridOptions,
  );
  valueInRowsGridS2.render();
  test('should render skeleton when grid sheet in the valueInRows mode', () => {
    const layoutResult = valueInRowsGridS2.facet.layoutResult;
    expect(layoutResult.colNodes).toHaveLength(2);
    expect(layoutResult.rowNodes).toHaveLength(5);
  });

  const valueInColstreeS2 = new PivotSheet(
    getContainer(),
    valueInCols,
    treeOptions,
  );
  valueInColstreeS2.render();
  test('should render skeleton when tree sheet in the valueInCols mode', () => {
    const layoutResult = valueInColstreeS2.facet.layoutResult;
    expect(layoutResult.colNodes).toHaveLength(5);
    expect(layoutResult.rowNodes).toBeEmpty();
  });

  const valueInRowsTreeS2 = new PivotSheet(
    getContainer(),
    valueInRows,
    treeOptions,
  );
  valueInRowsTreeS2.render();
  test('should render skeleton when tree sheet in the valueInRows mode', () => {
    const layoutResult = valueInRowsTreeS2.facet.layoutResult;
    expect(layoutResult.colNodes).toHaveLength(2);
    expect(layoutResult.rowNodes).toBeEmpty();
  });
});
