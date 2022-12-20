import { CustomGridData } from 'tests/data/data-custom-grid';
import { getContainer } from 'tests/util/helpers';
import {
  customColGridSimpleFields,
  customRowGridSimpleFields,
} from '../data/custom-grid-simple-fields';
import { CustomGridPivotDataSet } from '../../src/data-set/custom-grid-pivot-data-set';
import {
  expectHighlightActiveNodes,
  getSelectedCount,
  getSelectedSum,
  getTestTooltipData,
} from '../util/interaction';
import type { HeaderCell } from '../../src/cell/header-cell';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import type { S2DataConfig, S2Options } from '@/common/interface';

const s2Options: S2Options = {
  width: 600,
  height: 400,
  hierarchyType: 'grid',
};

describe('SpreadSheet Custom Grid Tests', () => {
  let s2: SpreadSheet;

  const baseDataConfig = {
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

    beforeEach(() => {
      s2 = new PivotSheet(getContainer(), customRowDataCfg, s2Options);
      s2.render();
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
      const rowNodes = s2.getRowNodes().map((node) => ({
        value: node.value,
        width: node.width,
        height: node.height,
        description: node.extra.description,
      }));

      expect(rowNodes).toMatchSnapshot();
    });

    test('should calc correctly row index of leaf nodes', () => {
      const rowLeafNodes = s2.getRowLeafNodes().map((node) => ({
        value: node.value,
        rowIndex: node.rowIndex,
      }));
      expect(rowLeafNodes).toMatchSnapshot();
    });

    test('should calc correctly leaf nodes width after row resized', () => {
      s2.setOptions({
        style: {
          rowCfg: {
            widthByField: {
              'a-1-1': 40,
            },
          },
        },
      });
      s2.render(false);

      const rowLeafNodes = s2.getRowLeafNodes().map((node) => ({
        field: node.field,
        width: node.width,
      }));

      const colLeafNodes = s2.getColumnLeafNodes().map((node) => ({
        field: node.field,
        width: node.width,
      }));

      expect(rowLeafNodes).toMatchSnapshot();

      expect(colLeafNodes).toMatchSnapshot();
    });

    test('should select custom row header cell', () => {
      // a-1
      const rowNode = s2.getRowNodes()[0];

      // 选中 a-1
      s2.interaction.selectHeaderCell({
        cell: rowNode.belongsCell!,
      });

      // 选中单元格本身
      expect(s2.interaction.getActiveCells()).toHaveLength(1);
      // 高亮子节点
      expectHighlightActiveNodes(s2, [
        'root[&]自定义节点 a-1[&]自定义节点 a-1-1[&]指标1',
        'root[&]自定义节点 a-1[&]自定义节点 a-1-1[&]指标2',
        'root[&]自定义节点 a-1[&]自定义节点 a-1-2',
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
        const rowNode = s2.getRowNodes().find((node) => node.field === field)!;

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
      const cornerCellLabels = (s2.facet as any)
        .getCornerHeader()
        .getChildren()
        .map((cell: HeaderCell) => {
          const value = cell.getActualText();
          const meta = cell.getMeta();
          return {
            value,
            field: meta.field,
          };
        });

      expect(cornerCellLabels).toMatchSnapshot();
    });
  });

  describe('Custom Col Grid Tests', () => {
    const customColDataCfg: S2DataConfig = {
      ...baseDataConfig,
      fields: customColGridSimpleFields,
    };

    beforeEach(() => {
      s2 = new PivotSheet(getContainer(), customColDataCfg, s2Options);
      s2.render();
    });

    afterEach(() => {
      s2.destroy();
    });

    test('should enable valueInCols', () => {
      expect(s2.dataCfg.fields.valueInCols).toBeTruthy();
      expect(s2.dataSet.fields.valueInCols).toBeTruthy();
    });

    // test('should use custom grid pivot dataSet', () => {
    //   expect(s2.dataSet).toBeInstanceOf(CustomGridPivotDataSet);
    // });

    test('should render custom layout column nodes', () => {
      const colNodes = s2.getColumnNodes().map((node) => ({
        value: node.value,
        width: node.width,
        height: node.height,
        description: node.extra.description,
      }));

      expect(colNodes).toMatchSnapshot();
    });

    test('should calc correctly col index of leaf nodes', () => {
      const colLeafNodes = s2.getColumnLeafNodes().map((node) => ({
        value: node.value,
        colIndex: node.colIndex,
      }));

      expect(colLeafNodes).toMatchSnapshot();
    });

    test('should calc correctly leaf nodes width after column resized', () => {
      s2.setOptions({
        style: {
          colCfg: {
            heightByField: {
              'a-1-1': 40,
            },
          },
        },
      });
      s2.render(false);

      const colNodes = s2.getColumnNodes().map((node) => ({
        value: node.value,
        height: node.height,
      }));

      expect(colNodes).toMatchSnapshot();
    });

    test('should select custom col header cell', () => {
      // a-1
      const colNode = s2.getColumnNodes()[0];

      // 选中 a-1
      s2.interaction.selectHeaderCell({
        cell: colNode.belongsCell!,
      });

      // 选中单元格本身
      expect(s2.interaction.getActiveCells()).toHaveLength(1);
      // 高亮子节点
      expectHighlightActiveNodes(s2, [
        'root[&]自定义节点 a-1[&]自定义节点 a-1-1[&]指标1',
        'root[&]自定义节点 a-1[&]自定义节点 a-1-1[&]指标2',
        'root[&]自定义节点 a-1[&]自定义节点 a-1-2',
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
        const colNode = s2
          .getColumnNodes()
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
      const cornerCellLabels = (s2.facet as any)
        .getCornerHeader()
        .getChildren()
        .map((cell: HeaderCell) => {
          const value = cell.getActualText();
          const meta = cell.getMeta();
          return {
            value,
            field: meta.field,
          };
        });

      expect(cornerCellLabels).toMatchSnapshot();
    });

    test('should hide columns', () => {
      const hiddenColumns = [
        'root[&]自定义节点 a-1[&]自定义节点 a-1-1[&]指标2',
      ];

      s2.interaction.hideColumns(hiddenColumns);

      const hiddenColumnsDetail = s2.store.get('hiddenColumnsDetail', []);
      const [measureDetail] = hiddenColumnsDetail;

      expect(s2.options.interaction?.hiddenColumnFields).toEqual(hiddenColumns);
      expect(s2.getColumnNodes().map((node) => node.field)).toEqual([
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
  });
});
