/**
 * custom-tree mode.
 */
import { get } from 'lodash';
import { customTreeItems } from 'tests/data/custom-tree-items';
import { dataCustomTrees } from 'tests/data/data-custom-trees';
import { S2DataConfig } from '@/common/interface';
import { EXTRA_FIELD, VALUE_FIELD } from '@/common/constant';
import { PivotSheet } from '@/sheet-type';
import { CornerCell, S2Options, transformCustomTreeItems } from '@/index';
import { CustomTreePivotDataSet } from '@/data-set/custom-tree-pivot-data-set';

describe('test for corner text', () => {
  const values = [
    'measure-a',
    'measure-b',
    'measure-c',
    'measure-d',
    'measure-e',
    'measure-f',
  ];
  const dataCfg: S2DataConfig = {
    meta: [],
    data: dataCustomTrees,
    totalData: [],
    fields: {
      rows: [],
      columns: ['type', 'sub_type'],
      values,
      customTreeItems: transformCustomTreeItems(customTreeItems),
      valueInCols: false,
    },
  };

  const options: S2Options = {
    width: 600,
    height: 480,
    hierarchyType: 'customTree',
  };
  const container = document.createElement('div');

  const mockSheet = new PivotSheet(container, dataCfg, options);
  mockSheet.render();

  test('get correct default corner text when the corner label is empty.', () => {
    const cornerCells = get(
      mockSheet,
      'facet.cornerBBox.facet.cornerHeader.cfg.children',
    ).filter((v) => v instanceof CornerCell);
    expect(cornerCells[0].actualText).toEqual('指标');
    expect(cornerCells[1].actualText).toEqual('type');
  });

  test('get correct default corner text when set the cornerText.', () => {
    mockSheet.setOptions({ ...options, cornerText: 'test' });
    mockSheet.render();
    const cornerCells = get(
      mockSheet,
      'facet.cornerBBox.facet.cornerHeader.cfg.children',
    ).filter((v) => v instanceof CornerCell);
    expect(cornerCells[0].actualText).toEqual('test');
    expect(cornerCells[1].actualText).toEqual('type');
  });
});
