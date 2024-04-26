/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SeriesNumberCell } from '@/cell';
import type { Formatter, HeaderActionIcon } from '@/common';
import { PivotDataSet } from '@/data-set';
import { Node } from '@/facet/layout/node';
import { PivotSheet, SpreadSheet } from '@/sheet-type';

const MockPivotSheet = PivotSheet as unknown as jest.Mock<PivotSheet>;
const MockPivotDataSet = PivotDataSet as unknown as jest.Mock<PivotDataSet>;

describe('header cell formatter test', () => {
  const root = new Node({ id: `root`, key: '', value: '', children: [] });

  const rowNode = new Node({
    id: `root[&]杭州`,
    key: '',
    value: '1',
    field: 'city',
    parent: root,
    label: '杭州',
  });

  const rowHeaderActionIcons: HeaderActionIcon[] = [
    {
      iconNames: ['Plus'],
      belongsCell: 'rowCell',
      defaultHide: false,
    },
  ];

  let s2: SpreadSheet;

  describe('Pivot SeriesNumber Cell Formatter Tests', () => {
    beforeEach(() => {
      const container = document.createElement('div');

      s2 = new MockPivotSheet(container);
      s2.dataSet = new MockPivotDataSet(s2);
    });

    test('pivot col cell and row cell formatter', () => {
      const formatter: Formatter = (value) => {
        return `${value}1`;
      };

      jest.spyOn(s2.dataSet, 'getFieldFormatter').mockReturnValue(formatter);

      const seriesNumberCell = new SeriesNumberCell(rowNode, s2);

      expect(seriesNumberCell.getFieldValue()).toBe('杭州1');
    });

    test('should render row header action icons', () => {
      s2.options.headerActionIcons = rowHeaderActionIcons;

      const seriesNumberCell = new SeriesNumberCell(rowNode, s2);

      // @ts-ignore
      seriesNumberCell.actionIcons = [];
      // @ts-ignore
      seriesNumberCell.drawActionIcons();
      // @ts-ignore
      expect(seriesNumberCell.actionIcons).toHaveLength(1);
    });

    test('should get empty icon style', () => {
      const seriesNumberCell = new SeriesNumberCell(rowNode, s2);

      expect(seriesNumberCell.getIconStyle()).toBeUndefined();
    });

    test('should get empty field condition', () => {
      const seriesNumberCell = new SeriesNumberCell(rowNode, s2);

      expect(seriesNumberCell.findFieldCondition()).toBeUndefined();
    });

    test('should get empty mapping value', () => {
      const seriesNumberCell = new SeriesNumberCell(rowNode, s2);

      expect(seriesNumberCell.mappingValue()).toBeUndefined();
    });
  });
});
