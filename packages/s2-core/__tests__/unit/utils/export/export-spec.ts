/* eslint-disable jest/expect-expect */
import { PivotSheet, TableSheet } from '@/sheet-type';
import {
  asyncGetAllData,
  asyncGetAllHtmlData,
  type S2DataConfig,
  type S2Options,
  type SpreadSheet,
} from '../../../../src';
import { customRowGridSimpleFields } from '../../../data/custom-grid-simple-fields';
import { CustomGridData } from '../../../data/data-custom-grid';
import { assembleDataCfg, assembleOptions } from '../../../util';
import {
  createPivotSheet,
  createTableSheet,
  expectMatchSnapshot,
  getContainer,
} from '../../../util/helpers';

describe('TableSheet Export Test', () => {
  it('should export correct data with series number', async () => {
    const s2 = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'type',
            name: '产品类型',
            formatter: (type) => (type ? `${type}-产品` : ''),
          },
        ],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        seriesNumber: {
          enable: true,
        },
      }),
    );

    await expectMatchSnapshot(s2);
  });

  it('should export correct data with no series number', async () => {
    const s2 = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions({
        seriesNumber: {
          enable: false,
        },
      }),
    );

    await expectMatchSnapshot(s2);
  });

  // https://github.com/antvis/S2/issues/2828
  it('should export correct HTML data', async () => {
    const s2 = createTableSheet(assembleOptions(), { useSimpleData: false });

    await expectMatchSnapshot(s2, true, asyncGetAllHtmlData);
  });

  it('should export correct all type data', async () => {
    const s2 = createTableSheet(assembleOptions(), { useSimpleData: false });

    await expectMatchSnapshot(s2, true, asyncGetAllData);
  });

  it('should called with cell view meta when export formatted data', async () => {
    const formatter = jest.fn();

    const s2 = new TableSheet(
      getContainer(),
      assembleDataCfg({
        meta: [{ field: 'number', formatter }],
        fields: {
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
        },
      }),
      assembleOptions(),
    );

    await expectMatchSnapshot(s2);

    const viewMeta = s2.facet.getCellMeta(76, 4);

    expect(formatter).toHaveBeenLastCalledWith(78868, viewMeta.data, viewMeta);
  });
});

