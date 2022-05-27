/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * @description spec for issue #1191
 * https://github.com/antvis/S2/issues/1191
 * link field should use linkFieldFill color
 *
 */
import { getContainer } from 'tests/util/helpers';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { filter, get } from 'lodash';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import { S2Options } from '@/common/interface';
import { CornerCell } from '@/cell';

const s2options: S2Options = {
  width: 300,
  height: 200,
  style: {
    colCfg: {
      height: 60,
    },
    cellCfg: {
      width: 100,
      height: 50,
    },
  },
  interaction: {
    linkFields: ['province'],
  },
};

const dataCfg = {
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

  beforeEach(() => {
    s2 = new PivotSheet(getContainer(), dataCfg, s2options);
    s2.setThemeCfg({
      theme: {
        rowCell: {
          text: {
            linkTextFill: 'red',
          },
          bolderText: {
            linkTextFill: 'red',
          },
        },
      },
    });
    s2.render();
  });

  test('province row cell should use link field style', () => {
    // 浙江省对应 cell
    const province = s2.facet.rowHeader.getChildByIndex(0);
    // @ts-ignore
    expect(province.textShape.attr('fill')).toEqual('red');
    // @ts-ignore
    expect(province.linkFieldShape).toBeDefined();
  });
  test('city row cell should not use link field style', () => {
    // 义乌对应 cell
    const city = s2.facet.rowHeader.getChildByIndex(1);
    // @ts-ignore
    expect(city.textShape.attr('fill')).not.toEqual('red');
    // @ts-ignore
    expect(city.linkFieldShape).not.toBeDefined();
  });
});
