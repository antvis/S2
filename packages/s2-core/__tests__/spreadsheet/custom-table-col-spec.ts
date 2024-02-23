import type { Group } from '@antv/g';
import { getContainer } from 'tests/util/helpers';
import { waitForRender } from 'tests/util';
import { KEY_GROUP_COL_RESIZE_AREA } from '../../src/common/constant';
import {
  customColMultipleColumns,
  customColSimpleColumns,
} from '../data/custom-table-col-fields';
import { data } from '../data/mock-dataset.json';
import {
  expectHighlightActiveNodes,
  mapCellNodeValues,
} from '../util/interaction';
import { SpreadSheet, TableSheet } from '@/sheet-type';
import type { S2DataConfig, S2Options } from '@/common/interface';
import type { CustomRect } from '@/engine';

const s2Options: S2Options = {
  width: 600,
  height: 400,
};

describe('TableSheet Custom Tests', () => {
  let s2: SpreadSheet;

  const baseDataConfig: Pick<S2DataConfig, 'data' | 'meta'> = {
    data,
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

  const customColDataCfg: S2DataConfig = {
    ...baseDataConfig,
    fields: {
      columns: customColSimpleColumns,
    },
  };

  beforeEach(async () => {
    s2 = new TableSheet(getContainer(), customColDataCfg, s2Options);
    await s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  test('should render custom layout column nodes', () => {
    const colNodes = s2.facet.getColNodes().map((node) => {
      return {
        value: node.value,
        width: node.width,
        height: node.height,
        description: node.extra?.['description'],
      };
    });

    expect(colNodes).toHaveLength(7);
    expect(colNodes).toMatchSnapshot();
  });

  test('should calc correctly col index of leaf nodes', () => {
    const colLeafNodes = s2.facet.getColLeafNodes().map((node) => {
      return {
        value: node.value,
        colIndex: node.colIndex,
      };
    });

    expect(colLeafNodes).toHaveLength(5);
    expect(colLeafNodes).toMatchSnapshot();
  });

  test('should calc correctly leaf nodes width after column resized', async () => {
    s2.setOptions({
      style: {
        colCell: {
          heightByField: {
            area: 100,
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
    // 地区
    const colNode = s2.facet.getColNodes()[0];

    // 选中地区
    s2.interaction.selectHeaderCell({
      cell: colNode.belongsCell!,
    });

    // 选中单元格本身
    expect(s2.interaction.getActiveCells()).toHaveLength(1);
    // 高亮子节点
    expectHighlightActiveNodes(s2, [
      'root[&]area[&]province',
      'root[&]area[&]city',
    ]);

    // 取消选中 a - 1
    s2.interaction.selectHeaderCell({
      cell: colNode.belongsCell!,
    });
    expect(s2.interaction.getActiveCells()).toBeEmpty();
  });

  test('should hide columns', async () => {
    const hiddenColumns = ['root[&]money[&]price'];

    await waitForRender(s2, () => {
      s2.interaction.hideColumns(hiddenColumns);
    });

    const hiddenColumnsDetail = s2.store.get('hiddenColumnsDetail', []);
    const [measureDetail] = hiddenColumnsDetail;

    expect(s2.options.interaction?.hiddenColumnFields).toEqual(hiddenColumns);
    expect(s2.facet.getColNodes().map((node) => node.field)).toEqual([
      'area',
      'province',
      'city',
      'type',
      'money',
      'number',
    ]);
    expect(hiddenColumnsDetail).toHaveLength(1);
    expect(measureDetail.displaySiblingNode.prev?.field).toEqual('type');
    expect(measureDetail.displaySiblingNode.next?.field).toEqual('number');
    expect(measureDetail.hideColumnNodes).toHaveLength(1);
    expect(measureDetail.hideColumnNodes[0].field).toEqual('price');
  });

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

    expect(groups?.childNodes.length).toEqual(11);
  });

  test('should format custom column', async () => {
    s2.setDataCfg({
      ...customColDataCfg,
      meta: [
        {
          field: 'city',
          formatter: (value) => `#-${value}`,
        },
        {
          field: 'price',
          formatter: () => '2',
        },
      ],
    });
    await s2.render();

    const { colNodes, dataCellTexts } = mapCellNodeValues(s2);

    expect(colNodes).toMatchSnapshot();
    expect(dataCellTexts).toMatchSnapshot();

    // 列头不应该按 formatter 格式化
    expect(
      colNodes.every((node) => node.actualText === node.value),
    ).toBeTruthy();
  });

  test('should render default series number text', async () => {
    s2.setOptions({
      seriesNumber: {
        enable: true,
      },
    });
    await s2.render(false);

    expect(s2.facet.getColNodes()[0].value).toEqual('序号');
  });

  test('should render custom series number text', async () => {
    const seriesNumberText = '牛';

    s2.setOptions({
      seriesNumber: {
        enable: true,
        text: seriesNumberText,
      },
    });
    await s2.render(false);

    expect(s2.facet.getColNodes()[0].value).toEqual(seriesNumberText);
  });

  test('should render correctly column height if enable series number', async () => {
    s2.setOptions({
      seriesNumber: {
        enable: true,
      },
    });
    await s2.render(false);

    const nodes = s2.facet
      .getColNodes()
      .filter((node) => node.level === 0 && node.isLeaf);

    const cellHeight = s2.facet.getLayoutResult().colsHierarchy.height;

    expect(cellHeight).toEqual(60);
    expect(nodes.every((node) => node.height === cellHeight)).toBeTruthy();
  });

  test('should not sample series node', async () => {
    s2.setOptions({
      seriesNumber: {
        enable: true,
      },
    });
    await s2.render(false);

    const { sampleNodeForLastLevel, sampleNodesForAllLevels } =
      s2.facet.getLayoutResult().colsHierarchy;

    expect(sampleNodeForLastLevel?.isSeriesNumberNode()).toBeFalsy();
    expect(
      sampleNodesForAllLevels.every((node) => !node.isSeriesNumberNode()),
    ).toBeTruthy();
  });

  test('should render custom multiple column nodes', async () => {
    s2.setDataCfg({
      ...baseDataConfig,
      fields: {
        columns: customColMultipleColumns,
      },
    });
    await s2.render();

    const colNodes = s2.facet.getColNodes().map((node) => {
      return {
        value: node.value,
        width: node.width,
        height: node.height,
        description: node.extra?.['description'],
      };
    });

    expect(colNodes).toHaveLength(6);
    expect(colNodes).toMatchSnapshot();
  });

  test('should render correctly resize area handler', async () => {
    s2.setDataCfg({
      ...baseDataConfig,
      fields: {
        columns: customColMultipleColumns,
      },
    });
    s2.setTheme({
      resizeArea: {
        backgroundOpacity: 1,
      },
    });
    await s2.render();

    const resizeArea = s2.facet.foregroundGroup.getElementById<Group>(
      KEY_GROUP_COL_RESIZE_AREA,
    )!;
    const resizeAreaList = resizeArea.children as CustomRect[];

    expect(resizeAreaList.length).toEqual(8);
  });
});
