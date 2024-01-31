import * as mockDataConfig from 'tests/data/simple-data.json';
import * as mockTableDataConfig from 'tests/data/simple-table-data.json';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet, TableSheet } from '@/sheet-type';
import { LayoutWidthType, type S2DataConfig, type S2Options } from '@/common';

const s2options: S2Options = {
  width: 800,
  height: 600,
};

describe('Col width Test', () => {
  describe('Grid Mode', () => {
    let s2: PivotSheet;

    beforeEach(async () => {
      s2 = new PivotSheet(
        getContainer(),
        {
          ...mockDataConfig,
          data: [
            {
              province: '浙江',
              city: '义乌',
              type: '笔',
              // long text
              price: 123456789,
              cost: 2,
            },
          ],
        },
        s2options,
      );
      await s2.render();
    });

    test('get correct width in layoutWidthType adaptive mode', () => {
      expect(s2.facet.getColLeafNodes()[0].width).toBe(199.5);
    });

    test('get correct width in layoutWidthType adaptive mode when enable series number', async () => {
      s2.setOptions({
        seriesNumber: {
          enable: true,
        },
      });
      await s2.render();

      expect(s2.facet.getColLeafNodes()[0].width).toBe(179.5);
    });

    test('get correct width in layoutWidthType adaptive tree mode', async () => {
      s2.setOptions({
        hierarchyType: 'tree',
      });
      await s2.render();

      expect(Math.round(s2.facet.getColLeafNodes()[0].width)).toBe(339);
    });

    test('get correct width in layoutWidthType adaptive tree mode when enable series number', async () => {
      s2.setOptions({
        hierarchyType: 'tree',
        seriesNumber: {
          enable: true,
        },
      });
      await s2.render();

      expect(Math.round(s2.facet.getColLeafNodes()[0].width)).toBe(299);
    });

    test('get correct width in layoutWidthType compact mode', async () => {
      s2.setOptions({
        style: {
          layoutWidthType: LayoutWidthType.Compact,
        },
      });
      await s2.render();

      // 无 formatter

      expect(Math.round(s2.facet.getColLeafNodes()[0].width)).toBe(78);
    });

    test('get correct width in layoutWidthType compact mode when apply formatter', async () => {
      s2.setDataCfg({
        fields: undefined as unknown as S2DataConfig['fields'],
        data: undefined as unknown as S2DataConfig['data'],
        meta: [
          {
            field: 'price',
            formatter: (v) => `${((v as number) / 1000000).toFixed(0)}百万`,
          },
        ],
      });
      s2.setOptions({
        style: {
          layoutWidthType: LayoutWidthType.Compact,
        },
      });
      await s2.render();

      // 有formatter

      expect(Math.round(s2.facet.getColLeafNodes()[0].width)).toBe(62);
    });
  });

  describe('Table Mode', () => {
    let s2: TableSheet;

    beforeEach(async () => {
      s2 = new TableSheet(
        getContainer(),
        {
          ...mockTableDataConfig,
          meta: [
            {
              field: 'cost',
              formatter: (s) => `我是一个很长的格式化标签${s}`,
            },
          ],
        },
        s2options,
      );
      await s2.render();
    });

    test('get correct width in layoutWidthType compact mode', async () => {
      s2.setOptions({
        style: {
          layoutWidthType: LayoutWidthType.Compact,
        },
      });
      await s2.render();

      const colLeafNodes = s2.facet.getColLeafNodes();

      // price 列，列头标签比表身数据更长
      expect(Math.round(colLeafNodes[0].width)).toBe(46);
      // cost 列，表身数据比列头更长（格式化）
      expect(Math.round(colLeafNodes[1].width)).toBe(168);
    });
  });
});
