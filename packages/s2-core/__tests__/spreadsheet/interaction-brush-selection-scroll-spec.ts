import { getContainer, getMockData, sleep } from 'tests/util/helpers';
import {
  TableSheet,
  type S2Options,
  type S2DataConfig,
  S2Event,
  DataCell,
  InteractionName,
  BaseBrushSelection,
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

describe('Brush selection scroll spec', () => {
  test('Should scroll when mouse outside canvas', async () => {
    const s2 = new TableSheet(getContainer(), dataCfg, options);
    s2.render();
    const dataCells = s2.panelScrollGroup.getChildren();
    const target = dataCells.find((item) => item instanceof DataCell);
    const offsetY = s2.container.get('el').getBoundingClientRect().top;
    s2.emit(S2Event.DATA_CELL_MOUSE_DOWN, {
      target,
      originalEvent: { layerX: 1, layerY: 1 },
      event: { x: 1, y: 1 },
      preventDefault() {},
    } as any);
    await sleep(40);

    s2.emit(S2Event.GLOBAL_MOUSE_MOVE, {
      clientX: 400,
      clientY: 400 + offsetY,
      preventDefault() {},
    } as any);
    await sleep(40);

    s2.emit(S2Event.GLOBAL_MOUSE_MOVE, {
      clientX: 400,
      clientY: 1000 + offsetY,
      preventDefault() {},
    } as any);
    await sleep(100);

    s2.emit(S2Event.GLOBAL_MOUSE_UP, {
      clientX: 400,
      clientY: 1000 + offsetY,
      preventDefault() {},
    } as any);

    expect(s2.facet.getScrollOffset().scrollY).toBeGreaterThan(0);
    const brushInteraction = s2.interaction.interactions.get(
      InteractionName.BRUSH_SELECTION,
    ) as BaseBrushSelection;

    const brushRange = brushInteraction.getBrushRange();
    const allCells = s2.interaction.getCells();
    const lastCell = allCells[allCells.length - 1];
    expect(brushRange.start.colIndex).toBe(allCells[0].colIndex);
    expect(brushRange.start.rowIndex).toBe(allCells[0].rowIndex);
    expect(brushRange.end.colIndex).toBe(lastCell.colIndex);
    expect(brushRange.end.rowIndex).toBe(lastCell.rowIndex);

    s2.setOptions({
      frozenColCount: 2,
      frozenRowCount: 2,
      frozenTrailingColCount: 2,
      frozenTrailingRowCount: 2,
    });
    s2.render();
    s2.interaction.reset();

    s2.emit(S2Event.DATA_CELL_MOUSE_DOWN, {
      target,
      event: { x: 128, y: 49 },
      preventDefault() {},
    } as any);

    s2.emit(S2Event.GLOBAL_MOUSE_MOVE, {
      clientX: 400,
      clientY: 400,
      preventDefault() {},
    } as any);
    await sleep(40);

    s2.emit(S2Event.GLOBAL_MOUSE_MOVE, {
      clientX: 400,
      clientY: 1000,
      preventDefault() {},
    } as any);
    await sleep(60);

    s2.emit(S2Event.GLOBAL_MOUSE_UP, {
      clientX: 400,
      clientY: 1000,
      preventDefault() {},
    } as any);

    expect(s2.facet.getScrollOffset().scrollY).toBeGreaterThan(0);
  });
});
