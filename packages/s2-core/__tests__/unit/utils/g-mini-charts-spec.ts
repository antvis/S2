import type { RangeColors } from '../../../src/common/interface/theme';
import {
  getBulletRangeColor,
  transformRatioToPercent,
  scale,
} from '@/utils/g-mini-charts';
import { MiniChartTypes, type S2CellType } from '@/common';

describe('MiniCharts Utils Tests', () => {
  test('should get right scale of line', () => {
    const chartData = {
      type: MiniChartTypes.Line,
      data: [
        { year: '2018', value: 10 },
        { year: '2019', value: 20 },
        { year: '2020', value: 30 },
        { year: '2021', value: 40 },
      ],
      encode: {
        x: 'year',
        y: 'value',
      },
    };

    const cell = {
      getMeta: () => {
        return {
          x: 0,
          y: 0,
          height: 108,
          width: 208,
        };
      },
      getStyle: () => {
        return {
          cell: {
            padding: {
              left: 8,
              right: 8,
              top: 8,
              bottom: 8,
            },
          },
          miniChart: {
            bar: {
              intervalPadding: 4,
            },
          },
        };
      },
    };

    expect(scale(chartData, cell as S2CellType)).toEqual({
      range: {
        xStart: 8,
        xEnd: 200,
        yStart: 8,
        yEnd: 100,
      },
      points: [
        [8, 77],
        [72, 54],
        [136, 31],
        [200, 8],
      ],
      intervalX: 64,
    });
  });

  test('should get right scale of bar', () => {
    const chartData = {
      type: MiniChartTypes.Bar,
      data: [
        { year: '2018', value: 10 },
        { year: '2019', value: 20 },
        { year: '2020', value: 30 },
        { year: '2021', value: 40 },
      ],
      encode: {
        x: 'year',
        y: 'value',
      },
    };

    const cell = {
      getMeta: () => {
        return {
          x: 0,
          y: 0,
          height: 108,
          width: 208,
        };
      },
      getStyle: () => {
        return {
          cell: {
            padding: {
              left: 8,
              right: 8,
              top: 8,
              bottom: 8,
            },
          },
          miniChart: {
            bar: {
              intervalPadding: 4,
            },
          },
        };
      },
    };

    expect(scale(chartData, cell as S2CellType)).toEqual({
      range: {
        xStart: 8,
        xEnd: 200,
        yStart: 8,
        yEnd: 100,
      },
      points: [
        [8, 77],
        [57, 54],
        [106, 31],
        [155, 8],
      ],
      intervalX: 49,
    });
  });

  test('should get bullet range color', () => {
    const rangeColors: RangeColors = {
      good: 'green',
      satisfactory: 'yellow',
      bad: 'red',
    };

    expect(getBulletRangeColor(0.2, 0.2, rangeColors)).toEqual('green');
    expect(getBulletRangeColor(0.3, 0.5, rangeColors)).toEqual('yellow');
    expect(getBulletRangeColor(0.1, 0.9, rangeColors)).toEqual('red');
  });

  test('should transform ratio to percent', () => {
    expect(transformRatioToPercent(0.2)).toEqual('20%');
    expect(transformRatioToPercent('0.2')).toEqual('20%');
    expect(transformRatioToPercent('test')).toEqual('test');
    expect(transformRatioToPercent(0.02)).toEqual('2%');
    expect(transformRatioToPercent(0.02, 2)).toEqual('2.00%');
  });
});
