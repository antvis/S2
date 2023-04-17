/* eslint-disable jest/expect-expect */
import {
  createPivotSheet,
  getContainer,
  getMockData,
  sleep,
} from 'tests/util/helpers';
import {
  TableSheet,
  type S2Options,
  type S2DataConfig,
  S2Event,
  InteractionName,
  BaseBrushSelection,
  SpreadSheet,
  type S2CellType,
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
  hdAdapter: false,
  showSeriesNumber: true,
  placeholder: '',
  style: {
    layoutWidthType: 'compact',
    cellCfg: {
      height: 32,
    },
    device: 'pc',
  },
  pagination: {
    current: 1,
    pageSize: 100,
  },
  interaction: {
    enableCopy: true,
    hoverHighlight: false,
    resize: true,
  },
  showDefaultHeaderActionIcon: true,
  tooltip: {
    operation: {
      hiddenColumns: true,
    },
  },
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

  s2.emit(mouseDownEventType, {
    target: targetCell,
    x: 1,
    y: 1,
    preventDefault() {},
  } as any);

  await emitBrushEvent(s2, 400, 200);

  const brushInteraction = s2.interaction.interactions.get(
    InteractionName.BRUSH_SELECTION,
  ) as BaseBrushSelection;

  const brushRange = brushInteraction.getBrushRange();
  const allCells = s2.interaction.getCells();
  const lastCell = allCells[allCells.length - 1];

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
    s2.render();

    const targetCell = s2.interaction.getPanelGroupAllDataCells()[0];

    await expectScrollBrush(s2, targetCell);

    s2.setOptions({
      frozenColCount: 2,
      frozenRowCount: 2,
      frozenTrailingColCount: 2,
      frozenTrailingRowCount: 2,
    });
    s2.render();
    s2.interaction.reset();

    await expectScrollBrush(s2, targetCell);
  });
});

describe('PivotSheet Brush Selection Scroll Tests', () => {
  test('should scroll when mouse outside data cell', async () => {
    const s2 = createPivotSheet(
      {
        width: 400,
        height: 400,
        style: {
          cellCfg: {
            width: 100,
            height: 100,
          },
        },
      },
      { useSimpleData: false },
    );
    s2.render();

    const dataCell = s2.interaction.getPanelGroupAllDataCells()[0];

    await expectScrollBrush(s2, dataCell);
  });

  test('should vertical scroll when mouse outside row cell', async () => {
    const s2 = createPivotSheet(
      {
        width: 400,
        height: 400,
        style: {
          cellCfg: {
            width: 100,
            height: 100,
          },
        },
        interaction: {
          brushSelection: {
            row: true,
            data: false,
          },
        },
      },
      { useSimpleData: false },
    );
    s2.render();

    const rowCell = s2.interaction.getAllRowHeaderCells()[0];

    s2.emit(S2Event.ROW_CELL_MOUSE_DOWN, {
      target: rowCell,
      x: 1,
      y: 1,
      preventDefault() {},
    } as any);

    await emitBrushEvent(s2, 200, 200);

    expect(s2.facet.getScrollOffset().scrollY).toBeGreaterThan(0);
    expect(s2.interaction.getCells()).not.toBeEmpty();
  });

  // https://github.com/antvis/S2/pull/2101
  test('should vertical scroll and only brush current column cells when mouse outside row cell', async () => {
    const s2 = createPivotSheet(
      {
        width: 400,
        height: 400,
        style: {
          cellCfg: {
            width: 100,
            height: 100,
          },
        },
        interaction: {
          brushSelection: {
            row: true,
          },
        },
      },
      { useSimpleData: false },
    );
    s2.render();

    const rowCell = s2.interaction.getAllRowHeaderCells()[0];

    s2.emit(S2Event.ROW_CELL_MOUSE_DOWN, {
      target: rowCell,
      x: 1,
      y: 1,
      preventDefault() {},
    } as any);

    // 只刷选 [省份]
    await emitBrushEvent(s2, 100, 200);

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
  });

  // https://github.com/antvis/S2/issues/2106
  test('should prepare brush selection mask does not exceed the data cell when auto scroll', async () => {
    const s2 = createPivotSheet(
      {
        width: 400,
        height: 400,
        style: {
          cellCfg: {
            width: 100,
            height: 100,
          },
        },
      },
      { useSimpleData: false },
    );
    s2.render();

    const dataCell = s2.interaction.getPanelGroupAllDataCells()[0];

    await expectScrollBrush(s2, dataCell);

    const brushSelection = s2.interaction.interactions.get(
      InteractionName.BRUSH_SELECTION,
    ) as BaseBrushSelection;

    expect(brushSelection.prepareSelectMaskShape.attr('x')).toEqual(
      s2.facet.panelBBox.minX,
    );
    expect(brushSelection.prepareSelectMaskShape.attr('y')).toEqual(
      s2.facet.panelBBox.minY,
    );
  });
});
