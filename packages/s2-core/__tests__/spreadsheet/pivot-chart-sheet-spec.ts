import { get, head, map, omit } from 'lodash';
import { getContainer, sleep } from 'tests/util/helpers';
import { asyncGetAllPlainData } from '../../src';
import {
  EXTRA_FIELD,
  LayoutWidthType,
  OriginEventType,
  TAB_SEPARATOR,
} from '../../src/common';
import { Aggregation, type S2Options } from '../../src/common/interface';
import { PivotChartSheet } from '../../src/extends';
import {
  KEY_GROUP_COL_AXIS_RESIZE_AREA,
  KEY_GROUP_ROW_AXIS_RESIZE_AREA,
  PLACEHOLDER_FIELD,
} from '../../src/extends/pivot-chart/constant';
import type { PivotChartFacet } from '../../src/extends/pivot-chart/facet/pivot-chart-facet';
import type { FrozenFacet } from '../../src/facet';
import dataCfg from '../data/mock-dataset.json';
import { pickMap } from '../util/fp';

describe('Pivot Chart Tests', () => {
  let container: HTMLElement;
  let s2: PivotChartSheet;

  const s2Options: S2Options = {
    width: 800,
    height: 700,
    seriesNumber: {
      enable: true,
    },
  };

  beforeEach(() => {
    container = getContainer();
  });
  afterEach(() => {
    s2?.destroy();
  });

  describe('cartesian coordinate', () => {
    test('should render pivot chart with 1 level row', async () => {
      s2 = new PivotChartSheet(
        container,
        {
          ...dataCfg,
          fields: {
            rows: ['province'],
            columns: ['type', 'sub_type'],
            values: ['number'],
            valueInCols: true,
          },
        },
        s2Options,
      );

      await s2.render();

      const {
        rowsHierarchy,
        axisRowsHierarchy,
        colsHierarchy,
        axisColsHierarchy,
      } = s2.facet.getLayoutResult();

      // 只有一个维度时，会被拆分到 axisRow 中
      expect(rowsHierarchy.width).toEqual(0);
      expect(axisRowsHierarchy!.width).toEqual(100);
      expect(colsHierarchy.height).toEqual(60);
      expect(axisColsHierarchy!.height).toEqual(50);
    });

    test('should render pivot chart with 2 level rows', async () => {
      s2 = new PivotChartSheet(
        container,
        {
          ...dataCfg,
          fields: {
            rows: ['province', 'city'],
            columns: ['type', 'sub_type'],
            values: ['number'],
            valueInCols: false,
          },
        },
        s2Options,
      );

      await s2.render();
      const {
        rowsHierarchy,
        axisRowsHierarchy,
        colsHierarchy,
        axisColsHierarchy,
      } = s2.facet.getLayoutResult();

      // 多个维度时，最后一个维度会被拆分到 axisRow 中
      expect(rowsHierarchy.width).toEqual(206);
      // 默认情况，axis row cell 宽度固定为 100
      expect(axisRowsHierarchy!.width).toEqual(100);

      expect(colsHierarchy.height).toEqual(30);
      // 默认情况下， axis col cell 高度固定为 50
      expect(axisColsHierarchy!.height).toEqual(50);
    });

    test('should render pivot chart with 3 level rows', async () => {
      s2 = new PivotChartSheet(
        container,
        {
          ...dataCfg,
          fields: {
            rows: ['province', 'city', 'type'],
            columns: ['sub_type'],
            values: ['number'],
            valueInCols: false,
          },
        },
        s2Options,
      );

      await s2.render();
      const { rowsHierarchy, axisRowsHierarchy, colLeafNodes } =
        s2.facet.getLayoutResult();

      // 多个维度时，最后一个维度会被拆分到 axisRow 中
      expect(rowsHierarchy.width).toEqual(264);
      // 默认情况，axis row cell 宽度固定为 100
      expect(axisRowsHierarchy!.width).toEqual(100);

      // 列头只有一个维度，且数值置于行头时，列头会生成 placeholder 占位
      const leaf = head(colLeafNodes)!;

      expect(colLeafNodes).toHaveLength(1);
      expect(leaf.field).toEqual(PLACEHOLDER_FIELD);
      expect(leaf.value).toEqual('子类别');
      expect(leaf.width).toEqual(352);
      expect(leaf.height).toEqual(30);
    });

    test('should render pivot chart with row totals', async () => {
      s2 = new PivotChartSheet(
        container,
        {
          ...dataCfg,
          data: dataCfg.data.concat(dataCfg.totalData as any),
          fields: {
            rows: ['province', 'city', 'type', 'sub_type'],
            columns: [],
            values: ['number'],
            valueInCols: true,
          },
        },
        {
          ...s2Options,
          totals: {
            row: {
              showGrandTotals: true,
              showSubTotals: true,
              reverseGrandTotalsLayout: true,
              reverseSubTotalsLayout: true,
              subTotalsDimensions: ['province', 'city'],
              grandTotalsGroupDimensions: ['city'],
              subTotalsGroupDimensions: ['type'],
              calcGrandTotals: {
                aggregation: Aggregation.SUM,
              },
              calcSubTotals: {
                aggregation: Aggregation.SUM,
              },
            },
          },
        },
      );

      await s2.render();

      const { rowNodes } = s2.facet.getLayoutResult();
      // 总计格子的横跨省份、城市、类别
      const grandTotalRoot = rowNodes.find((node) => node.id === 'root[&]总计');

      expect(grandTotalRoot?.width).toEqual(600);

      // 省份的小计格子横跨城市和类别
      const subTotalRoot = rowNodes.find(
        (node) => node.id === 'root[&]浙江省[&]小计',
      );

      expect(subTotalRoot?.width).toEqual(400);
    });

    test('should render pivot chart with cols totals', async () => {
      s2 = new PivotChartSheet(
        container,
        {
          ...dataCfg,
          data: dataCfg.data.concat(dataCfg.totalData as any),
          fields: {
            rows: [],
            columns: ['province', 'city', 'type', 'sub_type'],
            values: ['number'],
            valueInCols: false,
          },
        },
        {
          ...s2Options,
          totals: {
            col: {
              showGrandTotals: true,
              showSubTotals: true,
              reverseGrandTotalsLayout: true,
              reverseSubTotalsLayout: true,
              subTotalsDimensions: ['province', 'city'],
              grandTotalsGroupDimensions: ['city'],
              subTotalsGroupDimensions: ['type'],
              calcGrandTotals: {
                aggregation: Aggregation.SUM,
              },
              calcSubTotals: {
                aggregation: Aggregation.SUM,
              },
            },
          },
        },
      );

      await s2.render();

      const { colNodes } = s2.facet.getLayoutResult();
      // 总计格子的横跨列头区域
      const grandTotalRoot = colNodes.find((node) => node.id === 'root[&]总计');

      expect(grandTotalRoot?.height).toEqual(90);

      // 省份的小计格子横跨城市和类别
      const subTotalRoot = colNodes.find(
        (node) => node.id === 'root[&]浙江省[&]小计',
      );

      expect(subTotalRoot?.height).toEqual(60);
    });
  });

  describe('polar coordinate', () => {
    const polarOptions: S2Options = {
      ...s2Options,
      chart: {
        coordinate: 'polar',
        dataCellSpec: {
          type: 'interval',
          transform: [{ type: 'stackY' }],
          coordinate: { type: 'theta', outerRadius: 0.8 },
        },
      },
    };

    test('should render pivot chart with 1 level row', async () => {
      s2 = new PivotChartSheet(
        container,
        {
          ...dataCfg,
          fields: {
            rows: ['province'],
            columns: ['type', 'sub_type'],
            values: ['number'],
            valueInCols: true,
          },
        },
        polarOptions,
      );

      await s2.render();

      const { rowLeafNodes } = s2.facet.getLayoutResult();

      // 只有一个维度时，因为是极坐标，所有会增加 placeholder 占位

      const leaf = head(rowLeafNodes)!;

      expect(rowLeafNodes).toHaveLength(1);
      expect(leaf.field).toEqual('province');
      expect(leaf.value).toEqual('省份');
      expect(leaf.width).toEqual(100);
      expect(leaf.height).toEqual(200);
    });

    test('should render pivot chart with 2 level rows', async () => {
      s2 = new PivotChartSheet(
        container,
        {
          ...dataCfg,
          fields: {
            rows: ['province', 'city'],
            columns: ['type', 'sub_type'],
            values: ['number'],
            valueInCols: false,
          },
        },
        {
          ...polarOptions,
          style: {
            layoutWidthType: 'compact',
          },
        },
      );

      await s2.render();
      const { axisRowsHierarchy, colsHierarchy, axisColsHierarchy } =
        s2.facet.getLayoutResult();

      // 默认情况，axis row cell 宽度固定为 100
      expect(axisRowsHierarchy!.width).toEqual(100);

      // 极坐标情况下，不展示坐标轴，而是按照原文字形式展示
      const axisRowCell = head((s2.facet as PivotChartFacet).getAxisRowCells());

      expect(axisRowCell?.getActualText()).toEqual('数量');

      expect(colsHierarchy.height).toEqual(30);
      // 极坐标不展示单独坐标轴
      expect(axisColsHierarchy!.height).toEqual(0);
    });

    test('should render pivot chart with 3 level rows', async () => {
      s2 = new PivotChartSheet(
        container,
        {
          ...dataCfg,
          fields: {
            rows: ['province', 'city', 'type'],
            columns: ['sub_type'],
            values: ['number'],
            valueInCols: false,
          },
        },
        polarOptions,
      );

      await s2.render();
      const { colLeafNodes } = s2.facet.getLayoutResult();

      // 列头只有一个维度，且数值置于行头时，列头会生成 placeholder 占位
      const leaf = head(colLeafNodes)!;

      expect(colLeafNodes).toHaveLength(1);
      expect(leaf.field).toEqual(PLACEHOLDER_FIELD);
      expect(leaf.value).toEqual('子类别');
      expect(leaf.width).toEqual(200);
      expect(leaf.height).toEqual(30);
    });

    test('should render pivot chart with row totals', async () => {
      s2 = new PivotChartSheet(
        container,
        {
          ...dataCfg,
          data: dataCfg.data.concat(dataCfg.totalData as any),
          fields: {
            rows: ['province', 'city', 'type', 'sub_type'],
            columns: [],
            values: ['number'],
            valueInCols: true,
          },
        },
        {
          ...polarOptions,
          totals: {
            row: {
              showGrandTotals: true,
              showSubTotals: true,
              reverseGrandTotalsLayout: true,
              reverseSubTotalsLayout: true,
              subTotalsDimensions: ['province', 'city'],
              grandTotalsGroupDimensions: ['city'],
              subTotalsGroupDimensions: ['type'],
              calcGrandTotals: {
                aggregation: Aggregation.SUM,
              },
              calcSubTotals: {
                aggregation: Aggregation.SUM,
              },
            },
          },
        },
      );

      await s2.render();

      const { rowNodes } = s2.facet.getLayoutResult();
      // 总计格子的横跨省份和城市
      const grandTotalRoot = rowNodes.find((node) => node.id === 'root[&]总计');

      expect(grandTotalRoot?.width).toEqual(600);

      // 省份的小计格子横跨城市和类别
      const subTotalRoot = rowNodes.find(
        (node) => node.id === 'root[&]浙江省[&]小计',
      );

      expect(subTotalRoot?.width).toEqual(400);
    });

    test('should render pivot chart with cols totals', async () => {
      s2 = new PivotChartSheet(
        container,
        {
          ...dataCfg,
          data: dataCfg.data.concat(dataCfg.totalData as any),
          fields: {
            rows: [],
            columns: ['province', 'city', 'type', 'sub_type'],
            values: ['number'],
            valueInCols: false,
          },
        },
        {
          ...polarOptions,
          totals: {
            col: {
              showGrandTotals: true,
              showSubTotals: true,
              reverseGrandTotalsLayout: true,
              reverseSubTotalsLayout: true,
              subTotalsDimensions: ['province', 'city'],
              grandTotalsGroupDimensions: ['city'],
              subTotalsGroupDimensions: ['type'],
              calcGrandTotals: {
                aggregation: Aggregation.SUM,
              },
              calcSubTotals: {
                aggregation: Aggregation.SUM,
              },
            },
          },
        },
      );

      await s2.render();

      const { colNodes } = s2.facet.getLayoutResult();
      // 总计格子的横跨列头区域
      const grandTotalRoot = colNodes.find((node) => node.id === 'root[&]总计');

      expect(grandTotalRoot?.height).toEqual(90);

      // 省份的小计格子横跨城市和类别
      const subTotalRoot = colNodes.find(
        (node) => node.id === 'root[&]浙江省[&]小计',
      );

      expect(subTotalRoot?.height).toEqual(60);
    });
  });

  describe('layoutWithType', () => {
    test('should render pivot chart with adaptive layout', async () => {
      s2 = new PivotChartSheet(container, dataCfg, {
        ...s2Options,
        style: {
          layoutWidthType: LayoutWidthType.Adaptive,
        },
      });

      await s2.render();

      const {
        rowsHierarchy,
        axisRowsHierarchy,
        colLeafNodes,
        axisColsHierarchy,
      } = s2.facet.getLayoutResult();

      const rowSampleNodeWidths = rowsHierarchy.sampleNodesForAllLevels.map(
        (node) => node.width,
      );

      const colLeafNodeWidths = colLeafNodes.map((node) => node.width);

      // 只有一个维度时，会被拆分到 axisRow 中
      expect(rowSampleNodeWidths).toEqual([200]);
      expect(colLeafNodeWidths).toEqual([200, 200, 200, 200]);
      expect(axisRowsHierarchy!.width).toEqual(100);
      expect(axisColsHierarchy!.height).toEqual(50);
    });
    test('should render pivot chart with colAdaptive layout', async () => {
      s2 = new PivotChartSheet(container, dataCfg, {
        ...s2Options,
        style: {
          layoutWidthType: LayoutWidthType.ColAdaptive,
        },
      });

      await s2.render();

      const {
        rowsHierarchy,
        axisRowsHierarchy,
        colLeafNodes,
        axisColsHierarchy,
      } = s2.facet.getLayoutResult();

      const rowSampleNodeWidths = rowsHierarchy.sampleNodesForAllLevels.map(
        (node) => node.width,
      );

      const colLeafNodeWidths = colLeafNodes.map((node) => node.width);

      // 只有一个维度时，会被拆分到 axisRow 中
      expect(rowSampleNodeWidths).toEqual([54]);
      expect(colLeafNodeWidths).toEqual([200, 200, 200, 200]);
      expect(axisRowsHierarchy!.width).toEqual(100);
      expect(axisColsHierarchy!.height).toEqual(50);
    });

    test('should render pivot chart with compact layout', async () => {
      s2 = new PivotChartSheet(container, dataCfg, {
        ...s2Options,
        style: {
          layoutWidthType: LayoutWidthType.Compact,
        },
      });

      await s2.render();

      const {
        rowsHierarchy,
        axisRowsHierarchy,
        colLeafNodes,
        axisColsHierarchy,
      } = s2.facet.getLayoutResult();

      const rowSampleNodeWidths = rowsHierarchy.sampleNodesForAllLevels.map(
        (node) => node.width,
      );

      const colLeafNodeWidths = colLeafNodes.map((node) => node.width);

      // 只有一个维度时，会被拆分到 axisRow 中
      expect(rowSampleNodeWidths).toEqual([54]);
      expect(colLeafNodeWidths).toEqual([200, 200, 200, 200]);
      expect(axisRowsHierarchy!.width).toEqual(100);
      expect(axisColsHierarchy!.height).toEqual(50);
    });
  });

  describe('formatter', () => {
    test('should render pivot chart with formatter', async () => {
      s2 = new PivotChartSheet(
        container,
        {
          ...dataCfg,
          meta: [
            {
              field: 'city',
              name: '城市',
              formatter: (v) => `[[${v}]]`,
            },
            {
              field: 'number',
              name: '数量',
              description: '数量说明。。',
              formatter: (v: number) => v.toFixed(2),
            },
          ],
        },
        {
          ...s2Options,
          totals: {
            row: {
              showGrandTotals: true,
              showSubTotals: true,
              reverseGrandTotalsLayout: true,
              reverseSubTotalsLayout: true,
              subTotalsDimensions: ['province'],
              calcGrandTotals: {
                aggregation: Aggregation.SUM,
              },
              calcSubTotals: {
                aggregation: Aggregation.SUM,
              },
            },
          },
        },
      );

      await s2.render();

      await sleep(3000);

      // row axis formatter
      const rowCell = (s2.facet as PivotChartFacet).getAxisRowCells()[1];
      const rowAxisOptions = rowCell?.getChartOptions();
      const domain = get(rowAxisOptions, 'scale.x.domain');

      expect(domain).toEqual([
        '小计',
        '[[杭州市]]',
        '[[绍兴市]]',
        '[[宁波市]]',
        '[[舟山市]]',
      ]);

      // col axis formatter
      const colCell = (s2.facet as PivotChartFacet).getAxisColCells()[0];
      const colAxisOptions = colCell?.getChartOptions();
      const formatter = get(colAxisOptions, 'labelFormatter');

      expect(formatter(4000)).toEqual('4000.00');

      // tooltip formatter
      await sleep(3000);

      const canvas = s2.getCanvasElement();
      const bbox = canvas.getBoundingClientRect();

      let mousemoveEvent = new MouseEvent(OriginEventType.POINTER_MOVE, {
        clientX: bbox.left + 460,
        clientY: bbox.top + 150,
      });

      canvas.dispatchEvent(mousemoveEvent);

      expect(
        document.querySelector<HTMLDivElement>('.g2-tooltip-title')!.innerText,
      ).toEqual('小计');

      expect(
        document.querySelector<HTMLDivElement>('.g2-tooltip-list')!.innerText,
      ).toEqual('数量\n18375.00');

      await sleep(3000);

      mousemoveEvent = new MouseEvent(OriginEventType.POINTER_MOVE, {
        clientX: bbox.left + 460,
        clientY: bbox.top + 200,
      });

      canvas.dispatchEvent(mousemoveEvent);

      expect(
        document.querySelector<HTMLDivElement>('.g2-tooltip-title')!.innerText,
      ).toEqual('[[杭州市]]');

      expect(
        document.querySelector<HTMLDivElement>('.g2-tooltip-list')!.innerText,
      ).toEqual('数量\n7789.00');
    });
  });

  describe('frozen', () => {
    function expectFrozenGroup(s2: PivotChartSheet, headerName: string) {
      const pickCoordinate = pickMap(['id', 'x', 'y', 'width', 'height']);

      const actualHead = pickCoordinate(
        map(s2.facet[headerName]?.frozenGroup.children, 'meta'),
      );

      expect(actualHead).toMatchSnapshot();

      const actualTrailing = pickCoordinate(
        map(s2.facet[headerName]?.frozenTrailingGroup.children, 'meta'),
      );

      expect(actualTrailing).toMatchSnapshot();
    }

    function getFrozenGroupPosition(s2: PivotChartSheet, headerName: string) {
      return [
        s2.facet[headerName]?.frozenGroup.getPosition().map(Math.floor),
        s2.facet[headerName]?.frozenTrailingGroup.getPosition().map(Math.floor),
      ];
    }
    const options = {
      ...s2Options,
      width: 1000,
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          reverseGrandTotalsLayout: true,
          reverseSubTotalsLayout: true,
          subTotalsDimensions: ['province'],
          calcGrandTotals: {
            aggregation: Aggregation.SUM,
          },
          calcSubTotals: {
            aggregation: Aggregation.SUM,
          },
        },
      },
    };

    test('should render pivot chart with frozen', async () => {
      s2 = new PivotChartSheet(container, dataCfg, {
        ...options,
        frozen: {
          rowCount: 1,
          trailingRowCount: 1,
          colCount: 1,
          trailingColCount: 1,
        },
      });

      await s2.render();

      expect((s2.facet as FrozenFacet).frozenGroupAreas).toMatchObject({
        frozenCol: {
          width: 200,
          x: 0,
          range: [0, 0],
        },
        frozenTrailingCol: {
          width: 200,
          x: 600,
          range: [3, 3],
        },
        frozenRow: {
          height: 50,
          y: 0,
          range: [0, 0],
        },
        frozenTrailingRow: {
          height: 250,
          y: 300,
          range: [2, 2],
        },
      });

      expectFrozenGroup(s2, 'rowHeader');
      expectFrozenGroup(s2, 'axisRowHeader');
      expectFrozenGroup(s2, 'colHeader');
      expectFrozenGroup(s2, 'axisColumnHeader');
    });

    test('should render pivot chart with frozen but row header', async () => {
      s2 = new PivotChartSheet(container, dataCfg, {
        ...options,
        style: {
          colCell: {
            widthByField: { [EXTRA_FIELD]: 300 },
          },
        },
        frozen: {
          rowHeader: false,
          colCount: 1,
          trailingColCount: 1,
        },
      });

      await s2.render();

      expect((s2.facet as FrozenFacet).frozenGroupAreas).toMatchObject({
        frozenCol: {
          width: 300,
          x: 0,
          range: [0, 0],
        },
        frozenTrailingCol: {
          width: 300,
          x: 900,
          range: [3, 3],
        },
        frozenRow: {
          height: 0,
          y: 0,
          range: [],
        },
        frozenTrailingRow: {
          height: 0,
          y: 0,
          range: [],
        },
      });

      expectFrozenGroup(s2, 'columnHeader');
      expectFrozenGroup(s2, 'axisColumnHeader');
      let prevCol = getFrozenGroupPosition(s2, 'columnHeader');
      let prevAxisCol = getFrozenGroupPosition(s2, 'axisColumnHeader');

      s2.interaction.scrollTo({ offsetX: { value: 100, animate: false } });
      // 移动后，frozen col 会改变 而 trailing col 的位置不变
      let currentCol = getFrozenGroupPosition(s2, 'columnHeader');
      let currentAxisCol = getFrozenGroupPosition(s2, 'axisColumnHeader');

      expect(currentCol[0]?.[0]).toEqual(prevCol[0]?.[0]! - 100);
      expect(currentCol[1]).toEqual(prevCol[1]);

      expect(currentAxisCol[0]?.[0]).toEqual(prevAxisCol[0]?.[0]! - 100);
      expect(currentAxisCol[1]).toEqual(prevAxisCol[1]);

      // 移动超过角头宽度
      // 移动后，frozen col 和 trailing col 的位置都不变
      s2.interaction.scrollTo({ offsetX: { value: 400, animate: false } });
      prevCol = getFrozenGroupPosition(s2, 'columnHeader');
      prevAxisCol = getFrozenGroupPosition(s2, 'axisColumnHeader');

      s2.interaction.scrollTo({ offsetX: { value: 400, animate: false } });

      currentCol = getFrozenGroupPosition(s2, 'columnHeader');
      currentAxisCol = getFrozenGroupPosition(s2, 'axisColumnHeader');

      expect(currentCol).toEqual(prevCol);
      expect(currentCol).toEqual([
        [2, 0, 0],
        [-200, 0, 0],
      ]);

      expect(currentAxisCol).toEqual(prevAxisCol);
      expect(currentAxisCol).toEqual([
        [2, 612, 0],
        [-200, 612, 0],
      ]);
    });
  });

  describe('interaction', () => {
    test('should render axis resize area', async () => {
      s2 = new PivotChartSheet(container, dataCfg, s2Options);
      await s2.render();

      const group = s2.facet.foregroundGroup;

      expect(
        group.getElementById(KEY_GROUP_ROW_AXIS_RESIZE_AREA),
      ).not.toBeNull();
      expect(
        group.getElementById(KEY_GROUP_COL_AXIS_RESIZE_AREA),
      ).not.toBeNull();
    });

    test('should render axis resize area with polar coordinate', async () => {
      s2 = new PivotChartSheet(container, dataCfg, {
        ...s2Options,
        chart: {
          coordinate: 'polar',
        },
      });
      await s2.render();

      const group = s2.facet.foregroundGroup;

      expect(group.getElementById(KEY_GROUP_ROW_AXIS_RESIZE_AREA)).toBeNull();
      expect(
        group.getElementById(KEY_GROUP_COL_AXIS_RESIZE_AREA),
      ).not.toBeNull();
    });

    test('should throw error when call asyncGetAllPlainData', async () => {
      s2 = new PivotChartSheet(container, dataCfg, s2Options);
      await s2.render();

      expect.assertions(1);

      try {
        await asyncGetAllPlainData({
          sheetInstance: s2,
          split: TAB_SEPARATOR,
          formatOptions: true,
        });
      } catch (e) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(e.message).toEqual(
          "pivot chart doesn't support export all data",
        );
      }
    });
  });

  describe('style', () => {
    test('should match theme color', async () => {
      s2 = new PivotChartSheet(container, dataCfg, s2Options);
      s2.setThemeCfg({ name: 'dark' });
      await s2.render();
      expect(s2.theme.axisCornerCell).toEqual(s2.theme.cornerCell);
      expect(s2.theme.axisRowCell).toEqual(s2.theme.rowCell);
      expect(omit(s2.theme.axisColCell, ['measureText'])).toEqual(
        omit(s2.theme.colCell, ['measureText']),
      );
      expect(omit(s2.theme.axisColCell.measureText, ['textAlign'])).toEqual(
        omit(s2.theme.colCell.measureText, ['textAlign']),
      );
      expect(s2.theme.axisColCell.measureText.textAlign).toEqual('center');
    });
  });
});
