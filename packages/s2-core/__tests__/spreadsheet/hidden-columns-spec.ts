import { difference, pick } from 'lodash';
import * as mockDataConfig from 'tests/data/mock-dataset.json';
import * as mockPivotDataConfig from 'tests/data/simple-data.json';
import * as mockTableDataConfig from 'tests/data/simple-table-data.json';
import { getContainer } from 'tests/util/helpers';
import { customColMultipleColumns } from '../data/custom-table-col-fields';
import { customColGridSimpleFields } from '../data/custom-grid-simple-fields';
import { PivotSheet, TableSheet } from '@/sheet-type';
import type { HiddenColumnsInfo, S2Options } from '@/common';

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

    beforeEach(async () => {
      tableSheet = new TableSheet(
        getContainer(),
        mockTableDataConfig,
        s2Options,
      );
      await tableSheet.render();
    });

    afterEach(() => {
      tableSheet.destroy();
    });

    test('should get init column node', () => {
      expect(tableSheet.facet.getColNodes().map((node) => node.field)).toEqual(
        mockTableDataConfig.fields.columns,
      );
      expect(
        tableSheet.facet.getInitColLeafNodes().map((node) => node.field),
      ).toEqual(mockTableDataConfig.fields.columns);
    });

    test('should hide column correctly', () => {
      const hiddenColumns = ['cost'];

      tableSheet.interaction.hideColumns(hiddenColumns);

      const hiddenColumnsDetail = tableSheet.store.get(
        'hiddenColumnsDetail',
        [],
      );
      const [costDetail] = hiddenColumnsDetail;

      expect(tableSheet.options.interaction?.hiddenColumnFields).toEqual(
        hiddenColumns,
      );
      expect(tableSheet.facet.getColNodes().map((node) => node.field)).toEqual(
        difference(mockTableDataConfig.fields.columns, hiddenColumns),
      );
      expect(hiddenColumnsDetail).toHaveLength(1);
      expect(costDetail.displaySiblingNode.prev?.field).toEqual('price');
      expect(costDetail.displaySiblingNode.next?.field).toEqual('province');
      expect(costDetail.hideColumnNodes).toHaveLength(1);
      expect(costDetail.hideColumnNodes[0].field).toEqual('cost');
    });

    test('should hide multiple columns correctly', () => {
      const hiddenColumns = ['price', 'city'];

      tableSheet.interaction.hideColumns(hiddenColumns);

      const hiddenColumnsDetail = tableSheet.store.get(
        'hiddenColumnsDetail',
        [],
      );
      const [priceDetail, cityDetail] = hiddenColumnsDetail;

      expect(tableSheet.facet.getColNodes().map((node) => node.field)).toEqual(
        mockTableDataConfig.fields.columns.filter(
          (column) => !hiddenColumns.includes(column),
        ),
      );
      expect(hiddenColumnsDetail).toHaveLength(2);

      // price
      expect(priceDetail.displaySiblingNode.prev).toBeNull();
      expect(priceDetail.displaySiblingNode.next?.field).toEqual('cost');
      expect(priceDetail.hideColumnNodes).toHaveLength(1);
      expect(priceDetail.hideColumnNodes[0].field).toEqual('price');

      expect(priceDetail.displaySiblingNode.prev).toBeNull();
      expect(priceDetail.displaySiblingNode.next?.field).toEqual('cost');
      expect(priceDetail.hideColumnNodes).toHaveLength(1);
      expect(priceDetail.hideColumnNodes[0].field).toEqual('price');

      // city
      expect(cityDetail.displaySiblingNode.prev?.field).toEqual('province');
      expect(cityDetail.displaySiblingNode.next?.field).toEqual('type');
      expect(cityDetail.hideColumnNodes).toHaveLength(1);
      expect(cityDetail.hideColumnNodes[0].field).toEqual('city');
    });

    test('should hide closer group columns correctly', () => {
      const hiddenColumns = ['cost', 'province'];

      tableSheet.interaction.hideColumns(hiddenColumns);

      const hiddenColumnsDetail = tableSheet.store.get(
        'hiddenColumnsDetail',
        [],
      );
      const [groupDetail] = hiddenColumnsDetail;

      expect(tableSheet.facet.getColNodes().map((node) => node.field)).toEqual(
        mockTableDataConfig.fields.columns.filter(
          (column) => !hiddenColumns.includes(column),
        ),
      );
      // 相领的两列, 只生成一组
      expect(hiddenColumnsDetail).toHaveLength(1);

      // price
      expect(groupDetail.displaySiblingNode.prev?.field).toEqual('price');
      expect(groupDetail.displaySiblingNode.next?.field).toEqual('city');
      expect(groupDetail.hideColumnNodes).toHaveLength(2);
      expect(groupDetail.hideColumnNodes[0].field).toEqual('cost');
      expect(groupDetail.hideColumnNodes[1].field).toEqual('province');
    });

    test('should hide columns by interaction hiddenColumnFields config by default', async () => {
      const hiddenColumns = ['cost'];
      const sheet = new TableSheet(getContainer(), mockTableDataConfig, {
        ...s2Options,
        interaction: {
          hiddenColumnFields: hiddenColumns,
        },
      });

      await sheet.render();

      const hiddenColumnsDetail = sheet.store.get('hiddenColumnsDetail', []);
      const [costDetail] = hiddenColumnsDetail;

      expect(sheet.options.interaction?.hiddenColumnFields).toEqual(
        hiddenColumns,
      );
      expect(sheet.facet.getColNodes().map((node) => node.field)).toEqual(
        difference(mockTableDataConfig.fields.columns, hiddenColumns),
      );
      expect(hiddenColumnsDetail).toHaveLength(1);
      expect(costDetail.displaySiblingNode.prev?.field).toEqual('price');
      expect(costDetail.displaySiblingNode.next?.field).toEqual('province');
      expect(costDetail.hideColumnNodes).toHaveLength(1);
      expect(costDetail.hideColumnNodes[0].field).toEqual('cost');
    });

    test('should hide columns for multiple columns', async () => {
      const hiddenColumns = [
        'root[&]自定义节点 a-1[&]自定义节点 a-1-1[&]指标1',
      ];

      tableSheet.setDataCfg({
        ...mockTableDataConfig,
        fields: {
          columns: customColMultipleColumns,
        },
      });
      await tableSheet.render();

      tableSheet.interaction.hideColumns(hiddenColumns);

      const hiddenColumnsDetail = tableSheet.store.get(
        'hiddenColumnsDetail',
        [],
      );
      const [detail] = hiddenColumnsDetail;

      expect(tableSheet.options.interaction?.hiddenColumnFields).toEqual(
        hiddenColumns,
      );
      expect(tableSheet.facet.getColNodes().map((node) => node.field))
        .toMatchInlineSnapshot(`
        Array [
          "a-1",
          "a-1-1",
          "city",
          "a-1-2",
          "a-2",
        ]
      `);
      expect(hiddenColumnsDetail).toHaveLength(1);
      expect(detail.displaySiblingNode.prev?.field).toBeFalsy();
      expect(detail.displaySiblingNode.next?.field).toEqual('city');
      expect(detail.hideColumnNodes).toHaveLength(1);
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

    beforeEach(async () => {
      pivotSheet = new PivotSheet(getContainer(), pivotDataCfg, s2Options);
      await pivotSheet.render();
    });

    afterEach(() => {
      pivotSheet.destroy();
    });

    test('should get init column node', () => {
      expect(pivotSheet.facet.getColNodes()).toHaveLength(5);
      expect(
        pivotSheet.facet.getInitColLeafNodes().map((node) => node.id),
      ).toEqual([typePriceColumnId, cityPriceColumnId]);
    });

    test('should hide column correctly', () => {
      const hiddenColumns = [typePriceColumnId];

      pivotSheet.interaction.hideColumns(hiddenColumns);

      const hiddenColumnsDetail = pivotSheet.store.get(
        'hiddenColumnsDetail',
        [],
      );
      const [priceDetail] = hiddenColumnsDetail;

      expect(pivotSheet.options.interaction?.hiddenColumnFields).toEqual(
        hiddenColumns,
      );
      expect(pivotSheet.facet.getColLeafNodes().map((node) => node.id)).toEqual(
        [cityPriceColumnId],
      );
      expect(hiddenColumnsDetail).toHaveLength(1);
      expect(priceDetail.displaySiblingNode.prev).toEqual(null);
      expect(priceDetail.displaySiblingNode.next?.id).toEqual(
        cityPriceColumnId,
      );
      expect(priceDetail.hideColumnNodes).toHaveLength(1);
      expect(priceDetail.hideColumnNodes[0].id).toEqual(typePriceColumnId);
    });

    test('should hide multiple columns correctly', () => {
      const hiddenColumns = [typePriceColumnId, cityPriceColumnId];

      pivotSheet.interaction.hideColumns(hiddenColumns);

      const hiddenColumnsDetail = pivotSheet.store.get(
        'hiddenColumnsDetail',
        [],
      );
      const [multipleColumnDetail] = hiddenColumnsDetail;

      expect(pivotSheet.facet.getColLeafNodes()).toEqual([]);
      expect(pivotSheet.options.interaction?.hiddenColumnFields).toEqual(
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

    test('should not rerender after hidden empty column fields if disable force render', () => {
      const defaultHiddenColumnsDetail = [
        null,
      ] as unknown as HiddenColumnsInfo[];

      pivotSheet.store.set('hiddenColumnsDetail', defaultHiddenColumnsDetail);

      const renderSpy = jest
        .spyOn(pivotSheet, 'render')
        .mockImplementationOnce(async () => {});

      pivotSheet.interaction.hideColumns([], false);

      const hiddenColumnsDetail = pivotSheet.store.get('hiddenColumnsDetail');

      expect(renderSpy).not.toHaveBeenCalled();
      expect(hiddenColumnsDetail).toEqual(defaultHiddenColumnsDetail);
    });

    test('should rerender after hidden empty column fields if enable force render', () => {
      const defaultHiddenColumnsDetail = [
        null,
      ] as unknown as HiddenColumnsInfo[];

      pivotSheet.store.set('hiddenColumnsDetail', defaultHiddenColumnsDetail);

      const renderSpy = jest
        .spyOn(pivotSheet, 'render')
        .mockImplementationOnce(async () => {});

      pivotSheet.interaction.hideColumns([], true);

      const hiddenColumnsDetail = pivotSheet.store.get('hiddenColumnsDetail');

      expect(renderSpy).toHaveBeenCalledTimes(1);
      expect(hiddenColumnsDetail).toEqual([]);
    });

    test('should default hidden columns by interaction hiddenColumnFields config', async () => {
      const hiddenColumns = [typePriceColumnId];
      const sheet = new PivotSheet(getContainer(), pivotDataCfg, {
        ...s2Options,
        interaction: {
          hiddenColumnFields: hiddenColumns,
        },
      });

      await sheet.render();

      const hiddenColumnsDetail = sheet.store.get('hiddenColumnsDetail', []);
      const [priceDetail] = hiddenColumnsDetail;

      expect(sheet.options.interaction?.hiddenColumnFields).toEqual(
        hiddenColumns,
      );
      expect(sheet.facet.getColLeafNodes().map((node) => node.id)).toEqual([
        cityPriceColumnId,
      ]);
      expect(hiddenColumnsDetail).toHaveLength(1);
      expect(priceDetail.displaySiblingNode.prev).toEqual(null);
      expect(priceDetail.displaySiblingNode.next?.id).toEqual(
        cityPriceColumnId,
      );
      expect(priceDetail.hideColumnNodes).toHaveLength(1);
      expect(priceDetail.hideColumnNodes[0].id).toEqual(typePriceColumnId);
    });

    // https://github.com/antvis/S2/issues/1993
    test('should render correctly x and width after hide columns grandTotals next sibling cell', async () => {
      const nodeId = 'root[&]笔[&]义乌[&]price';

      pivotSheet.setOptions({
        style: {
          colCell: {
            width: 100,
          },
        },
        totals: {
          col: {
            showGrandTotals: true,
            showSubTotals: false,
            reverseLayout: true,
            reverseSubLayout: true,
            subTotalsDimensions: ['type'],
          },
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            reverseLayout: true,
            reverseSubLayout: true,
            subTotalsDimensions: ['province'],
          },
        },
      });
      await pivotSheet.render();

      pivotSheet.interaction.hideColumns([nodeId]);

      const grandTotalsNode = pivotSheet.facet
        .getColNodes()
        .find((node) => node.isGrandTotals)!;

      const rootNode = pivotSheet.facet
        .getColNodes()
        .find((node) => node.id === 'root[&]笔')!;

      const parentNode = pivotSheet.facet
        .getColNodes()
        .find((node) => node.id === 'root[&]笔[&]义乌')!;

      const hiddenColumnsInfo = pivotSheet.store.get('hiddenColumnsDetail')[0];

      expect(rootNode.width).toEqual(100);
      expect(rootNode.x).toEqual(100);
      expect(grandTotalsNode.width).toEqual(100);
      expect(grandTotalsNode.x).toEqual(0);
      expect(hiddenColumnsInfo).toBeTruthy();
      expect(parentNode.hiddenChildNodeInfo).toEqual(hiddenColumnsInfo);
    });

    test('should hide columns for multiple columns', async () => {
      const hiddenColumns = [
        'root[&]自定义节点 a-1[&]自定义节点 a-1-1[&]指标1',
      ];

      pivotSheet.setDataCfg({
        ...mockPivotDataConfig,
        fields: customColGridSimpleFields,
      });
      await pivotSheet.render();

      pivotSheet.interaction.hideColumns(hiddenColumns);

      const hiddenColumnsDetail = pivotSheet.store.get(
        'hiddenColumnsDetail',
        [],
      );
      const [detail] = hiddenColumnsDetail;

      expect(pivotSheet.options.interaction?.hiddenColumnFields).toEqual(
        hiddenColumns,
      );
      expect(pivotSheet.facet.getColNodes().map((node) => node.field))
        .toMatchInlineSnapshot(`
        Array [
          "a-1",
          "a-1-1",
          "measure-2",
          "a-1-2",
          "a-2",
        ]
      `);
      expect(hiddenColumnsDetail).toHaveLength(1);
      expect(detail.displaySiblingNode.prev?.field).toBeFalsy();
      expect(detail.displaySiblingNode.next?.field).toEqual('measure-2');
      expect(detail.hideColumnNodes).toHaveLength(1);
    });

    describe('Multiple Values Tests', () => {
      let sheet: PivotSheet;

      const options: S2Options = {
        width: 600,
        height: 480,
        totals: {
          col: {
            showGrandTotals: true,
            showSubTotals: true,
            reverseLayout: true,
            reverseSubLayout: true,
            subTotalsDimensions: ['type'],
          },
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            reverseLayout: true,
            reverseSubLayout: true,
            subTotalsDimensions: ['province'],
          },
        },
      };

      beforeEach(async () => {
        sheet = new PivotSheet(
          getContainer(),
          {
            ...mockDataConfig,
            fields: {
              rows: ['province', 'city'],
              columns: ['type', 'sub_type'],
              values: ['number'],
              valueInCols: true,
            },
          },
          options,
        );
        await sheet.render();
      });

      afterEach(() => {
        sheet.destroy();
      });

      test.each([
        { id: 'root[&]总计', x: 0, width: 288 },
        { id: 'root[&]家具[&]小计', x: 96, width: 192 },
      ])('should hide totals node for %o', ({ id, x, width }) => {
        sheet.interaction.hideColumns([id]);

        const totalsSiblingNode = sheet.facet
          .getColNodes()
          .find((node) => node.id === 'root[&]家具')!;

        expect(totalsSiblingNode.x).toEqual(x);
        expect(totalsSiblingNode.width).toEqual(width);
        expect(
          sheet.facet.getColNodes().some((node) => node.id === id),
        ).toBeFalsy();
        expect(sheet.facet.getColLeafNodes()).toHaveLength(6);
      });

      test('should hide measure node', () => {
        const nodeIds = [
          'root[&]家具[&]桌子[&]number',
          'root[&]办公用品[&]笔[&]number',
        ];

        sheet.interaction.hideColumns(nodeIds);

        expect(
          sheet.facet
            .getColLeafNodes()
            .find((node) => nodeIds.includes(node.id)),
        ).toBeFalsy();
      });

      test('should render correct row corner after hide measure node', () => {
        const nodeIds = [
          'root[&]总计',
          'root[&]小计',
          'root[&]家具[&]桌子[&]number',
          'root[&]办公用品[&]笔[&]number',
        ];

        sheet.interaction.hideColumns(nodeIds);

        const cornerNodes = sheet.facet.getCornerNodes();
        const colCornerNodesMeta = cornerNodes.map((node) =>
          pick(node, ['x', 'y', 'width', 'height']),
        );

        // 避免采样的节点被隐藏后, 影响角头坐标计算
        expect(
          sheet.facet.getLayoutResult().colsHierarchy.sampleNodeForLastLevel?.y,
        ).toStrictEqual(60);
        expect(colCornerNodesMeta).toMatchInlineSnapshot(`
          Array [
            Object {
              "height": 30,
              "width": 99,
              "x": 0,
              "y": 60,
            },
            Object {
              "height": 30,
              "width": 99,
              "x": 99,
              "y": 60,
            },
            Object {
              "height": 30,
              "width": 198,
              "x": 0,
              "y": 0,
            },
            Object {
              "height": 30,
              "width": 198,
              "x": 0,
              "y": 30,
            },
          ]
        `);
      });

      // https://github.com/antvis/S2/issues/1721
      test('should hide grand totals node1', async () => {
        const nodeId = 'root[&]总计[&]sub_type';

        sheet.setDataCfg({
          ...mockDataConfig,
          fields: {
            rows: ['province', 'city'],
            columns: ['type'],
            values: ['sub_type', 'number'],
            valueInCols: true,
          },
        });
        await sheet.render();

        sheet.interaction.hideColumns([nodeId]);

        const leafNodes = sheet.facet.getColLeafNodes();

        expect(leafNodes.some((node) => node.id === nodeId)).toBeFalsy();
        expect(leafNodes).toHaveLength(5);
      });
    });
  });
});
