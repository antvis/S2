import * as mockTableDataConfig from 'tests/data/simple-table-data.json';
import * as mockPivotDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';
import { difference } from 'lodash';
import { PivotSheet, TableSheet } from '@/sheet-type';
import { S2Options } from '@/common';

const s2Options: S2Options = {
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
        s2Options,
      );
      tableSheet.render();
    });

    afterEach(() => {
      tableSheet.destroy();
    });

    test('should get init column node', () => {
      expect(tableSheet.getColumnNodes().map((node) => node.field)).toEqual(
        mockTableDataConfig.fields.columns,
      );
      expect(
        tableSheet.getInitColumnLeafNodes().map((node) => node.field),
      ).toEqual(mockTableDataConfig.fields.columns);
    });

    test('should hidden column correctly', () => {
      const hiddenColumns = ['cost'];

      tableSheet.interaction.hideColumns(hiddenColumns);

      const hiddenColumnsDetail = tableSheet.store.get(
        'hiddenColumnsDetail',
        [],
      );
      const [costDetail] = hiddenColumnsDetail;
      expect(tableSheet.options.interaction.hiddenColumnFields).toEqual(
        hiddenColumns,
      );
      expect(tableSheet.getColumnNodes().map((node) => node.field)).toEqual(
        difference(mockTableDataConfig.fields.columns, hiddenColumns),
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

    test('should default hidden columns by interaction hiddenColumnFields config', () => {
      const hiddenColumns = ['cost'];
      const sheet = new TableSheet(getContainer(), mockTableDataConfig, {
        ...s2Options,
        interaction: {
          hiddenColumnFields: hiddenColumns,
        },
      });
      sheet.render();

      const hiddenColumnsDetail = sheet.store.get('hiddenColumnsDetail', []);
      const [costDetail] = hiddenColumnsDetail;

      expect(sheet.options.interaction.hiddenColumnFields).toEqual(
        hiddenColumns,
      );
      expect(sheet.getColumnNodes().map((node) => node.field)).toEqual(
        difference(mockTableDataConfig.fields.columns, hiddenColumns),
      );
      expect(hiddenColumnsDetail).toHaveLength(1);
      expect(costDetail.displaySiblingNode.prev.field).toEqual('price');
      expect(costDetail.displaySiblingNode.next.field).toEqual('province');
      expect(costDetail.hideColumnNodes).toHaveLength(1);
      expect(costDetail.hideColumnNodes[0].field).toEqual('cost');
    });
  });

  describe('PivotSheet', () => {
    const typePriceColumnId = 'root[&]笔[&]义乌[&]price';
    const cityPriceColumnId = 'root[&]笔[&]杭州[&]price';

    let pivotSheet: PivotSheet;

    const pivotDataCfg = {
      ...mockPivotDataConfig,
      fields: {
        rows: ['province'],
        columns: ['type', 'city'],
        values: ['price'],
        valueInCols: true,
      },
    };

    beforeEach(() => {
      pivotSheet = new PivotSheet(getContainer(), pivotDataCfg, s2Options);
      pivotSheet.render();
    });

    afterEach(() => {
      pivotSheet.destroy();
    });

    test('should get init column node', () => {
      expect(pivotSheet.getColumnNodes()).toHaveLength(5);
      expect(
        pivotSheet.getInitColumnLeafNodes().map((node) => node.id),
      ).toEqual([typePriceColumnId, cityPriceColumnId]);
    });

    test('should hidden column correctly', () => {
      const hiddenColumns = [typePriceColumnId];

      pivotSheet.interaction.hideColumns(hiddenColumns);

      const hiddenColumnsDetail = pivotSheet.store.get(
        'hiddenColumnsDetail',
        [],
      );
      const [priceDetail] = hiddenColumnsDetail;
      expect(pivotSheet.options.interaction.hiddenColumnFields).toEqual(
        hiddenColumns,
      );
      expect(pivotSheet.getColumnLeafNodes().map((node) => node.id)).toEqual([
        cityPriceColumnId,
      ]);
      expect(hiddenColumnsDetail).toHaveLength(1);
      expect(priceDetail.displaySiblingNode.prev).toEqual(null);
      expect(priceDetail.displaySiblingNode.next.id).toEqual(cityPriceColumnId);
      expect(priceDetail.hideColumnNodes).toHaveLength(1);
      expect(priceDetail.hideColumnNodes[0].id).toEqual(typePriceColumnId);
    });

    test('should hidden multiple columns correctly', () => {
      const hiddenColumns = [typePriceColumnId, cityPriceColumnId];

      pivotSheet.interaction.hideColumns(hiddenColumns);

      const hiddenColumnsDetail = pivotSheet.store.get(
        'hiddenColumnsDetail',
        [],
      );
      const [multipleColumnDetail] = hiddenColumnsDetail;

      expect(pivotSheet.getColumnLeafNodes()).toEqual([]);
      expect(pivotSheet.options.interaction.hiddenColumnFields).toEqual(
        hiddenColumns,
      );
      expect(hiddenColumnsDetail).toHaveLength(1);

      expect(multipleColumnDetail.displaySiblingNode.prev).toBeNull();
      expect(multipleColumnDetail.displaySiblingNode.next).toBeNull();
      expect(multipleColumnDetail.hideColumnNodes).toHaveLength(2);

      expect(multipleColumnDetail.hideColumnNodes[0].id).toEqual(
        typePriceColumnId,
      );
      expect(multipleColumnDetail.hideColumnNodes[1].id).toEqual(
        cityPriceColumnId,
      );
    });

    test('should default hidden columns by interaction hiddenColumnFields config', () => {
      const hiddenColumns = [typePriceColumnId];
      const sheet = new PivotSheet(getContainer(), pivotDataCfg, {
        ...s2Options,
        interaction: {
          hiddenColumnFields: hiddenColumns,
        },
      });
      sheet.render();
      const hiddenColumnsDetail = sheet.store.get('hiddenColumnsDetail', []);
      const [priceDetail] = hiddenColumnsDetail;
      expect(sheet.options.interaction.hiddenColumnFields).toEqual(
        hiddenColumns,
      );
      expect(sheet.getColumnLeafNodes().map((node) => node.id)).toEqual([
        cityPriceColumnId,
      ]);
      expect(hiddenColumnsDetail).toHaveLength(1);
      expect(priceDetail.displaySiblingNode.prev).toEqual(null);
      expect(priceDetail.displaySiblingNode.next.id).toEqual(cityPriceColumnId);
      expect(priceDetail.hideColumnNodes).toHaveLength(1);
      expect(priceDetail.hideColumnNodes[0].id).toEqual(typePriceColumnId);
    });
  });
});
