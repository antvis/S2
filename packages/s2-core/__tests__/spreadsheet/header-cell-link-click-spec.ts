import {
  EXTRA_FIELD,
  S2Event,
  type Node,
  type S2DataConfig,
  type S2Options,
} from '@/common';
import { PivotSheet } from '@/sheet-type';
import { noop } from 'lodash';
import { getContainer } from 'tests/util/helpers';

const s2Options: S2Options = {
  width: 400,
  height: 400,
  hierarchyType: 'grid',
  totals: {
    row: {
      showSubTotals: true,
      subTotalsDimensions: ['province'],
      reverseSubTotalsLayout: true,
    },
  },
  interaction: {
    linkFields: ['province', 'city', 'type'],
  },
};

const s2DataCfg: S2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type'],
    values: ['price', 'cost'],
    valueInCols: true,
  },
  data: [
    {
      province: '浙江',
      city: '义乌1',
      type: '笔',
      price: 1,
      cost: 2,
    },
    {
      province: '浙江',
      city: '义乌2',
      type: '笔',
      price: 1,
      cost: 6,
    },
    {
      province: '浙江',
      type: '笔',
      price: 2,
      cost: 2,
    },
    {
      province: '四川',
      city: '成都',
      type: '笔',
      price: 1,
      cost: 2,
    },
    {
      province: '四川',
      type: '笔',
      price: 1,
      cost: 2,
    },
  ],
};

describe('Header Cell Link Click Tests', () => {
  let container: HTMLDivElement;

  let s2: PivotSheet;
  const linkFieldJump = jest.fn();

  const emitCellClickEvent = (event: S2Event, node: Node) => {
    s2.emit(event, {
      stopPropagation: noop,
      target: {
        appendInfo: {
          isLinkFieldText: true,
          meta: node,
        },
      },
    } as any);
    expect(node.belongsCell.getLinkFieldShape()).toBeDefined();
  };

  beforeEach(async () => {
    container = getContainer();
    s2 = new PivotSheet(container, s2DataCfg, s2Options);
    await s2.render();

    s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, linkFieldJump);
  });

  test('should get correctly row leaf node when click row 浙江', () => {
    const rowNode = s2.facet.getRowNodes()[0]; // 浙江

    emitCellClickEvent(S2Event.ROW_CELL_CLICK, rowNode);

    expect(linkFieldJump).toHaveBeenCalledWith({
      field: 'province',
      meta: rowNode,
      record: {
        province: '浙江',
        type: '笔',
        price: 2,
        cost: 2,
        rowIndex: 0,
        colIndex: -1,
      },
    });
  });

  test('should get correctly row leaf node when click row 义乌1', () => {
    const rowNode = s2.facet.getRowNodes()[2]; // 义乌1

    emitCellClickEvent(S2Event.ROW_CELL_CLICK, rowNode);

    expect(linkFieldJump).toHaveBeenLastCalledWith({
      field: 'city',
      meta: rowNode,
      record: {
        province: '浙江',
        city: '义乌1',
        type: '笔',
        price: 1,
        cost: 2,
        rowIndex: 1,
        colIndex: -1,
      },
    });
  });

  test('should get correctly row leaf node when click row 四川', () => {
    const rowNode = s2.facet.getRowNodes()[4]; // 四川

    emitCellClickEvent(S2Event.ROW_CELL_CLICK, rowNode);

    expect(linkFieldJump).toHaveBeenCalledWith({
      field: 'province',
      meta: rowNode,
      record: {
        province: '四川',
        type: '笔',
        price: 1,
        cost: 2,
        rowIndex: 3,
        colIndex: -1,
      },
    });
  });

  test('should get correctly col leaf node when click col 笔', () => {
    const colNode = s2.facet.getColNodes()[0]; // 笔

    emitCellClickEvent(S2Event.COL_CELL_CLICK, colNode);

    expect(linkFieldJump).toHaveBeenCalledWith({
      field: 'type',
      meta: colNode,
      record: {
        province: '浙江',
        type: '笔',
        price: 2,
        cost: 2,
        rowIndex: 0,
        colIndex: -1,
      },
    });
  });

  test('should get correctly extra field node when click col 价格', async () => {
    s2.setOptions({
      interaction: {
        linkFields: [EXTRA_FIELD],
      },
    });
    s2.setDataCfg({
      fields: {
        values: ['price'],
      },
    });

    await s2.render();
    const colNode = s2.facet.getColLeafNodes()[0];

    emitCellClickEvent(S2Event.COL_CELL_CLICK, colNode);

    expect(linkFieldJump).toHaveBeenCalledWith({
      field: EXTRA_FIELD,
      meta: colNode,
      record: {
        province: '浙江',
        type: '笔',
        price: 2,
        cost: 2,
        rowIndex: 0,
        colIndex: 0,
      },
    });
  });
});
