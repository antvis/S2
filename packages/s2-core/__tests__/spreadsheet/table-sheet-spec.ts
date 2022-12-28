import { getContainer, getMockData, sleep } from 'tests/util/helpers';
import {
  ColCell,
  DeviceType,
  ResizeType,
  TableSheet,
  type RawData,
  type S2DataConfig,
  type S2Options,
} from '@/index';

const data = getMockData(
  '../../../s2-react/__tests__/data/tableau-supermarket.csv',
) as RawData[];

const columns = [
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

const newLineText = `1\t\n2`;

const dataCfg: S2DataConfig = {
  fields: {
    columns,
  },
  meta,
  data: data.map((e) => ({ ...e, express_type: newLineText })),
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
  showSeriesNumber: true,
  placeholder: '',
  style: {
    layoutWidthType: 'compact',
    dataCell: {
      height: 32,
    },
    device: DeviceType.PC,
  },
  interaction: {
    enableCopy: true,
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
};

describe('TableSheet normal spec', () => {
  test('scrollWithAnimation with duration and callback', async () => {
    const s2 = new TableSheet(getContainer(), dataCfg, options);
    s2.render();

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
      hRowScrollX: 0,
    });
    expect(onScrollFinish).toHaveBeenCalled();

    s2.destroy();
  });

  test('should be able to resize frozen col when there is a vertical scroll width', async () => {
    const s2 = new TableSheet(getContainer(), dataCfg, options);
    s2.render();

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
    await sleep(30);

    const firstColCell = s2.getColumnNodes()[1].belongsCell as any;

    expect(firstColCell.shouldAddVerticalResizeArea()).toBe(true);
    expect(firstColCell.getVerticalResizeAreaOffset()).toEqual({ x: 81, y: 0 });

    s2.destroy();
  });

  test('should support custom layoutCoordinate calls', () => {
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
    s2.render();
    expect(s2.facet.layoutResult.colsHierarchy.width).toBe(850);

    s2.destroy();
  });

  test('should be able to resize last column', async () => {
    const s2 = new TableSheet(getContainer(), dataCfg, options);
    s2.render();

    await sleep(30);

    const { x, width, top } = s2.getCanvasElement().getBoundingClientRect();

    s2.getCanvasElement().dispatchEvent(
      new PointerEvent('pointerdown', {
        clientX: x + width - 0.4,
        clientY: top + 25,
        pointerType: 'mouse',
      }),
    );

    await sleep(300); // 等待绘制响应

    document.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: x + width + 100,
        clientY: top + 25,
        bubbles: true,
      }),
    );
    await sleep(300);

    document.dispatchEvent(
      new PointerEvent('pointerup', {
        clientX: x + width + 100,
        clientY: top + 25,
        bubbles: true,
      }),
    );

    await sleep(300);

    const columnNodes = s2.getColumnNodes();
    const lastColumnCell = columnNodes[columnNodes.length - 1]
      .belongsCell as ColCell;

    expect(lastColumnCell.getMeta().width).toBe(198);
  });
});
