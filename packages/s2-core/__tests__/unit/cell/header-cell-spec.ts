import { PivotSheet, SpreadSheet, TableSheet } from '@/sheet-type';
import { PivotDataSet, TableDataSet } from '@/data-set';
import type { Formatter } from '@/common';

import { ColCell, CornerCell, RowCell, TableColCell } from '@/cell';
import { Node } from '@/facet/layout/node';
import { TableFacet } from '@/facet';

const MockPivotSheet = PivotSheet as unknown as jest.Mock<PivotSheet>;
const MockPivotDataSet = PivotDataSet as unknown as jest.Mock<PivotDataSet>;
const MockTableSheet = TableSheet as unknown as jest.Mock<TableSheet>;
const MockTableDataSet = TableDataSet as unknown as jest.Mock<TableDataSet>;

describe('header cell formatter test', () => {
  const root = new Node({ id: `root`, field: '', value: '', children: [] });

  const colNode = new Node({
    id: `root[&]浙江`,
    value: '浙江',
    field: 'province',
    parent: root,
  });
  const rowNode = new Node({
    id: `root[&]杭州`,
    value: '杭州',
    field: 'city',
    parent: root,
  });

  let s2: SpreadSheet;

  describe('pivot header cell formatter test', () => {
    beforeEach(() => {
      const container = document.createElement('div');

      s2 = new MockPivotSheet(container);
      s2.dataSet = new MockPivotDataSet(s2);
    });

    test('pivot col cell and row cell formatter', () => {
      const formatter: Formatter = (value) => `${value}1`;

      jest.spyOn(s2.dataSet, 'getFieldFormatter').mockReturnValue(formatter);

      const rowCell = new RowCell(rowNode, s2);
      const colCell = new ColCell(colNode, s2);

      expect(colCell.getFieldValue()).toBe('浙江1');
      expect(rowCell.getFieldValue()).toBe('杭州1');
    });

    test('should not format pivot col and row total cell', () => {
      const colNode = new Node({
        id: `root[&]总计`,
        field: '',
        value: '总计',
        parent: root,
        isTotalRoot: true,
      });
      const rowNode = new Node({
        id: `root[&]杭州[&]小计`,
        field: '',
        value: '小计',
        parent: root,
        isTotalRoot: true,
      });

      const formatter: Formatter = (value) => {
        return `${value}1`;
      };

      jest.spyOn(s2.dataSet, 'getFieldFormatter').mockReturnValue(formatter);

      const colCell = new ColCell(colNode, s2);
      const rowCell = new RowCell(rowNode, s2);

      expect(colCell.getFieldValue()).toBe('总计');
      expect(rowCell.getFieldValue()).toBe('小计');
    });

    test('should not format pivot row grand total cell in tree mode', () => {
      const rowGrandTotalNode = new Node({
        id: `root[&]总计`,
        field: '',
        value: '总计',
        parent: root,
        isTotals: true,
        isGrandTotals: true,
        isTotalRoot: true,
      });

      const rowSubTotalNode = new Node({
        id: `root[&]杭州`,
        field: '',
        value: '杭州',
        parent: root,
        isTotals: true,
        isSubTotals: true,
        isGrandTotals: false,
      });

      const formatter: Formatter = (value) => {
        return `${value}1`;
      };

      jest.spyOn(s2.dataSet, 'getFieldFormatter').mockReturnValue(formatter);
      jest.spyOn(s2, 'isHierarchyTreeType').mockReturnValue(true);

      const grandTotalCell = new ColCell(rowGrandTotalNode, s2);
      const subTotalCell = new RowCell(rowSubTotalNode, s2);

      expect(grandTotalCell.getFieldValue()).toBe('总计');
      expect(subTotalCell.getFieldValue()).toBe('杭州1');
    });

    test('pivot corner cell not formatter', () => {
      const formatter: Formatter = (value) => `${value}1`;

      jest.spyOn(s2.dataSet, 'getFieldFormatter').mockReturnValue(formatter);
      const cornerOption = {
        spreadsheet: {
          isHierarchyTreeType: () => jest.fn().mockReturnValue(false),
        },
        position: {
          x: 30,
          y: 30,
        },
      };

      const cornerCell = new CornerCell(rowNode, s2, cornerOption);

      expect(cornerCell.getFieldValue()).toBe('杭州');
    });
  });

  describe('table header cell formatter test', () => {
    beforeEach(() => {
      const container = document.createElement('div');

      s2 = new MockTableSheet(container);
      s2.dataSet = new MockTableDataSet(s2);
      s2.dataSet.fields = {
        columns: ['province', 'city'],
      };
      s2.dataSet.getDisplayDataSet = jest.fn().mockReturnValue([]);
      s2.facet = new TableFacet(s2);
    });

    test('table col cell not formatter', () => {
      const formatter: Formatter = (value) => `${value}1`;

      jest.spyOn(s2.dataSet, 'getFieldFormatter').mockReturnValue(formatter);

      const colCell = new TableColCell(colNode, s2);

      expect(colCell.getFieldValue()).toBe('浙江');
    });
  });
});
