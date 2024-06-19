/* eslint-disable jest/expect-expect */
import {
  DeviceType,
  LayoutWidthType,
  ResizeType,
  TableSheet,
  type RawData,
  type S2DataConfig,
  type S2Options,
} from '@/index';
import { getContainer, getMockData, sleep } from 'tests/util/helpers';
import { SpreadSheet, TableFacet, setLang } from '../../src';
import type { TableColHeader } from '../../src/facet/header/table-col';

const data = getMockData(
  '../../../s2-react/__tests__/data/tableau-supermarket.csv',
) as RawData[];

const columns: string[] = [
  'order_id',
  'order_date',
  'ship_date',
  'express_type',
  'customer_name',
  'customer_type',
  'city',
  'province',
  'counter',
  'area',
  'type',
  'sub_type',
  'product_name',
  'sale_amt',
  'count',
  'discount',
  'profit',
];

const meta: S2DataConfig['meta'] = [
  {
    field: 'count',
    name: '销售个数',
  },
  {
    field: 'profit',
    name: '利润',
    formatter: (v) => `${v}元`,
  },
];

const newLineText = `"### 问题摘要
- **会话地址**："`;

const dataCfg: S2DataConfig = {
  fields: {
    columns,
  },
  meta,
  data: data.map((e) => {
    return { ...e, express_type: newLineText };
  }),
  sortParams: [
    {
      sortFieldId: 'count',
      sortMethod: 'DESC',
    },
    {
      sortFieldId: 'profit',
      sortMethod: 'ASC',
    },
  ],
};

const options: S2Options = {
  width: 800,
  height: 600,
  seriesNumber: {
    enable: true,
  },
  placeholder: {
    cell: '',
  },
  style: {
    layoutWidthType: LayoutWidthType.Compact,
    dataCell: {
      height: 32,
    },
  },
  interaction: {
    copy: { enable: true },
    hoverHighlight: false,
    selectedCellHighlight: true,
    linkFields: ['order_id', 'customer_name'],
    hiddenColumnFields: ['order_date'],
    resize: {
      rowResizeType: ResizeType.CURRENT,
    },
  },
  frozen: {
    rowCount: 2,
    colCount: 2,
    trailingColCount: 2,
    trailingRowCount: 2,
  },
  showDefaultHeaderActionIcon: true,
  tooltip: {
    operation: {
      hiddenColumns: true,
    },
  },
  device: DeviceType.PC,
};