describe('PivotSheet Export Test', () => {
  const s2Options: S2Options = {
    width: 600,
    height: 600,
    hierarchyType: 'grid',
  };

  it('should export correct data in grid mode', async () => {
    const s2 = createPivotSheet(s2Options, { useSimpleData: false });

    await expectMatchSnapshot(s2);
  });

  it('should export correct data in tree mode', async () => {
    const s2 = createPivotSheet(
      {
        ...s2Options,
        hierarchyType: 'tree',
      },
      { useSimpleData: false },
    );

    await expectMatchSnapshot(s2);
  });

  // 因为导出的数据单测，很难看出问题，所以提供图片 + 代码的模式查看：
  // https://gw.alipayobjects.com/zos/antfincdn/AU83KF1Sq/6fb3f3e6-0064-4ef8-a5c3-b1333fb59adf.png
  it('should export correct data in tree mode and row collapseAll is true', async () => {
    const s2 = createPivotSheet(
      {
        ...s2Options,
        hierarchyType: 'tree',
        style: {
          rowCell: {
            collapseAll: true,
          },
        },
      },
      { useSimpleData: false },
    );

    await expectMatchSnapshot(s2);
  });

  // https://gw.alipayobjects.com/zos/antfincdn/PyrWwocNf/56d0914b-159a-4293-8615-6c1308bf4b3a.png
  it('should export correct data in tree mode and collapseAll is false', async () => {
    const s2 = createPivotSheet(
      {
        ...s2Options,
        hierarchyType: 'tree',
        style: {
          rowCell: {
            collapseAll: false,
          },
        },
      },
      { useSimpleData: false },
    );

    await expectMatchSnapshot(s2);
  });

  it('should export correct data in grid mode with valueInCols is false', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'number',
            name: '数量',
          },
        ],
        fields: {
          valueInCols: false,
        },
      }),
      s2Options,
    );

    await expectMatchSnapshot(s2);
  });

  it('should export correct data in grid mode with totals in col', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        fields: {
          valueInCols: true,
        },
      }),
      {
        ...s2Options,
        hierarchyType: 'grid',
        totals: {
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['province'],
          },
          col: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['type'],
          },
        },
      },
    );

    await expectMatchSnapshot(s2);
  });

  it('should export correct data in grid mode with grouped totals in col', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        fields: {
          valueInCols: true,
        },
      }),
      {
        ...s2Options,
        hierarchyType: 'grid',
        totals: {
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['province'],
          },
          col: {
            grandTotalsGroupDimensions: ['city', 'type'],
            subTotalsGroupDimensions: ['sub_type'],
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['type'],
          },
        },
      },
    );

    await expectMatchSnapshot(s2);
  });

  it('should export correct data in grid mode with grouped totals in row', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        fields: {
          valueInCols: false,
        },
      }),
      {
        ...s2Options,
        hierarchyType: 'grid',
        totals: {
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['province'],
          },
          col: {
            grandTotalsGroupDimensions: ['city', 'sub_type', 'province'],
            subTotalsGroupDimensions: ['sub_type'],
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['type'],
          },
        },
      },
    );

    await expectMatchSnapshot(s2);
  });

  it('should export correct data in grid mode with totals in row', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        fields: {
          valueInCols: false,
        },
      }),
      {
        ...s2Options,
        hierarchyType: 'grid',
        totals: {
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['province'],
          },
          col: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['type'],
          },
        },
      },
    );

    await expectMatchSnapshot(s2);
  });

  it('should export correct data by {formatHeader: true}', async () => {
    // 透视表行列头应该被格式化 (虚拟数值列 EXTRA_FIELD 除外)
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'province',
            name: '省份',
            formatter: (value) => {
              return `${value}-province`;
            },
          },
          {
            field: 'type',
            name: '类型',
            formatter: (value) => {
              return `${value}-type`;
            },
          },
          {
            field: 'sub_type',
            name: '子类型',
            formatter: (value) => {
              return `${value}-sub_type`;
            },
          },
          {
            field: 'city',
            name: '城市',
            formatter: (value) => {
              return `${value}-city`;
            },
          },
          {
            field: 'number',
            name: '数值',
            formatter: (value) => {
              return `${value}-number`;
            },
          },
        ],
      }),
      s2Options,
    );

    await expectMatchSnapshot(s2, {
      formatHeader: true,
      formatData: false,
    });
  });

  it('should export correct value field name by {formatHeader: true}', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'number',
            name: '数值',
          },
        ],
      }),
      s2Options,
    );

    await expectMatchSnapshot(s2, {
      formatHeader: true,
    });
  });

  it('should export correct value field name by {formatHeader: false}', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'number',
            name: '数值',
          },
        ],
      }),
      s2Options,
    );

    await expectMatchSnapshot(s2, {
      formatHeader: false,
    });
  });

  it('should export correct value field name by {formatHeader: false, formatData: true}', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'number',
            name: '数值',
            formatter: (v) => `${v}万`,
          },
        ],
      }),
      s2Options,
    );

    await expectMatchSnapshot(s2, {
      formatHeader: false,
      formatData: true,
    });
  });

  it('should export correct value field name by {formatHeader: true, formatData: true}', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'number',
            name: '数值',
            formatter: (v) => `${v}万`,
          },
        ],
      }),
      s2Options,
    );

    await expectMatchSnapshot(s2, {
      formatHeader: true,
      formatData: true,
    });
  });

  // https://github.com/antvis/S2/issues/2828
  it('should export correct HTML data', async () => {
    const s2 = createPivotSheet(s2Options, { useSimpleData: false });

    await expectMatchSnapshot(s2, true, asyncGetAllHtmlData);
  });

  it('should export correct all type data', async () => {
    const s2 = createPivotSheet(s2Options, { useSimpleData: false });

    await expectMatchSnapshot(s2, true, asyncGetAllData);
  });

  // https://github.com/antvis/S2/issues/2866
  it('should called with cell view meta when export formatted data', async () => {
    const formatter = jest.fn();

    const s2 = new PivotSheet(
      getContainer(),
      assembleDataCfg({
        meta: [
          {
            field: 'number',
            formatter,
          },
        ],
      }),
      s2Options,
    );

    await expectMatchSnapshot(s2);

    const viewMeta = s2.facet.getCellMeta(7, 3);

    expect(formatter).toHaveBeenLastCalledWith(352, viewMeta.data, viewMeta);
  });

  describe('Custom Tree Export Test', () => {
    let s2: SpreadSheet;

    beforeEach(async () => {
      const customRowDataCfg: S2DataConfig = {
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
            field: 'a-2',
            name: '层级2',
          },
        ],
        fields: customRowGridSimpleFields,
      };

      s2 = new PivotSheet(getContainer(), customRowDataCfg, assembleOptions());

      await s2.render();
    });

    it('should export correct data in grid mode for custom row cell', async () => {
      s2.setOptions({ hierarchyType: 'grid' });

      await expectMatchSnapshot(s2);
    });

    it('should export correct data in tree mode for custom row cell', async () => {
      s2.setOptions({ hierarchyType: 'tree' });

      await expectMatchSnapshot(s2);
    });

    it('should export correct data in tree mode for custom row cell and custom corner text', async () => {
      s2.setOptions({ hierarchyType: 'tree', cornerText: '自定义' });

      await expectMatchSnapshot(s2);
    });
  });
});
