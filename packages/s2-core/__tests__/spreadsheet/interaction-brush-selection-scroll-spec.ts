/* eslint-disable jest/expect-expect */
import {
  createPivotSheet,
  getContainer,
  getMockData,
  sleep,
} from 'tests/util/helpers';
import {
  BaseBrushSelection,
  DeviceType,
  InteractionName,
  type S2DataConfig,
  S2Event,
  type S2Options,
  TableSheet,
  SpreadSheet,
  type S2CellType,
  LayoutWidthType,
} from '@/index';

const data = getMockData(
  '../../../s2-react/__tests__/data/tableau-supermarket.csv',
);

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

const dataCfg: S2DataConfig = {
  fields: {
    columns,
  },
  data,
};

const options: S2Options = {
  width: 800,
  height: 600,
  hd: false,
  seriesNumber: {
    enable: true,
  },
  placeholder: '',
  style: {
    layoutWidthType: LayoutWidthType.Compact,
    dataCell: {
      height: 32,
    },
  },
  pagination: {
    current: 1,
    pageSize: 100,
  },
  interaction: {
    copy: {
      enable: true,
    },
    hoverHighlight: false,
    resize: true,
  },
  showDefaultHeaderActionIcon: true,
  tooltip: {
    operation: {
      hiddenColumns: true,
    },
  },
  device: DeviceType.PC,
};

const emitBrushEvent = async (
  s2: SpreadSheet,
  clientX: number,
  clientY: number,
) => {
  const { top: offsetY } = s2.getCanvasElement().getBoundingClientRect();

  const insideCanvasClientY = clientY + offsetY;
  const outsideCanvasClientY = insideCanvasClientY + 9999;

  // 在 Canvas 内刷选
  s2.emit(S2Event.GLOBAL_MOUSE_MOVE, {
    clientX,
    clientY: insideCanvasClientY,
    preventDefault() {},
  } as any);
  await sleep(40);

  // 在 Canvas 外继续刷选
  s2.emit(S2Event.GLOBAL_MOUSE_MOVE, {
    clientX,
    clientY: outsideCanvasClientY,
    preventDefault() {},
  } as any);
  await sleep(100);

  s2.emit(S2Event.GLOBAL_MOUSE_UP, {
    clientX,
    clientY: outsideCanvasClientY,
    preventDefault() {},
  } as any);
  await sleep(200);
};

const expectScrollBrush = async (
  s2: SpreadSheet,
  targetCell: S2CellType,
  mouseDownEventType: S2Event = S2Event.DATA_CELL_MOUSE_DOWN,
) => {
  const selectedFn = jest.fn();
  const dataCellBrushSelectionFn = jest.fn();

  s2.on(S2Event.GLOBAL_SELECTED, selectedFn);
  s2.on(S2Event.DATA_CELL_BRUSH_SELECTION, dataCellBrushSelectionFn);

  // g5.0 异步渲染，第一时刻底层 base-brush 可能无法通过 elementsFromPointSync 取到元素
  await sleep(50);

  s2.emit(mouseDownEventType, {
    target: targetCell,
    x: 1,
    y: 1,
    preventDefault() {},
  } as any);

  await emitBrushEvent(s2, 400, 200);

  const brushInteraction = s2.interaction.interactions.get(
    InteractionName.DATA_CELL_BRUSH_SELECTION,
  ) as BaseBrushSelection;

  const brushRange = brushInteraction.getBrushRange();
  const allCells = s2.interaction.getCells();
  const lastCell = allCells[allCells.length - 1];

  await sleep(500);

  expect(s2.facet.getScrollOffset().scrollY).toBeGreaterThan(0);
  expect(brushRange.start.colIndex).toBe(allCells[0].colIndex);
  expect(brushRange.start.rowIndex).toBe(allCells[0].rowIndex);
  expect(brushRange.end.colIndex).toBe(lastCell.colIndex);
  expect(brushRange.end.rowIndex).toBe(lastCell.rowIndex);
  expect(selectedFn).toHaveBeenCalledTimes(1);
  expect(dataCellBrushSelectionFn).toHaveBeenCalledTimes(1);
};