describe('TableSheet normal spec', () => {
  const expectEmptyPlaceholder = async (s2: SpreadSheet) => {
    s2.setDataCfg({
      data: [],
    });
    await s2.render();
    const [rect, icon, text] = (s2.facet as TableFacet).emptyPlaceholderGroup
      .children;

    expect(
      (s2.facet as TableFacet).emptyPlaceholderGroup.children,
    ).toHaveLength(3);
    expect(rect.parsedStyle).toMatchSnapshot();
    expect(icon.getCfg()).toMatchSnapshot();
    expect(text.parsedStyle).toMatchSnapshot();
  };

  test('scrollWithAnimation with duration and callback', async () => {
    const s2 = new TableSheet(getContainer(), dataCfg, options);

    await s2.render();

    const onScrollFinish = jest.fn();

    s2.facet.scrollWithAnimation(
      {
        offsetX: {
          value: 10,
          animate: true,
        },
        offsetY: {
          value: 10,
          animate: true,
        },
      },
      10,
      onScrollFinish,
    );
    await sleep(30);

    expect(s2.facet.getScrollOffset()).toStrictEqual({
      scrollY: 10,
      scrollX: 10,
      rowHeaderScrollX: 0,
    });
    expect(onScrollFinish).toHaveBeenCalled();

    s2.destroy();
  });

  test('should be able to resize frozen col when there is a vertical scroll width', async () => {
    const s2 = new TableSheet(getContainer(), dataCfg, options);

    await s2.render();

    const onScrollFinish = jest.fn();

    s2.facet.scrollWithAnimation(
      {
        offsetX: {
          value: 100,
          animate: true,
        },
      },
      10,
      onScrollFinish,
    );
    await sleep(500);

    const firstColCell = (s2.facet.columnHeader as TableColHeader).frozenGroup
      .children[1] as any;

    expect(firstColCell.shouldAddVerticalResizeArea()).toBeTruthy();
    expect(firstColCell.getVerticalResizeAreaOffset()).toEqual({ x: 81, y: 0 });

    s2.destroy();
  });

  test('should support custom layoutCoordinate calls', async () => {
    const s2 = new TableSheet(getContainer(), dataCfg, {
      ...options,
      frozen: {
        colCount: 0,
        trailingColCount: 0,
      },
    });

    s2.setOptions({
      layoutCoordinate: (_, __, colNode) => {
        if (colNode) {
          colNode.width = 50;
        }
      },
    });
    await s2.render();
    expect(s2.facet.getLayoutResult().colsHierarchy.width).toBe(850);

    s2.destroy();
  });

  test('should be able to resize last column', async () => {
    const s2 = new TableSheet(getContainer(), dataCfg, options);

    await s2.render();

    await sleep(1000);

    let columnNodes = s2.facet.getColNodes();

    const startCellWidth = columnNodes[columnNodes.length - 1].width;
    const { x, width, top } = s2.getCanvasElement().getBoundingClientRect();

    s2.getCanvasElement().dispatchEvent(
      new PointerEvent('pointerdown', {
        clientX: x + width,
        clientY: top,
        pointerType: 'mouse',
      }),
    );

    await sleep(300); // 等待绘制响应

    const resizeLength = 100;

    document.dispatchEvent(
      new PointerEvent('pointermove', {
        clientX: x + width + resizeLength,
        clientY: top,
        bubbles: true,
      }),
    );
    await sleep(300);

    document.dispatchEvent(
      new PointerEvent('pointerup', {
        clientX: x + width + resizeLength,
        clientY: top,
        bubbles: true,
      }),
    );

    await sleep(300);

    columnNodes = s2.facet.getColNodes();
    const endCellWidth = columnNodes[columnNodes.length - 1].width;

    expect(endCellWidth - startCellWidth).toBeGreaterThanOrEqual(resizeLength);
  });

  test('should render link shape', async () => {
    const s2 = new TableSheet(getContainer(), dataCfg, {
      ...options,
      frozen: {
        rowCount: 0,
        colCount: 0,
        trailingColCount: 0,
        trailingRowCount: 0,
      },
    });

    await s2.render();

    const orderIdDataCell = s2.facet
      .getDataCells()
      .find((cell) => cell.getMeta().valueField === 'order_id');

    expect(orderIdDataCell?.getLinkFieldShape()).toBeDefined();

    s2.destroy();
  });

  test('should generate col node by field id', async () => {
    const s2 = new TableSheet(getContainer(), dataCfg, options);

    await s2.render();

    expect(s2.facet.getColNodes().map((node) => node.id)).toEqual([
      'root[&]$$series_number$$',
      'root[&]order_id',
      'root[&]ship_date',
      'root[&]express_type',
      'root[&]customer_name',
      'root[&]customer_type',
      'root[&]city',
      'root[&]province',
      'root[&]counter',
      'root[&]area',
      'root[&]type',
      'root[&]sub_type',
      'root[&]product_name',
      'root[&]sale_amt',
      'root[&]count',
      'root[&]discount',
      'root[&]profit',
    ]);
  });

  describe('Empty Placeholder', () => {
    test('should render empty placeholder', async () => {
      const s2 = new TableSheet(
        getContainer(),
        { ...dataCfg, data: [] },
        { ...options, frozen: {} },
      );

      await expectEmptyPlaceholder(s2);
    });

    test('should render empty placeholder by custom icon and description', async () => {
      const s2 = new TableSheet(
        getContainer(),
        { ...dataCfg, data: [] },
        {
          ...options,
          frozen: {},
          placeholder: {
            empty: {
              icon: 'Trend',
              describe: '没有数据',
            },
          },
        },
      );

      await expectEmptyPlaceholder(s2);
    });

    test('should render empty placeholder by custom icon and description style', async () => {
      const s2 = new TableSheet(
        getContainer(),
        { ...dataCfg, data: [] },
        {
          ...options,
          frozen: {},
        },
      );

      s2.setTheme({
        empty: {
          icon: {
            fill: 'green',
            width: 100,
            height: 100,
            margin: {
              bottom: 80,
            },
          },
          description: {
            fontSize: 20,
            fill: 'red',
          },
        },
      });

      await expectEmptyPlaceholder(s2);
    });

    test('should render empty placeholder if contains horizontal scrollbar', async () => {
      const s2 = new TableSheet(
        getContainer(),
        { ...dataCfg, data: [] },
        { ...options, frozen: {} },
      );

      await expectEmptyPlaceholder(s2);
      expect(s2.facet.hScrollBar.position).toEqual({
        x: 4,
        y: 594,
      });
    });

    test('should render empty placeholder by custom col height', async () => {
      const s2 = new TableSheet(
        getContainer(),
        { ...dataCfg, data: [] },
        {
          options,
          frozen: {},
          style: {
            colCell: {
              height: 200,
            },
          },
        },
      );

      await expectEmptyPlaceholder(s2);
    });

    test('should render empty placeholder by custom col width', async () => {
      const s2 = new TableSheet(
        getContainer(),
        { ...dataCfg, data: [] },
        {
          options,
          frozen: {},
          style: {
            colCell: {
              width: 30,
            },
          },
        },
      );

      await expectEmptyPlaceholder(s2);
    });

    test('should render empty placeholder for en_US lang', async () => {
      setLang('en_US');

      const s2 = new TableSheet(
        getContainer(),
        { ...dataCfg, data: [] },
        { ...options, frozen: {} },
      );

      await expectEmptyPlaceholder(s2);
    });
  });
});
