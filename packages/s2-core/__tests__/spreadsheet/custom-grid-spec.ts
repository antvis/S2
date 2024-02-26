import type { Group } from '@antv/g';
import { CustomGridData } from 'tests/data/data-custom-grid';
import { getContainer } from 'tests/util/helpers';
import { pick } from 'lodash';
import { waitForRender } from 'tests/util';
import { KEY_GROUP_COL_RESIZE_AREA } from '../../src/common/constant';
import { CustomGridPivotDataSet } from '../../src/data-set/custom-grid-pivot-data-set';
import {
  customColGridSimpleFields,
  customRowGridSimpleFields,
} from '../data/custom-grid-simple-fields';
import {
  expectHighlightActiveNodes,
  getSelectedCount,
  getSelectedSum,
  getTestTooltipData,
  mapCellNodeValues,
} from '../util/interaction';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import type { S2DataConfig, S2Options } from '@/common/interface';

const s2Options: S2Options = {
  width: 600,
  height: 400,
  hierarchyType: 'grid',
};

describe('SpreadSheet Custom Grid Tests', () => {
  let s2: SpreadSheet;

  const baseDataConfig: Pick<S2DataConfig, 'data' | 'meta'> = {
    data: CustomGridData,
    meta: [
      {
        field: 'type',
        name: '类型',
      },
      {
        field: 'sub_type',
        name: '子类型',
      },
      {
        field: 'a-1',
        name: '层级1',
      },
      {
        field: 'a-1-1',
        name: '层级2',
      },
      {
        field: 'measure-1',
        name: '层级3',
      },
    ],
  };

  describe('Custom Row Grid Tests', () => {
    const customRowDataCfg: S2DataConfig = {
      ...baseDataConfig,
      fields: customRowGridSimpleFields,
    };

    beforeEach(async () => {
      s2 = new PivotSheet(getContainer(), customRowDataCfg, s2Options);
      await s2.render();
    });

    afterEach(() => {
      s2.destroy();
    });

    test('should disable valueInCols', () => {
      expect(s2.dataSet.fields.valueInCols).toBeFalsy();
    });

    test('should use custom grid pivot dataSet', () => {
      expect(s2.dataSet).toBeInstanceOf(CustomGridPivotDataSet);
    });

    test('should render custom layout row nodes', () => {
      const rowNodes = s2.facet.getRowNodes().map((node) => {
        return {
          value: node.value,
          width: node.width,
          height: node.height,
          description: node.extra?.['description'],
        };
      });

      expect(rowNodes).toMatchSnapshot();
    });

    test('should calc correctly row index of leaf nodes', () => {
      const rowLeafNodes = s2.facet.getRowLeafNodes().map((node) => {
        return {
          value: node.value,
          rowIndex: node.rowIndex,
        };
      });

      expect(rowLeafNodes).toMatchSnapshot();
    });

    test('should calc correctly leaf nodes width after row resized', async () => {
      s2.setOptions({
        style: {
          rowCell: {
            widthByField: {
              'a-1-1': 40,
            },
          },
        },
      });
      await s2.render(false);

      const rowLeafNodes = s2.facet.getRowLeafNodes().map((node) => {
        return {
          field: node.field,
          width: node.width,
        };
      });

      const colLeafNodes = s2.facet.getColLeafNodes().map((node) => {
        return {
          field: node.field,
          width: node.width,
        };
      });

      expect(rowLeafNodes).toMatchSnapshot();
      expect(colLeafNodes).toMatchSnapshot();
    });

    test('should select custom row header cell', () => {
      // a-1
      const rowNode = s2.facet.getRowNodes()[0];

      // 选中 a-1
      s2.interaction.selectHeaderCell({
        cell: rowNode.belongsCell!,
      });

      // 选中单元格本身
      expect(s2.interaction.getActiveCells()).toHaveLength(1);
      // 高亮子节点
      expectHighlightActiveNodes(s2, [
        'root[&]a-1[&]a-1-1',
        'root[&]a-1[&]a-1-1[&]measure-1',
        'root[&]a-1[&]a-1-1[&]measure-2',
        'root[&]a-1[&]a-1-2',
      ]);

      // 取消选中 a - 1
      s2.interaction.selectHeaderCell({
        cell: rowNode.belongsCell!,
      });
      expect(s2.interaction.getActiveCells()).toBeEmpty();
    });

    test.each([
      { field: 'a-1', count: 6, sum: 34 },
      { field: 'a-1-1', count: 4, sum: 34 },
      { field: 'measure-1', count: 2, sum: 24 },
      { field: 'measure-2', count: 2, sum: 10 },
      { field: 'a-1-2', count: 2, sum: null },
      { field: 'a-1-2', count: 2, sum: null },
    ])(
      'should get selected cell summary infos for %o',
      ({ field, count, sum }) => {
        const rowNode = s2.facet
          .getRowNodes()
          .find((node) => node.field === field)!;

        // 选中
        s2.interaction.selectHeaderCell({
          cell: rowNode.belongsCell!,
        });

        const tooltipData = getTestTooltipData(s2, rowNode.belongsCell!);

        // 选中个数
        expect(getSelectedCount(tooltipData.summaries!)).toEqual(count);
        // 汇总数据总和
        expect(getSelectedSum(tooltipData.summaries!)).toEqual(sum);
      },
    );

    test('should render custom format corner text', () => {
      const cornerCellLabels = s2.facet.getCornerCells().map((cell) => {
        const value = cell.getActualText();
        const meta = cell.getMeta();

        return {
          value,
          field: meta.field,
        };
      });

      expect(cornerCellLabels).toMatchSnapshot();
    });

    test('should format custom rows', async () => {
      s2.setDataCfg({
        ...customRowDataCfg,
        meta: [
          {
            field: 'measure-1',
            formatter: (value) => `#-${value}`,
          },
          {
            field: 'a-1',
            formatter: (value) => `%-${value}`,
          },
          {
            field: 'a-1-1',
            formatter: (value) => `@-${value}`,
          },
          {
            field: 'a-1-2',
            formatter: (value) => `&-${value}`,
          },
          {
            field: 'a-2',
            formatter: (value) => `*-${value}`,
          },
        ],
      });
      await s2.render();

      const { rowNodes, dataCellTexts } = mapCellNodeValues(s2);

      expect(rowNodes).toMatchSnapshot();
      expect(dataCellTexts).toMatchSnapshot();
    });
  });

  describe('Custom Col Grid Tests', () => {
    const mapColNodes = (nodes = s2.facet.getColNodes()) => {
      return nodes.map((node) => {
        return {
          ...pick(node, ['field', 'value', 'x', 'y', 'width', 'height']),
          description: node.extra?.['description'],
        };
      });
    };
    const customColDataCfg: S2DataConfig = {
      ...baseDataConfig,
      fields: customColGridSimpleFields,
    };

    beforeEach(async () => {
      s2 = new PivotSheet(getContainer(), customColDataCfg, s2Options);
      await s2.render();
    });

    afterEach(() => {
      s2.destroy();
    });

    test('should enable valueInCols', () => {
      expect(s2.dataCfg.fields.valueInCols).toBeTruthy();
      expect(s2.dataSet.fields.valueInCols).toBeTruthy();
    });

    /*
     * test('should use custom grid pivot dataSet', () => {
     *   expect(s2.dataSet).toBeInstanceOf(CustomGridPivotDataSet);
     * });
     */

    test('should render custom layout column nodes', () => {
      const colNodes = mapColNodes();

      expect(colNodes).toMatchSnapshot();
    });

    test('should calc correctly col index of leaf nodes', () => {
      const colLeafNodes = s2.facet.getColLeafNodes().map((node) => {
        return {
          value: node.value,
          colIndex: node.colIndex,
        };
      });

      expect(colLeafNodes).toMatchSnapshot();
    });

    test('should calc correctly leaf nodes width after column resized', async () => {
      s2.setOptions({
        style: {
          colCell: {
            heightByField: {
              'a-1-1': 40,
            },
          },
        },
      });
      await s2.render(false);

      const colNodes = s2.facet.getColNodes().map((node) => {
        return {
          value: node.value,
          height: node.height,
        };
      });

      expect(colNodes).toMatchSnapshot();
    });

    test('should select custom col header cell', () => {
      // a-1
      const colNode = s2.facet.getColNodes()[0];

      // 选中 a-1
      s2.interaction.selectHeaderCell({
        cell: colNode.belongsCell!,
      });

      // 选中单元格本身
      expect(s2.interaction.getActiveCells()).toHaveLength(1);
      // 高亮子节点
      expectHighlightActiveNodes(s2, [
        'root[&]a-1[&]a-1-1',
        'root[&]a-1[&]a-1-1[&]measure-1',
        'root[&]a-1[&]a-1-1[&]measure-2',
        'root[&]a-1[&]a-1-2',
      ]);

      // 取消选中 a - 1
      s2.interaction.selectHeaderCell({
        cell: colNode.belongsCell!,
      });
      expect(s2.interaction.getActiveCells()).toBeEmpty();
    });

    test.each([
      { field: 'a-1', count: 6, sum: 34 },
      { field: 'a-1-1', count: 4, sum: 34 },
      { field: 'measure-1', count: 2, sum: 24 },
      { field: 'measure-2', count: 2, sum: 10 },
      { field: 'a-1-2', count: 2, sum: null },
      { field: 'a-1-2', count: 2, sum: null },
    ])(
      'should get selected cell summary infos for %o',
      ({ field, count, sum }) => {
        const colNode = s2.facet
          .getColNodes()
          .find((node) => node.field === field)!;

        // 选中
        s2.interaction.selectHeaderCell({
          cell: colNode.belongsCell!,
        });

        const tooltipData = getTestTooltipData(s2, colNode.belongsCell!);

        // 选中个数
        expect(getSelectedCount(tooltipData.summaries)).toEqual(count);
        // 汇总数据总和
        expect(getSelectedSum(tooltipData.summaries)).toEqual(sum);
      },
    );

    test('should render custom format corner text', () => {
      const cornerCellLabels = s2.facet.getCornerCells().map((cell) => {
        const value = cell.getActualText();
        const meta = cell.getMeta();

        return {
          value,
          field: meta.field,
        };
      });

      expect(cornerCellLabels).toMatchSnapshot();
    });

    test('should hide columns', async () => {
      const hiddenColumns = ['root[&]a-1[&]a-1-1[&]measure-2'];

      await waitForRender(s2, () => {
        s2.interaction.hideColumns(hiddenColumns);
      });

      const hiddenColumnsDetail = s2.store.get('hiddenColumnsDetail', []);
      const [measureDetail] = hiddenColumnsDetail;

      expect(s2.options.interaction?.hiddenColumnFields).toEqual(hiddenColumns);
      expect(s2.facet.getColNodes().map((node) => node.field)).toEqual([
        'a-1',
        'a-1-1',
        'measure-1',
        'a-1-2',
        'a-2',
      ]);
      expect(hiddenColumnsDetail).toHaveLength(1);
      expect(measureDetail.displaySiblingNode.prev?.field).toEqual('measure-1');
      expect(measureDetail.displaySiblingNode.next?.field).toEqual('a-1-2');
      expect(measureDetail.hideColumnNodes).toHaveLength(1);
      expect(measureDetail.hideColumnNodes[0].field).toEqual('measure-2');
    });

    // https://github.com/antvis/S2/issues/1979
    test('should render correctly resize group for custom column fields', async () => {
      s2.setTheme({
        resizeArea: {
          backgroundOpacity: 1,
        },
      });
      await s2.render(false);

      const groups = s2.facet.foregroundGroup.getElementById<Group>(
        KEY_GROUP_COL_RESIZE_AREA,
      );

      expect(groups?.childNodes.length).toEqual(8);
    });

    // https://github.com/antvis/S2/issues/2017
    test('should format custom columns', async () => {
      s2.setDataCfg({
        ...customColDataCfg,
        meta: [
          {
            field: 'measure-1',
            formatter: (value) => `#-${value}`,
          },
          {
            field: 'measure-2',
            formatter: (value) => `666-${value}`,
          },
          {
            field: 'a-1',
            formatter: (value) => `%-${value}`,
          },
        ],
      });
      await s2.render();

      const { colNodes, dataCellTexts } = mapCellNodeValues(s2);

      expect(colNodes).toMatchSnapshot();
      expect(dataCellTexts).toMatchSnapshot();

      // 列头数值名称不应该按 formatter 格式化
      const measureNodes = colNodes.filter((node) =>
        node.id.startsWith('measure-'),
      );

      expect(
        measureNodes.every((node) => node.actualText === node.value),
      ).toBeTruthy();
    });

    // https://github.com/antvis/S2/issues/2117
    test('should calc correctly leaf nodes height and corner nodes', async () => {
      s2.setDataCfg({
        ...customColDataCfg,
        fields: {
          ...customColGridSimpleFields,
          columns: [
            {
              field: 'a-0',
              title: '测试-0',
              children: [
                {
                  field: 'a-0-1',
                  title: '测试-0-1',
                },
                {
                  field: 'a-0-2',
                  title: '测试-0-2',
                },
              ],
            },
            ...customColGridSimpleFields.columns!,
          ],
        },
      });
      await s2.render();

      const colNodes = mapColNodes();
      const cornerNodes = mapColNodes(s2.facet.getCornerNodes());
      const node1 = s2.facet
        .getColNodes()
        .find(({ field }) => field === 'a-0-1');
      const node2 = s2.facet
        .getColNodes()
        .find(({ field }) => field === 'a-0-2');

      expect(node1?.height).toEqual(60);
      expect(node1?.height).toEqual(node2?.height);
      expect(colNodes).toMatchSnapshot();
      expect(cornerNodes).toMatchSnapshot();
    });
  });
});
