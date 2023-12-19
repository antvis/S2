/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * @description spec for issue #1191
 * https://github.com/antvis/S2/issues/1191
 * link field should use linkFieldFill color
 *
 */
import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';
import type { Group } from '@antv/g-canvas';
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
  hdAdapter: false,
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
      formatter: (v) => `price:${v}`,
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
<<<<<<< HEAD
    const province = s2.facet.rowHeader?.children[0];

=======
    const province = (
      s2.facet.rowHeader.getChildByIndex(0) as Group
    ).getChildByIndex(0);
>>>>>>> origin/master
    // @ts-ignore
    expect(province.textShape.attr('fill')).toEqual('red');
    // @ts-ignore
    expect(province.linkFieldShape).toBeDefined();
  });

  test('city row cell should not use link field style', () => {
    // 义乌对应 cell
<<<<<<< HEAD
    const city = s2.facet.rowHeader?.children[1];

=======
    const city = (
      s2.facet.rowHeader.getChildByIndex(0) as Group
    ).getChildByIndex(1);
>>>>>>> origin/master
    // @ts-ignore
    expect(city.textShape.attr('fill')).not.toEqual('red');
    // @ts-ignore
    expect(city.linkFieldShape).not.toBeDefined();
  });
});
