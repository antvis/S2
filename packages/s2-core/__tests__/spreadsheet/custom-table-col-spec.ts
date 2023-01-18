import type { Group } from '@antv/g';
import { getContainer } from 'tests/util/helpers';
import { KEY_GROUP_COL_RESIZE_AREA } from '../../src/common/constant';
import { customColSimpleColumns } from '../data/custom-table-col-fields';
import { data } from '../data/mock-dataset.json';
import {
  expectHighlightActiveNodes,
  mapCellNodeValues,
} from '../util/interaction';
import { SpreadSheet, TableSheet } from '@/sheet-type';
import type { S2DataConfig, S2Options } from '@/common/interface';

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

  beforeEach(() => {
    s2 = new TableSheet(getContainer(), customColDataCfg, s2Options);
    s2.render();
  });

  afterEach(() => {
    s2.destroy();
  });

  test('should render custom layout column nodes', () => {
    const colNodes = s2.getColumnNodes().map((node) => {
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
    const colLeafNodes = s2.getColumnLeafNodes().map((node) => {
      return {
        value: node.value,
        colIndex: node.colIndex,
      };
    });

    expect(colLeafNodes).toHaveLength(5);
    expect(colLeafNodes).toMatchSnapshot();
  });

  test('should calc correctly leaf nodes width after column resized', () => {
    s2.setOptions({
      style: {
        colCell: {
          heightByField: {
            area: 100,
          },
        },
      },
    });
    s2.render(false);

    const colNodes = s2.getColumnNodes().map((node) => {
      return {
        value: node.value,
        height: node.height,
      };
    });

    expect(colNodes).toMatchSnapshot();
  });

  test('should select custom col header cell', () => {
    // 地区
    const colNode = s2.getColumnNodes()[0];

    // 选中地区
    s2.interaction.selectHeaderCell({
      cell: colNode.belongsCell!,
    });

    // 选中单元格本身
    expect(s2.interaction.getActiveCells()).toHaveLength(1);
    // 高亮子节点
    expectHighlightActiveNodes(s2, [
      'root[&]地区[&]省份',
      'root[&]地区[&]城市',
    ]);

    // 取消选中 a - 1
    s2.interaction.selectHeaderCell({
      cell: colNode.belongsCell!,
    });
    expect(s2.interaction.getActiveCells()).toBeEmpty();
  });

  test('should hide columns', () => {
    const hiddenColumns = ['price'];

    s2.interaction.hideColumns(hiddenColumns);

    const hiddenColumnsDetail = s2.store.get('hiddenColumnsDetail', []);
    const [measureDetail] = hiddenColumnsDetail;

    expect(s2.options.interaction?.hiddenColumnFields).toEqual(hiddenColumns);
    expect(s2.getColumnNodes().map((node) => node.field)).toEqual([
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

  test('should render correctly resize group for custom column fields', () => {
    s2.setTheme({
      resizeArea: {
        backgroundOpacity: 1,
      },
    });
    s2.render(false);

    const groups = s2.facet.foregroundGroup.getElementById<Group>(
      KEY_GROUP_COL_RESIZE_AREA,
    );

    expect(groups?.childNodes.length).toEqual(11);
  });

  test('should format custom column', () => {
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
    s2.render();

    const { colNodes, dataCellTexts } = mapCellNodeValues(s2);

    expect(colNodes).toMatchSnapshot();
    expect(dataCellTexts).toMatchSnapshot();

    // 列头不应该按 formatter 格式化
    expect(
      colNodes.every((node) => node.actualText === node.value),
    ).toBeTruthy();
  });
});
