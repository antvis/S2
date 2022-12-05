/**
 * custom-tree mode.
 */
import { customTreeNodes } from 'tests/data/custom-tree-nodes';
import { CustomTreeData } from 'tests/data/data-custom-tree';
import { getContainer } from 'tests/util/helpers';
import { get } from 'lodash';
import type { S2DataConfig } from '@/common/interface';
import { PivotSheet } from '@/sheet-type';
import { CornerCell, type S2Options } from '@/index';

describe('test for corner text', () => {
  const values: string[] = [
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

  const mockSheet = new PivotSheet(getContainer(), dataCfg, options);
  mockSheet.render();

  test('get correct default corner text when the corner label is empty', () => {
    const cornerCells = mockSheet.facet.cornerHeader.children;

    expect(get(cornerCells[0], 'actualText')).toEqual('自定义节点A/指标E/数值');
    expect(get(cornerCells[1], 'actualText')).toEqual('type');
  });

  test('get correct default corner text when set the cornerText.', () => {
    mockSheet.setOptions({ ...options, cornerText: 'test' });
    mockSheet.render();

    const cornerCells = mockSheet.facet.cornerHeader.children.filter(
      (v) => v instanceof CornerCell,
    );

    expect(get(cornerCells[0], 'actualText')).toEqual('test');
    expect(get(cornerCells[1], 'actualText')).toEqual('type');
  });
});
