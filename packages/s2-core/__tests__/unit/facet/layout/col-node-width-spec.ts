import * as mockDataConfig from 'tests/data/simple-data.json';
import * as mockTableDataConfig from 'tests/data/simple-table-data.json';
import { getContainer } from 'tests/util/helpers';
import { PivotSheet, TableSheet } from '@/sheet-type';
import type { S2Options } from '@/common';

const s2options: S2Options = {
  width: 800,
  height: 600,
};

describe('Col width Test', () => {
  describe('Grid Mode', () => {
    let s2: PivotSheet;
    beforeEach(() => {
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
      s2.render();
    });

    test('get correct width in layoutWidthType adaptive mode', () => {
      const { colLeafNodes } = s2.facet.layoutResult;
      expect(colLeafNodes[0].width).toBe(200);
    });

    test('get correct width in layoutWidthType adaptive mode when enable seriesnumber', () => {
      s2.setOptions({
        showSeriesNumber: true,
      });
      s2.render();
      const { colLeafNodes } = s2.facet.layoutResult;
      expect(colLeafNodes[0].width).toBe(180);
    });

    test('get correct width in layoutWidthType adaptive tree mode', () => {
      s2.setOptions({
        hierarchyType: 'tree',
      });
      s2.render();
      const { colLeafNodes } = s2.facet.layoutResult;
      expect(Math.round(colLeafNodes[0].width)).toBe(338);
    });

    test('get correct width in layoutWidthType adaptive tree mode when enable seriesnumber', () => {
      s2.setOptions({
        hierarchyType: 'tree',
        showSeriesNumber: true,
      });
      s2.render();
      const { colLeafNodes } = s2.facet.layoutResult;
      expect(Math.round(colLeafNodes[0].width)).toBe(298);
    });

    test('get correct width in layoutWidthType compact mode', () => {
      s2.setOptions({
        style: {
          layoutWidthType: 'compact',
        },
      });
      s2.render();

      // 无 formatter
      const { colLeafNodes } = s2.facet.layoutResult;
      expect(Math.round(colLeafNodes[0].width)).toBe(86);
    });

    test('get correct width in layoutWidthType compact mode when apply fomatter', () => {
      s2.setDataCfg({
        fields: undefined,
        data: undefined,
        meta: [
          {
            field: 'price',
            formatter: (v: number) => {
              return `${(v / 1000000).toFixed(0)}百万`;
            },
          },
        ],
      });
      s2.setOptions({
        style: {
          layoutWidthType: 'compact',
        },
      });
      s2.render();

      // 有formatter
      const { colLeafNodes } = s2.facet.layoutResult;
      expect(Math.round(colLeafNodes[0].width)).toBe(62);
    });
  });

  describe('Table Mode', () => {
    let s2: TableSheet;
    beforeEach(() => {
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
      s2.render();
    });

    test('get correct width in layoutWidthType compact mode', () => {
      s2.setOptions({
        style: {
          layoutWidthType: 'compact',
        },
      });
      s2.render();

      const { colLeafNodes } = s2.facet.layoutResult;

      expect(Math.round(colLeafNodes[0].width)).toBe(47); // 列头标签更长
      expect(Math.round(colLeafNodes[1].width)).toBe(168); // 表身标签更长（格式化）
    });
  });
});
