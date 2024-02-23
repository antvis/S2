import { difference, pick } from 'lodash';
import * as mockDataConfig from 'tests/data/mock-dataset.json';
import * as mockPivotDataConfig from 'tests/data/simple-data.json';
import * as mockTableDataConfig from 'tests/data/simple-table-data.json';
import { waitForRender } from 'tests/util';
import { createPivotSheet, getContainer } from 'tests/util/helpers';
import { customColGridSimpleFields } from '../data/custom-grid-simple-fields';
import { customColMultipleColumns } from '../data/custom-table-col-fields';
import { PivotSheet, TableSheet } from '@/sheet-type';
import type { HiddenColumnsInfo, S2DataConfig, S2Options } from '@/common';

const s2Options: S2Options = {
  width: 400,
  height: 120,
  tooltip: {
    enable: true,
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
      // tableSheet.destroy();
    });

    test('should get init column node', () => {
      expect(tableSheet.facet.getColNodes().map((node) => node.field)).toEqual(
        mockTableDataConfig.fields.columns,
      );
      expect(
        tableSheet.facet.getInitColLeafNodes().map((node) => node.field),
      ).toEqual(mockTableDataConfig.fields.columns);
    });

    test('should hide column correctly', async () => {
      const hiddenColumns = ['cost'];

      await waitForRender(tableSheet, async () => {
        await tableSheet.interaction.hideColumns(hiddenColumns);
      });

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

    test('should hide multiple columns correctly', async () => {
      const hiddenColumns = ['price', 'city'];

      await waitForRender(tableSheet, async () => {
        await tableSheet.interaction.hideColumns(hiddenColumns);
      });

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

    test('should hide closer group columns correctly', async () => {
      const hiddenColumns = ['cost', 'province'];

      await waitForRender(tableSheet, async () => {
        await tableSheet.interaction.hideColumns(hiddenColumns);
      });

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

      sheet.destroy();
    });

    test('should hide columns for multiple columns', async () => {
      const hiddenColumns = ['root[&]a-1[&]a-1-1[&]province'];

      tableSheet.setDataCfg({
        ...mockTableDataConfig,
        fields: {
          columns: customColMultipleColumns,
        },
      });
      await tableSheet.render();
      await waitForRender(tableSheet, async () => {
        await tableSheet.interaction.hideColumns(hiddenColumns);
      });

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

    // https://github.com/antvis/S2/issues/2495
    test('should reset latest hidden columns detail when hiddenColumnFields changed', async () => {
      const hiddenColumns = ['province', 'city'];
      const sheet = new TableSheet(getContainer(), mockTableDataConfig, {
        ...s2Options,
        interaction: {
          hiddenColumnFields: hiddenColumns,
        },
      });

      await sheet.render();

      sheet.setOptions({
        interaction: {
          hiddenColumnFields: ['city'],
        },
      });

      await sheet.render(false);

      const hiddenColumnsDetail = sheet.store.get('hiddenColumnsDetail', []);
      const [cityDetail] = hiddenColumnsDetail;

      expect(sheet.options.interaction!.hiddenColumnFields).toEqual(['city']);
      expect(hiddenColumnsDetail).toHaveLength(1);
      expect(cityDetail.hideColumnNodes).toHaveLength(1);
      expect(cityDetail.hideColumnNodes[0].field).toEqual('city');
    });

    test('should clear hidden columns detail if hiddenColumnFields is empty', async () => {
      const hiddenColumns = ['province', 'city'];
      const sheet = new TableSheet(getContainer(), mockTableDataConfig, {
        ...s2Options,
        interaction: {
          hiddenColumnFields: hiddenColumns,
        },
      });

      await sheet.render();

      sheet.setOptions({
        interaction: {
          hiddenColumnFields: [],
        },
      });

      await sheet.render(false);

      const hiddenColumnsDetail = sheet.store.get('hiddenColumnsDetail', []);

      expect(sheet.options.interaction!.hiddenColumnFields).toBeEmpty();
      expect(hiddenColumnsDetail).toBeEmpty();
    });
  });

  describe('PivotSheet', () => {
    const typePriceColumnId = 'root[&]笔[&]义乌[&]price';
    const cityPriceColumnId = 'root[&]笔[&]杭州[&]price';

    let pivotSheet: PivotSheet;

    const pivotDataCfg: S2DataConfig = {
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

    test('should hide column correctly', async () => {
      const hiddenColumns = [typePriceColumnId];

      await waitForRender(pivotSheet, async () => {
        await pivotSheet.interaction.hideColumns(hiddenColumns);
      });

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

    test('should hide multiple columns correctly', async () => {
      const hiddenColumns = [typePriceColumnId, cityPriceColumnId];

      await waitForRender(pivotSheet, async () => {
        await pivotSheet.interaction.hideColumns(hiddenColumns);
      });
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

    test('should not rerender after hidden empty column fields if disable force render', async () => {
      const defaultHiddenColumnsDetail = [
        null,
      ] as unknown as HiddenColumnsInfo[];

      pivotSheet.store.set('hiddenColumnsDetail', defaultHiddenColumnsDetail);

      const renderSpy = jest
        .spyOn(pivotSheet, 'render')
        .mockImplementationOnce(async () => {});

      await pivotSheet.interaction.hideColumns([], false);

      const hiddenColumnsDetail = pivotSheet.store.get('hiddenColumnsDetail');

      expect(renderSpy).not.toHaveBeenCalled();
      expect(hiddenColumnsDetail).toEqual(defaultHiddenColumnsDetail);
    });

    test('should rerender after hidden empty column fields if enable force render', async () => {
      const defaultHiddenColumnsDetail = [
        null,
      ] as unknown as HiddenColumnsInfo[];

      pivotSheet.store.set('hiddenColumnsDetail', defaultHiddenColumnsDetail);

      const renderSpy = jest
        .spyOn(pivotSheet, 'render')
        .mockImplementationOnce(async () => {});

      await pivotSheet.interaction.hideColumns([], true);

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

      sheet.destroy();
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
            reverseGrandTotalsLayout: true,
            reverseSubTotalsLayout: true,
            subTotalsDimensions: ['type'],
          },
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            reverseGrandTotalsLayout: true,
            reverseSubTotalsLayout: true,
            subTotalsDimensions: ['province'],
          },
        },
      });
      await pivotSheet.render();
      await waitForRender(pivotSheet, async () => {
        await pivotSheet.interaction.hideColumns([nodeId]);
      });

      const grandTotalsNode = pivotSheet.facet
        .getColNodes()
        .find((node) => node.isGrandTotals)!;

      const rootNode = pivotSheet.facet.getColNodeById('root[&]笔')!;
      const hiddenColumnsInfo = pivotSheet.store.get('hiddenColumnsDetail')[0];

      expect(rootNode.width).toEqual(100);
      expect(rootNode.x).toEqual(100);
      expect(grandTotalsNode.width).toEqual(100);
      expect(grandTotalsNode.x).toEqual(0);
      expect(hiddenColumnsInfo).toBeTruthy();
    });

    // https://github.com/antvis/S2/issues/2355
    test('should render correctly x and width after hide columns when there is only one value for the higher-level dimension.', async () => {
      const nodeId = 'root[&]笔[&]义乌[&]price';

      pivotSheet.setOptions({
        style: {
          colCell: {
            width: 100,
          },
        },
      });
      const data = pivotSheet.dataCfg.data.map((i) => ({ ...i, cost: 0 }));

      pivotSheet.setDataCfg({
        data,
        fields: {
          values: ['cost', 'price'],
        },
      });
      await pivotSheet.render();

      await pivotSheet.interaction.hideColumns([nodeId]);

      const rootNode = pivotSheet.facet.getColNodeById('root[&]笔');

      expect(rootNode!.width).toEqual(300);
      expect(rootNode!.x).toEqual(0);
    });

    // https://github.com/antvis/S2/issues/2194
    test('should render correctly when always hidden last column', async () => {
      const sheet = createPivotSheet(
        {
          interaction: {
            hiddenColumnFields: [],
          },
        },
        { useSimpleData: false },
      );

      await sheet.render();

      // 模拟一列一列的手动隐藏最后一列
      const colIds = [
        'root[&]办公用品[&]纸张[&]number',
        'root[&]办公用品[&]笔[&]number',
        'root[&]家具[&]沙发[&]number',
      ];

      await Promise.all(
        colIds.map(async (field) => {
          await sheet.interaction.hideColumns([field]);
        }),
      );

      const leafNodes = sheet.facet.getColLeafNodes();

      expect(leafNodes).toHaveLength(1);
      expect(leafNodes[0].id).toEqual('root[&]家具[&]桌子[&]number');
    });

    test('should hide columns for multiple columns', async () => {
      const hiddenColumns = ['root[&]a-1[&]a-1-1[&]measure-1'];

      pivotSheet.setDataCfg({
        ...mockPivotDataConfig,
        fields: customColGridSimpleFields,
      });
      await pivotSheet.render();
      await waitForRender(pivotSheet, async () => {
        await pivotSheet.interaction.hideColumns(hiddenColumns);
      });

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
            reverseGrandTotalsLayout: true,
            reverseSubTotalsLayout: true,
            subTotalsDimensions: ['type'],
          },
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            reverseGrandTotalsLayout: true,
            reverseSubTotalsLayout: true,
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
      ])('should hide totals node for %o', async ({ id, x, width }) => {
        await waitForRender(sheet, async () => {
          await sheet.interaction.hideColumns([id]);
        });

        const totalsSiblingNode = sheet.facet.getColNodeById('root[&]家具')!;

        expect(totalsSiblingNode.x).toEqual(x);
        expect(totalsSiblingNode.width).toEqual(width);
        expect(
          sheet.facet.getColNodes().some((node) => node.id === id),
        ).toBeFalsy();
        expect(sheet.facet.getColLeafNodes()).toHaveLength(6);
      });

      test('should hide measure node', async () => {
        const nodeIds = [
          'root[&]家具[&]桌子[&]number',
          'root[&]办公用品[&]笔[&]number',
        ];

        await waitForRender(sheet, async () => {
          await sheet.interaction.hideColumns(nodeIds);
        });

        expect(
          sheet.facet
            .getColLeafNodes()
            .find((node) => nodeIds.includes(node.id)),
        ).toBeFalsy();
      });

      test('should render correct row corner after hide measure node', async () => {
        const nodeIds = [
          'root[&]总计',
          'root[&]家具[&]小计',
          'root[&]家具[&]桌子[&]number',
          'root[&]办公用品[&]笔[&]number',
        ];

        await waitForRender(sheet, async () => {
          await sheet.interaction.hideColumns(nodeIds);
        });

        const cornerNodes = sheet.facet.getCornerNodes();
        const colCornerNodesMeta = cornerNodes.map((node) =>
          pick(node, ['x', 'y', 'width', 'height']),
        );

        // 避免采样的节点被隐藏后, 影响角头坐标计算
        const { colsHierarchy } = sheet.facet.getLayoutResult();

        expect(colsHierarchy.sampleNodeForLastLevel?.height).toStrictEqual(30);
        expect(colsHierarchy.sampleNodeForLastLevel?.y).toStrictEqual(60);
        expect(colsHierarchy.height).toStrictEqual(90);
        expect(colCornerNodesMeta).toMatchSnapshot();
      });

      // https://github.com/antvis/S2/issues/1721
      test('should hide grand totals node', async () => {
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
        await sheet.interaction.hideColumns([nodeId]);

        const leafNodes = sheet.facet.getColLeafNodes();

        expect(leafNodes.some((node) => node.id === nodeId)).toBeFalsy();
        expect(leafNodes).toHaveLength(5);
      });

      test.each(['grid', 'tree'] as S2Options['hierarchyType'][])(
        'hiding the column totals should not hide the row totals for %s mode',
        async (hierarchyType) => {
          sheet.setOptions({ hierarchyType });
          await sheet.render();

          const nodeId = 'root[&]总计';
          const preRowNodes = sheet.facet.getRowNodes();
          const preColumnNodes = sheet.facet.getColNodes();

          await waitForRender(sheet, async () => {
            await sheet.interaction.hideColumns([nodeId]);
          });

          expect(sheet.facet.getRowNodes()[0].id).toBe(nodeId);
          expect(sheet.facet.getRowNodes().length).toBe(preRowNodes.length);
          expect(sheet.facet.getColNodes().length).toBe(
            preColumnNodes.length - 1,
          );
        },
      );
    });
  });
});
