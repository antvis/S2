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
      expect(s2.dataCfg.fields.valueInCols).toBeFalsy();
      expect(s2.dataSet.fields.valueInCols).toBeFalsy();
    });

    test('should use custom grid pivot dataSet', () => {
      expect(s2.dataSet).toBeInstanceOf(CustomGridPivotDataSet);
    });

    test('should render custom layout row nodes', () => {
      const rowNodes = s2.getRowNodes().map((node) => ({
        label: node.label,
        width: node.width,
        height: node.height,
        description: node.extra.description,
      }));
      expect(rowNodes).toEqual([
        {
          description: 'a-1 描述',
          height: 90,
          label: '自定义节点 a-1',
          width: 120,
        },
        {
          description: 'a-1-1 描述',
          height: 60,
          label: '自定义节点 a-1-1',
          width: 120,
        },
        {
          description: '指标1描述',
          height: 30,
          label: '指标1',
          width: 120,
        },
        {
          description: '指标2描述',
          height: 30,
          label: '指标2',
          width: 120,
        },
        {
          description: 'a-1-2 描述',
          height: 30,
          label: '自定义节点 a-1-2',
          width: 240,
        },
        {
          description: 'a-2 描述',
          height: 30,
          label: '自定义节点 a-2',
          width: 360,
        },
      ]);
    });

    test('should calc correctly row index of leaf nodes', () => {
      const rowLeafNodes = s2.getRowLeafNodes().map((node) => ({
        label: node.label,
        rowIndex: node.rowIndex,
      }));
      expect(rowLeafNodes).toEqual([
        {
          label: '指标1',
          rowIndex: 0,
        },
        {
          label: '指标2',
          rowIndex: 1,
        },
        {
          label: '自定义节点 a-1-2',
          rowIndex: 2,
        },
        {
          label: '自定义节点 a-2',
          rowIndex: 3,
        },
      ]);
    });

    test('should select custom row header cell', () => {
      // a-1
      const rowNode = s2.getRowNodes()[0];

      // 选中 a-1
      s2.interaction.selectHeaderCell({
        cell: rowNode.belongsCell,
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
        cell: rowNode.belongsCell,
      });
      expect(s2.interaction.getActiveCells()).toBeEmpty();
    });

    test.each([
      { key: 'a-1', count: 6, sum: 34 },
      { key: 'a-1-1', count: 4, sum: 34 },
      { key: 'measure-1', count: 2, sum: 24 },
      { key: 'measure-2', count: 2, sum: 10 },
      { key: 'a-1-2', count: 2, sum: 0 },
      { key: 'a-1-2', count: 2, sum: 0 },
    ])(
      'should get selected cell summary infos for %o',
      ({ key, count, sum }) => {
        const rowNode = s2.getRowNodes().find((node) => node.field === key);

        // 选中
        s2.interaction.selectHeaderCell({
          cell: rowNode.belongsCell,
        });

        const tooltipData = getTestTooltipData(s2, rowNode.belongsCell);

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
          const label = cell.getActualText();
          const meta = cell.getMeta();
          return {
            label,
            field: meta.field,
          };
        });

      expect(cornerCellLabels).toEqual([
        {
          field: 'a-1',
          label: '层级1',
        },
        {
          field: 'a-1-1',
          label: '层级2',
        },
        {
          field: 'measure-1',
          label: '层级3',
        },
        {
          field: 'type',
          label: '类型',
        },
      ]);
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
        label: node.label,
        width: node.width,
        height: node.height,
        description: node.extra.description,
      }));

      expect(colNodes).toEqual([
        {
          description: 'a-1 描述',
          height: 30,
          label: '自定义节点 a-1',
          width: 300,
        },
        {
          description: 'a-1-1 描述',
          height: 30,
          label: '自定义节点 a-1-1',
          width: 200,
        },
        {
          description: '指标1描述',
          height: 30,
          label: '指标1',
          width: 100,
        },
        {
          description: '指标2描述',
          height: 30,
          label: '指标2',
          width: 100,
        },
        {
          description: 'a-1-2 描述',
          height: 60,
          label: '自定义节点 a-1-2',
          width: 100,
        },
        {
          description: 'a-2 描述',
          height: 90,
          label: '自定义节点 a-2',
          width: 100,
        },
      ]);
    });

    test('should calc correctly col index of leaf nodes', () => {
      const colLeafNodes = s2.getColumnLeafNodes().map((node) => ({
        label: node.label,
        colIndex: node.colIndex,
      }));

      expect(colLeafNodes).toEqual([
        {
          label: '指标1',
          colIndex: 0,
        },
        {
          label: '指标2',
          colIndex: 1,
        },
        {
          label: '自定义节点 a-1-2',
          colIndex: 2,
        },
        {
          label: '自定义节点 a-2',
          colIndex: 3,
        },
      ]);
    });

    test('should select custom col header cell', () => {
      // a-1
      const colNode = s2.getColumnNodes()[0];

      // 选中 a-1
      s2.interaction.selectHeaderCell({
        cell: colNode.belongsCell,
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
        cell: colNode.belongsCell,
      });
      expect(s2.interaction.getActiveCells()).toBeEmpty();
    });

    test.each([
      { key: 'a-1', count: 6, sum: 34 },
      { key: 'a-1-1', count: 4, sum: 34 },
      { key: 'measure-1', count: 2, sum: 24 },
      { key: 'measure-2', count: 2, sum: 10 },
      { key: 'a-1-2', count: 2, sum: 0 },
      { key: 'a-1-2', count: 2, sum: 0 },
    ])(
      'should get selected cell summary infos for %o',
      ({ key, count, sum }) => {
        const colNode = s2.getColumnNodes().find((node) => node.field === key);

        // 选中
        s2.interaction.selectHeaderCell({
          cell: colNode.belongsCell,
        });

        const tooltipData = getTestTooltipData(s2, colNode.belongsCell);

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
          const label = cell.getActualText();
          const meta = cell.getMeta();
          return {
            label,
            field: meta.field,
          };
        });

      expect(cornerCellLabels).toEqual([
        {
          field: 'type',
          label: '类型',
        },
        {
          field: 'sub_type',
          label: '子类型',
        },
        {
          field: 'a-1',
          label: '层级1',
        },
        {
          field: 'a-1-1',
          label: '层级2',
        },
      ]);
    });
  });
});
