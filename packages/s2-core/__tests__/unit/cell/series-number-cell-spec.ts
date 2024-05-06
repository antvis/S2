/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SeriesNumberCell } from '@/cell';
import type { Formatter } from '@/common';
import { PivotDataSet } from '@/data-set';
import { Node } from '@/facet/layout/node';
import { PivotSheet, SpreadSheet } from '@/sheet-type';

const MockPivotSheet = PivotSheet as unknown as jest.Mock<PivotSheet>;
const MockPivotDataSet = PivotDataSet as unknown as jest.Mock<PivotDataSet>;

describe('series number cell formatter test', () => {
  const root = new Node({ id: `root`, value: '', children: [] });

  const rowNode = new Node({
    id: `root[&]杭州`,
    value: '杭州',
    field: 'city',
    parent: root,
  });

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

    test('should get correctly icon style', () => {
      const seriesNumberCell = new SeriesNumberCell(rowNode, s2);

      expect(seriesNumberCell.getIconStyle()).toEqual({
        fill: '#000000',
        margin: { left: 4, right: 4 },
        size: 10,
      });
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
