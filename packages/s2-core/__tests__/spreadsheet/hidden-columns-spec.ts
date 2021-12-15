import * as mockTableDataConfig from 'tests/data/simple-table-data.json';
import * as mockPivotDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet, TableSheet } from '@/sheet-type';
import { S2Options } from '@/common';

const s2options: S2Options = {
  width: 400,
  height: 120,
  tooltip: {
    showTooltip: true,
  },
};

describe('SpreadSheet Hidden Columns Tests', () => {
  describe('TableSheet', () => {
    let tableSheet: TableSheet;

    beforeEach(() => {
      tableSheet = new TableSheet(
        getContainer(),
        mockTableDataConfig,
        s2options,
      );
      tableSheet.render();
    });

    test('should get init column node', () => {
      expect(tableSheet.getColumnNodes().map((node) => node.field)).toEqual(
        mockTableDataConfig.fields.columns,
      );
      expect(tableSheet.getInitColumnNodes().map((node) => node.field)).toEqual(
        mockTableDataConfig.fields.columns,
      );
    });

    test('should hidden column correctly', () => {
      const hiddenColumns = ['cost'];

      tableSheet.interaction.hideColumns(hiddenColumns);

      const hiddenColumnsDetail = tableSheet.store.get(
        'hiddenColumnsDetail',
        [],
      );
      const [costDetail] = hiddenColumnsDetail;
      expect(tableSheet.getColumnNodes().map((node) => node.field)).toEqual(
        mockTableDataConfig.fields.columns.filter(
          (column) => !hiddenColumns.includes(column),
        ),
      );
      expect(hiddenColumnsDetail).toHaveLength(1);
      expect(costDetail.displaySiblingNode.prev.field).toEqual('price');
      expect(costDetail.displaySiblingNode.next.field).toEqual('province');
      expect(costDetail.hideColumnNodes).toHaveLength(1);
      expect(costDetail.hideColumnNodes[0].field).toEqual('cost');
    });

    test('should hidden multiple columns correctly', () => {
      const hiddenColumns = ['price', 'city'];

      tableSheet.interaction.hideColumns(hiddenColumns);

      const hiddenColumnsDetail = tableSheet.store.get(
        'hiddenColumnsDetail',
        [],
      );
      const [priceDetail, cityDetail] = hiddenColumnsDetail;

      expect(tableSheet.getColumnNodes().map((node) => node.field)).toEqual(
        mockTableDataConfig.fields.columns.filter(
          (column) => !hiddenColumns.includes(column),
        ),
      );
      expect(hiddenColumnsDetail).toHaveLength(2);

      // price
      expect(priceDetail.displaySiblingNode.prev).toBeNull();
      expect(priceDetail.displaySiblingNode.next.field).toEqual('cost');
      expect(priceDetail.hideColumnNodes).toHaveLength(1);
      expect(priceDetail.hideColumnNodes[0].field).toEqual('price');

      expect(priceDetail.displaySiblingNode.prev).toBeNull();
      expect(priceDetail.displaySiblingNode.next.field).toEqual('cost');
      expect(priceDetail.hideColumnNodes).toHaveLength(1);
      expect(priceDetail.hideColumnNodes[0].field).toEqual('price');

      // city
      expect(cityDetail.displaySiblingNode.prev.field).toEqual('province');
      expect(cityDetail.displaySiblingNode.next.field).toEqual('type');
      expect(cityDetail.hideColumnNodes).toHaveLength(1);
      expect(cityDetail.hideColumnNodes[0].field).toEqual('city');
    });

    test('should hidden closer group columns correctly', () => {
      const hiddenColumns = ['cost', 'province'];

      tableSheet.interaction.hideColumns(hiddenColumns);

      const hiddenColumnsDetail = tableSheet.store.get(
        'hiddenColumnsDetail',
        [],
      );
      const [groupDetail] = hiddenColumnsDetail;

      expect(tableSheet.getColumnNodes().map((node) => node.field)).toEqual(
        mockTableDataConfig.fields.columns.filter(
          (column) => !hiddenColumns.includes(column),
        ),
      );
      // 相领的两列, 只生成一组
      expect(hiddenColumnsDetail).toHaveLength(1);

      // price
      expect(groupDetail.displaySiblingNode.prev.field).toEqual('price');
      expect(groupDetail.displaySiblingNode.next.field).toEqual('city');
      expect(groupDetail.hideColumnNodes).toHaveLength(2);
      expect(groupDetail.hideColumnNodes[0].field).toEqual('cost');
      expect(groupDetail.hideColumnNodes[1].field).toEqual('province');
    });
  });

  describe('PivotSheet', () => {
    let pivotSheet: PivotSheet;

    beforeEach(() => {
      pivotSheet = new PivotSheet(
        getContainer(),
        mockPivotDataConfig,
        s2options,
      );
      pivotSheet.render();
    });

    test('should get init column node', () => {
      // 默认数值置于列头, 数值对应的列头字段 ["price", "cost"] => ['$extra','$extra']
      expect(pivotSheet.getColumnNodes()).toHaveLength(3);
    });
  });
});
