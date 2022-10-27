/**
 * custom-tree mode.
 */
import { get } from 'lodash';
import { customTreeNodes } from 'tests/data/custom-tree-nodes';
import { CustomTreeData } from 'tests/data/data-custom-tree';
import type { S2DataConfig } from '@/common/interface';
import { PivotSheet } from '@/sheet-type';
import { CornerCell, type S2Options } from '@/index';

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
    data: CustomTreeData,
    fields: {
      rows: customTreeNodes,
      columns: ['type', 'sub_type'],
      values,
      valueInCols: false,
    },
  };

  const options: S2Options = {
    width: 600,
    height: 480,
    hierarchyType: 'tree',
  };
  const container = document.createElement('div');

  const mockSheet = new PivotSheet(container, dataCfg, options);
  mockSheet.render();

  test('get correct default corner text when the corner label is empty.', () => {
    const cornerCells = get(
      mockSheet,
      'facet.cornerBBox.facet.cornerHeader.cfg.children',
    ).filter((v) => v instanceof CornerCell);
    expect(cornerCells[0].actualText).toEqual('自定义节点A/指标E/数值');
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
