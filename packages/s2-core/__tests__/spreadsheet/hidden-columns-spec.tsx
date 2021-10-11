/* eslint-disable no-console */
import { act } from 'react-dom/test-utils';
import { getContainer } from '../util/helpers';
import { S2Event, TableSheet } from '@/index';

const data = [
  {
    province: '浙江',
    city: '杭州',
    type: '笔',
    price: '1',
  },
  {
    province: '浙江',
    city: '杭州',
    type: '纸张',
    price: '2',
  },
  {
    province: '浙江',
    city: '舟山',
    type: '笔',
    price: '17',
  },
  {
    province: '浙江',
    city: '舟山',
    type: '纸张',
    price: '0.5',
  },
  {
    province: '吉林',
    city: '丹东',
    type: '笔',
    price: '8',
  },
  {
    province: '吉林',
    city: '白山',
    type: '笔',
    price: '9',
  },
  {
    province: '吉林',
    city: '丹东',
    type: ' 纸张',
    price: '3',
  },
  {
    province: '吉林',
    city: '白山',
    type: '纸张',
    price: '1',
  },
  {
    province: '浙江',
    city: '杭州',
    type: '笔',
    cost: '0.5',
  },
  {
    province: '浙江',
    city: '杭州',
    type: '纸张',
    cost: '0.2',
  },
  {
    province: '浙江',
    city: '舟山',
    type: '笔',
    cost: '1.7',
  },
  {
    province: '浙江',
    city: '舟山',
    type: '纸张',
    cost: '0.12',
  },
  {
    province: '吉林',
    city: '丹东',
    type: '笔',
    cost: '10',
  },
  {
    province: '吉林',
    city: '白山',
    type: '笔',
    cost: '9',
  },
  {
    province: '吉林',
    city: '丹东',
    type: ' 纸张',
    cost: '3',
  },
  {
    province: '吉林',
    city: '白山',
    type: '纸张',
    cost: '1',
  },
];

describe('hidden columns spec', () => {
  act(() => {
    const s2DataConfig = {
      fields: {
        columns: ['type', 'price', 'province', 'city'],
      },
      data,
    };

    const s2options = {
      width: 800,
      height: 600,
      hiddenColumnFields: ['price'],
      tooltip: {
        showTooltip: true,
        operation: {
          hiddenColumns: true,
        },
      },
    };
    const s2 = new TableSheet(getContainer(), s2DataConfig, s2options);

    s2.on(S2Event.LAYOUT_TABLE_COL_EXPANDED, (cell) => {
      console.log('列头展开', cell);
    });
    s2.on(
      S2Event.LAYOUT_TABLE_COL_HIDDEN,
      (currentHiddenColumnsInfo, hiddenColumnsDetail) => {
        console.log('列头隐藏', currentHiddenColumnsInfo, hiddenColumnsDetail);
      },
    );

    s2.render();
  });
  test('should pass test', () => {
    // just for placeholder when run test:live
    expect(1).toBe(1);
  });
});
