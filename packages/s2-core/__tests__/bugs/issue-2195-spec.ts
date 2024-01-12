/**
 * 字段代码中有方括号，无法拖拽调整该字段所在列的宽度
 * 描述应当调整为：字段代码中有方括号，无法使用 `xxxByField` 配置调整该字段的布局
 * @description spec for issue #2195
 * https://github.com/antvis/S2/issues/2195
 */

import { getContainer } from '../util/helpers';
import type { S2DataConfig, S2Options } from '@/index';
import { PivotSheet } from '@/sheet-type';

const modifiedMockDataConfig: S2DataConfig = {
  fields: {
    rows: ['province', '[city]'],
    columns: ['type'],
    values: ['price', 'cost'],
    valueInCols: true,
  },
  data: [
    {
      province: '浙江',
      '[city]': '义乌',
      type: '笔',
      price: 1,
      cost: 2,
    },
    {
      province: '浙江',
      '[city]': '义乌',
      type: '笔',
      price: 1,
      cost: 2,
    },
    {
      province: '浙江',
      '[city]': '杭州',
      type: '笔',
      price: 1,
      cost: 2,
    },
  ],
};

const s2Options: S2Options = {
  width: 400,
  height: 400,
  style: {
    rowCell: {
      widthByField: {
        province: 300,
        '[city]': 123,
      },
    },
  },
};

describe('Field surrounded by square brackets Tests', () => {
  test('should render correctly when use field  surrounded by square brackets', async () => {
    const s2 = new PivotSheet(
      getContainer(),
      modifiedMockDataConfig,
      s2Options,
    );

    await s2.render();

    s2.facet
      .getLayoutResult()
      .rowNodes.filter((node) => node.field === '[city]')
      .forEach((node) => {
        expect(node.width).toEqual(123);
      });
  });
});
