/**
 * @description spec for issue #2385
 * https://github.com/antvis/S2/issues/2385
 */
import { PivotSheet, SpreadSheet, TableSheet } from '@/sheet-type';
import { LayoutWidthType, customMerge, type S2Options } from '../../src';
import * as mockDataConfig from '../data/data-issue-2385.json';
import { getContainer } from '../util/helpers';

const s2Options: S2Options = {
  width: 800,
  height: 600,
  style: {
    dataCell: {
      width: 200,
    },
    layoutWidthType: LayoutWidthType.Compact,
  },
  showDefaultHeaderActionIcon: false,
};

describe('Compare Layout Tests', () => {
  const expectTextOverflowing = (s2: SpreadSheet) => {
    s2.facet.getCells().forEach((cell) => {
      expect(cell.getTextShape().isOverflowing()).toBeFalsy();
    });
  };

  const mapWidthList = (s2: SpreadSheet) => {
    const colLeafNodeWidthList = s2.facet
      .getColLeafNodes()
      .map((node) => Math.floor(node.width));
    const dataCellWidthList = s2.facet
      .getDataCells()
      .map((cell) => Math.floor(cell.getMeta().width));

    return {
      colLeafNodeWidthList,
      dataCellWidthList,
    };
  };

  test.each([
    { showDefaultHeaderActionIcon: true },
    { showDefaultHeaderActionIcon: false },
  ])(
    'should get max col width for pivot sheet and same font size by %o',
    async (options) => {
      const s2 = new PivotSheet(getContainer(), mockDataConfig, {
        ...s2Options,
        ...options,
      });

      await s2.render();

      const colLeafNodes = s2.facet.getColLeafNodes();

      expect(Math.floor(colLeafNodes[0].width)).toBeCloseTo(122);
      expect(Math.floor(colLeafNodes[1].width)).toEqual(
        options.showDefaultHeaderActionIcon ? 66 : 63,
      );
      expectTextOverflowing(s2);
    },
  );

  // 覆盖 (数值/中文) 等场景
  test.each([
    { showDefaultHeaderActionIcon: true, fontSize: 20 },
    { showDefaultHeaderActionIcon: true, fontSize: 12 },
    { showDefaultHeaderActionIcon: false, fontSize: 20 },
    { showDefaultHeaderActionIcon: false, fontSize: 12 },
  ])('should get max col width for pivot sheet by %o', async (options) => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, {
      ...s2Options,
      showDefaultHeaderActionIcon: options.showDefaultHeaderActionIcon,
    });

    s2.setTheme({
      dataCell: {
        text: {
          fontSize: options.fontSize,
        },
      },
    });
    await s2.render();

    const expectWidth = options.showDefaultHeaderActionIcon ? 66 : 63;
    const isLargeFontSize = options.fontSize === 20;
    const colLeafNodes = s2.facet.getColLeafNodes();

    expect(Math.floor(colLeafNodes[0].width)).toBeCloseTo(
      isLargeFontSize ? 191 : 122,
    );
    expect(Math.floor(colLeafNodes[1].width)).toEqual(
      isLargeFontSize ? 92 : expectWidth,
    );
    expectTextOverflowing(s2);
  });

  test.each([
    { showDefaultHeaderActionIcon: true },
    { showDefaultHeaderActionIcon: false },
  ])('should get max col width for table sheet by %o', async (options) => {
    const s2 = new TableSheet(getContainer(), mockDataConfig, {
      ...s2Options,
      ...options,
    });

    s2.setDataCfg({
      fields: {
        columns: ['price'],
      },
    });
    s2.setTheme({
      dataCell: {
        text: {
          fontSize: 20,
        },
      },
    });

    await s2.render();

    const colLeafNodes = s2.facet.getColLeafNodes();
    const { dataCellWidthList, colLeafNodeWidthList } = mapWidthList(s2);
    const expectWidth = 183;

    expect(Math.floor(colLeafNodes[0].width)).toBeCloseTo(expectWidth);
    expect(
      dataCellWidthList.every((width) => width === expectWidth),
    ).toBeTruthy();
    expect(colLeafNodeWidthList).toEqual([expectWidth]);
    expectTextOverflowing(s2);
  });

  test.each([
    { showDefaultHeaderActionIcon: true },
    { showDefaultHeaderActionIcon: false },
  ])(
    'should get max col width for pivot sheet by condition and %o',
    async (options) => {
      const s2 = new PivotSheet(getContainer(), mockDataConfig, {
        ...s2Options,
        ...options,
        conditions: {
          icon: [
            {
              field: 'price',
              position: 'left',
              mapping: () => {
                return {
                  icon: 'Plus',
                  fill: '#396',
                };
              },
            },
          ],
        },
      });

      s2.setTheme({
        dataCell: {
          text: {
            fontSize: 20,
          },
        },
      });
      await s2.render();

      const { dataCellWidthList, colLeafNodeWidthList } = mapWidthList(s2);

      expect(dataCellWidthList).toEqual([
        209, 209, 209, 209, 110, 110, 110, 110, 69, 69, 69, 69,
      ]);
      expect(colLeafNodeWidthList).toEqual([209, 110, 69]);
      expectTextOverflowing(s2);
    },
  );

  test.each([{ showIcon: true }, { showIcon: false }])(
    'should get max row width for pivot sheet and format name by %o',
    async (options) => {
      const s2 = new PivotSheet(
        getContainer(),
        {
          ...mockDataConfig,
          meta: [
            { field: 'province', name: '省份666' },
            { field: 'city', name: '城市1234567' },
          ],
        },
        {
          ...s2Options,
          headerActionIcons: options.showIcon
            ? [
                {
                  icons: ['SortDown'],
                  belongsCell: 'cornerCell',
                },
              ]
            : [],
        },
      );

      await s2.render();

      const rowNodes = s2.facet.getRowNodes();

      expect(Math.floor(rowNodes[0].width)).toBeCloseTo(
        options.showIcon ? 80 : 62,
      );
      expect(Math.floor(rowNodes[1].width)).toEqual(
        options.showIcon ? 106 : 88,
      );
      expectTextOverflowing(s2);
    },
  );

  test('should not render overflowing text for table sheet and a difference type text', async () => {
    const s2 = new TableSheet(getContainer(), mockDataConfig, s2Options);

    s2.setDataCfg({
      fields: {
        columns: [
          'date',
          'zh',
          'percentage',
          'number',
          'url-number',
          'url-en',
          'url-zh',
        ],
      },
      meta: [
        {
          field: 'date',
          formatter: () => '2021-09-08',
        },
        {
          field: 'zh',
          formatter: () => '中文文本测试中文文本',
        },
        {
          field: 'percentage',
          formatter: () => '100.23433333%',
        },
        {
          field: 'number',
          formatter: () => '111111111111',
        },
        {
          field: 'url-number',
          formatter: () => `https://wwww.test.cn?test=${'1'.repeat(10)}`,
        },
        {
          field: 'url-en',
          formatter: () => `https://wwww.test.cn?test=${'t'.repeat(10)}`,
        },
        {
          field: 'url-zh',
          formatter: () => `https://wwww.test.cn?test=${'测'.repeat(10)}`,
        },
      ],
    });

    await s2.render();

    expectTextOverflowing(s2);
  });

  test('should get max col width for pivot sheet conditions', async () => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, {
      ...s2Options,
      conditions: {
        icon: [
          {
            field: 'price',
            position: 'left',
            mapping(fieldValue: number) {
              if (!fieldValue) {
                return null;
              }

              return fieldValue > 0
                ? {
                    fill: 'red',
                    icon: 'CellUp',
                  }
                : {
                    fill: 'green',
                    icon: 'CellDown',
                  };
            },
          },
        ],
      },
    });

    s2.setDataCfg({
      meta: [
        {
          field: 'price',
          formatter: (value) => (value === '111' ? '35333.7%' : value),
        },
      ],
    });

    await s2.render();

    const { dataCellWidthList, colLeafNodeWidthList } = mapWidthList(s2);

    expect(dataCellWidthList).toEqual([
      140, 140, 140, 140, 81, 81, 81, 81, 92, 92, 92, 92,
    ]);
    expect(colLeafNodeWidthList).toEqual([140, 81, 92]);
    expectTextOverflowing(s2);
  });

  test.each([{ showIcon: true }, { showIcon: false }])(
    'should get max col leaf node width for pivot sheet conditions and header action icons by %o',
    async (options) => {
      const s2 = new PivotSheet(
        getContainer(),
        customMerge(mockDataConfig, { fields: { columns: [] } }),
        {
          ...s2Options,
          headerActionIcons: options.showIcon
            ? [
                {
                  icons: ['SortDown'],
                  belongsCell: 'colCell',
                },
              ]
            : [],
          conditions: {
            icon: [
              {
                field: 'price',
                position: 'left',
                mapping(fieldValue: number) {
                  if (!fieldValue) {
                    return null;
                  }

                  return fieldValue > 0
                    ? {
                        fill: 'red',
                        icon: 'CellUp',
                      }
                    : {
                        fill: 'green',
                        icon: 'CellDown',
                      };
                },
              },
            ],
          },
        },
      );

      s2.setDataCfg({
        meta: [
          {
            field: 'price',
            name: '环比差值',
            formatter: () => '2,248.92万',
          },
        ],
      });

      await s2.render();

      expectTextOverflowing(s2);
    },
  );

  test.each([
    { text: '中文文本测试中文文本测试', width: 145 },
    { text: '中文文本测试中文文本123', width: 142 },
    { text: '中文文本测试中文文本word', width: 150 },
    { text: '11111111111111111', width: 104 },
    { text: '参数：', width: 37 },
    { text: 'word', width: 30 },
    { text: 'word123', width: 50 },
    { text: 'word123...', width: 60 },
    { text: '100.234%', width: 56 },
    { text: '2024-12-24', width: 63 },
    { text: '纸张123456', width: 66 },
    { text: `https://wwww.test.cn?test=${'1'.repeat(10)}`, width: 217 },
  ])('should get correctly text width for %o', async ({ text, width }) => {
    const s2 = new PivotSheet(getContainer(), mockDataConfig, {
      ...s2Options,
    });

    await s2.render();

    const result = s2.facet.measureTextWidth(text, {
      fontFamily: 'Roboto, PingFangSC, Microsoft YaHei, Arial, sans-serif',
      fontSize: 12,
      fontWeight: 700,
      fill: '#000000',
      opacity: 1,
      textAlign: 'left',
      textBaseline: 'middle',
      linkTextFill: '#2C60D4',
    });

    expect(result).toEqual(width);
  });
});
