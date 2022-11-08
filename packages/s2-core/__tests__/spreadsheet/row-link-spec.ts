import { getContainer } from 'tests/util/helpers';
import { PivotSheet } from '@/sheet-type';
import { S2Event, type S2Options } from '@/common';

const s2Options: S2Options = {
  width: 400,
  height: 400,
  hierarchyType: 'grid',
  totals: {
    row: {
      showSubTotals: true,
      subTotalsDimensions: ['province'],
      reverseSubLayout: true,
    },
  },
  interaction: {
    linkFields: ['province', 'city'],
  },
};

const s2DataCfg = {
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
    },

    {
      province: '浙江',
      city: '义乌1',
      type: '笔',
      cost: 2,
    },
    {
      province: '浙江',
      city: '义乌2',
      type: '笔',
      price: 1,
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

describe('Row Text Link Tests', () => {
  let container: HTMLDivElement;

  let s2: PivotSheet;
  const linkFieldJump = jest.fn();
  beforeAll(() => {
    container = getContainer();
    s2 = new PivotSheet(container, s2DataCfg, s2Options);
    s2.render();
    s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, linkFieldJump);
  });

  test('should get correctly row leaf node when click row 浙江', () => {
    s2.getCanvasElement().dispatchEvent(
      new MouseEvent('mousedown', {
        clientX: 60,
        clientY: 160,
      }),
    );
    s2.getCanvasElement().dispatchEvent(
      new MouseEvent('mouseup', {
        clientX: 60,
        clientY: 160,
      }),
    );
    expect(linkFieldJump).toBeCalledWith({
      key: 'province',
      record: {
        province: '浙江',
        type: '笔',
        price: 2,
        cost: 2,
        $$extra$$: 'price',
        $$value$$: 2,
        rowIndex: 0,
      },
    });
  });

  test('should get correctly row leaf node when click row 义乌1', () => {
    s2.getCanvasElement().dispatchEvent(
      new MouseEvent('mousedown', {
        clientX: 150,
        clientY: 160,
      }),
    );
    s2.getCanvasElement().dispatchEvent(
      new MouseEvent('mouseup', {
        clientX: 150,
        clientY: 160,
      }),
    );
    expect(linkFieldJump).toBeCalledWith({
      key: 'city',
      record: {
        province: '浙江',
        city: '义乌1',
        type: '笔',
        price: 1,
        $$extra$$: 'price',
        $$value$$: 1,
        rowIndex: 1,
      },
    });
  });

  test('should get correctly row leaf node when click row 四川', () => {
    s2.getCanvasElement().dispatchEvent(
      new MouseEvent('mousedown', {
        clientX: 60,
        clientY: 240,
      }),
    );
    s2.getCanvasElement().dispatchEvent(
      new MouseEvent('mouseup', {
        clientX: 60,
        clientY: 240,
      }),
    );
    expect(linkFieldJump).toBeCalledWith({
      key: 'province',
      record: {
        province: '四川',
        type: '笔',
        price: 1,
        cost: 2,
        $$extra$$: 'price',
        $$value$$: 1,
        rowIndex: 3,
      },
    });
  });
});