describe('TableSheet Brush Selection Scroll Tests', () => {
  test('should scroll when mouse outside table data cell', async () => {
    const s2 = new TableSheet(getContainer(), dataCfg, options);

    await s2.render();

    const targetCell = s2.facet.getDataCells()[0];

    await expectScrollBrush(s2, targetCell);

    s2.setOptions({
      frozen: {
        colCount: 2,
        rowCount: 2,
        trailingColCount: 2,
        trailingRowCount: 2,
      },
    });
    await s2.render();
    s2.interaction.reset();

    await expectScrollBrush(s2, targetCell);

    s2.destroy();
  });
});

describe('PivotSheet Brush Selection Scroll Tests', () => {
  test('should scroll when mouse outside data cell', async () => {
    const s2 = createPivotSheet(
      {
        width: 400,
        height: 400,
        style: {
          dataCell: {
            width: 100,
            height: 100,
          },
        },
      },
      { useSimpleData: false },
    );

    await s2.render();

    const dataCell = s2.facet.getDataCells()[0];

    await expectScrollBrush(s2, dataCell);

    s2.destroy();
  });

  test('should vertical scroll when mouse outside row cell', async () => {
    const s2 = createPivotSheet(
      {
        width: 400,
        height: 400,
        style: {
          dataCell: {
            width: 100,
            height: 100,
          },
        },
        interaction: {
          brushSelection: {
            rowCell: true,
            dataCell: false,
          },
        },
      },
      { useSimpleData: false },
    );

    await s2.render();
    await sleep(500); // wait for anthor loop;

    const rowCell = s2.facet.getRowCells()[0];

    s2.emit(S2Event.ROW_CELL_MOUSE_DOWN, {
      target: rowCell,
      x: 1,
      y: 1,
      preventDefault() {},
    } as any);

    await emitBrushEvent(s2, 200, 200);
    await sleep(1000);

    expect(s2.facet.getScrollOffset().scrollY).toBeGreaterThan(0);
    expect(s2.interaction.getCells()).not.toBeEmpty();

    s2.destroy();
  });

  // https://github.com/antvis/S2/pull/2101
  test('should vertical scroll and only brush current column cells when mouse outside row cell', async () => {
    const s2 = createPivotSheet(
      {
        width: 400,
        height: 400,
        style: {
          dataCell: {
            width: 100,
            height: 100,
          },
        },
        interaction: {
          brushSelection: {
            rowCell: true,
          },
        },
      },
      { useSimpleData: false },
    );

    await s2.render();
    await sleep(20); // wait for anthor loop;

    const rowCell = s2.facet.getRowCells()[0];

    s2.emit(S2Event.ROW_CELL_MOUSE_DOWN, {
      target: rowCell,
      x: 1,
      y: 1,
      preventDefault() {},
    } as any);

    // 只刷选 [省份]
    await emitBrushEvent(s2, 100, 200);
    await sleep(500);

    // 只选中 [浙江省, 四川省]
    expect(s2.facet.getScrollOffset().scrollY).toBeGreaterThan(0);
    expect(s2.interaction.getCells()).toMatchInlineSnapshot(`
      Array [
        Object {
          "colIndex": -1,
          "id": "root[&]浙江省",
          "rowIndex": undefined,
          "rowQuery": undefined,
          "type": "rowCell",
        },
        Object {
          "colIndex": -1,
          "id": "root[&]四川省",
          "rowIndex": undefined,
          "rowQuery": undefined,
          "type": "rowCell",
        },
      ]
    `);

    s2.destroy();
  });

  // https://github.com/antvis/S2/issues/2106
  test('should prepare brush selection mask does not exceed the data cell when auto scroll', async () => {
    const s2 = createPivotSheet(
      {
        width: 400,
        height: 400,
        style: {
          dataCell: {
            width: 100,
            height: 100,
          },
        },
      },
      { useSimpleData: false },
    );

    await s2.render();

    const dataCell = s2.facet.getDataCells()[0];

    await expectScrollBrush(s2, dataCell);

    const brushSelection = s2.interaction.interactions.get(
      InteractionName.DATA_CELL_BRUSH_SELECTION,
    ) as BaseBrushSelection;

    expect(brushSelection.prepareSelectMaskShape.attr('x')).toEqual(
      s2.facet.panelBBox.minX,
    );
    expect(brushSelection.prepareSelectMaskShape.attr('y')).toEqual(
      s2.facet.panelBBox.minY,
    );

    s2.destroy();
  });
});
