/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * @description spec for issue #1191
 * https://github.com/antvis/S2/issues/1191
 * link field should use linkFieldFill color
 *
 */
import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';
import type { S2DataConfig, S2Options } from '@/common/interface';
import { PivotSheet, SpreadSheet } from '@/sheet-type';

const s2options: S2Options = {
  width: 300,
  height: 200,
  style: {
    colCell: {
      height: 60,
    },
    dataCell: {
      width: 100,
      height: 50,
    },
  },
  interaction: {
    linkFields: ['province'],
  },
  hd: false,
};

const dataCfg: S2DataConfig = {
  ...mockDataConfig,
  fields: {
    rows: ['province', 'city'],
    values: ['price'],
    valueInCols: true,
  },
  meta: [
    {
      field: 'province',
      name: '省份',
      formatter: (v) => `province: ${v}`,
    },
    {
      field: 'city',
      name: '城市',
      formatter: (v) => `city: ${v}`,
    },
    {
      field: 'price',
      name: '价格',
      formatter: (v) => `price: ${v}`,
    },
  ],
};

describe('Link Field Tests', () => {
  let s2: SpreadSheet;

  beforeEach(async () => {
    s2 = new PivotSheet(getContainer(), dataCfg, s2options);
    s2.setTheme({
      rowCell: {
        text: {
          linkTextFill: 'red',
        },
        bolderText: {
          linkTextFill: 'red',
        },
      },
    });
    await s2.render();
  });

  test('province row cell should use link field style', () => {
    // 浙江省对应 cell
    const province = s2.facet
      .getRowCells()
      .find((cell) => cell.getMeta().value === '浙江');

    expect(province?.getTextShape().attr('fill')).toEqual('red');
    expect(province?.getLinkFieldShape()).toBeDefined();
  });

  test('city row cell should not use link field style', () => {
    // 义乌对应 cell
    const city = s2.facet
      .getRowCells()
      .find((cell) => cell.getMeta().value === '义乌');

    expect(city?.getTextShape().attr('fill')).not.toEqual('red');
    expect(city?.getLinkFieldShape()).not.toBeDefined();
  });
});
