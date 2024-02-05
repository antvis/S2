import { assembleDataCfg, assembleOptions } from 'tests/util';
import { getContainer } from 'tests/util/helpers';
import { forEach, map } from 'lodash';
import { data } from 'tests/data/mock-dataset.json';
import type { RangeColors } from '../../../src/common/interface/theme';
import { PivotSheet, SpreadSheet } from '@/sheet-type';
import { CellType, MiniChartType, type S2CellType } from '@/common';
import {
  getBulletRangeColor,
  transformRatioToPercent,
  scale,
  drawInterval,
} from '@/utils/g-mini-charts';
import type { DataCell } from '@/cell';
import { getTheme } from '@/theme';

describe('MiniCharts Utils Tests', () => {
  const padding = {
    left: 8,
    right: 8,
    top: 4,
    bottom: 4,
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
          padding,
        },
        miniChart: {
          bar: {
            intervalPadding: 4,
          },
        },
      };
    },
  };

  test('should get right points of line', () => {
    const chartData = {
      type: MiniChartType.Line,
      data: [
        { year: '2018', value: 10 },
        { year: '2019', value: 0 },
        { year: '2020', value: -10 },
        { year: '2021', value: 0 },
      ],
      encode: {
        x: 'year',
        y: 'value',
      },
    };

    expect(scale(chartData, cell as S2CellType)).toEqual({
      points: [
        [8, 4],
        [72, 54],
        [136, 104],
        [200, 54],
      ],
      box: [],
    });
  });

  test('should get right points of line when all values are more then 0', () => {
    const chartData = {
      type: MiniChartType.Line,
      data: [
        { year: '2018', value: 10 },
        { year: '2019', value: 5 },
        { year: '2020', value: 5 },
        { year: '2021', value: 5 },
      ],
      encode: {
        x: 'year',
        y: 'value',
      },
    };

    expect(scale(chartData, cell as S2CellType)).toEqual({
      points: [
        [8, 4],
        [72, 104],
        [136, 104],
        [200, 104],
      ],
      box: [],
    });
  });

  test('should get right points of line when all values are less then 0', () => {
    const chartData = {
      type: MiniChartType.Line,
      data: [
        { year: '2018', value: -5 },
        { year: '2019', value: -10 },
        { year: '2020', value: -5 },
        { year: '2021', value: -10 },
      ],
      encode: {
        x: 'year',
        y: 'value',
      },
    };

    expect(scale(chartData, cell as S2CellType)).toEqual({
      points: [
        [8, 4],
        [72, 104],
        [136, 4],
        [200, 104],
      ],
      box: [],
    });
  });

  test('should get right points of line when all values are equal to each other', () => {
    const chartData = {
      type: MiniChartType.Line,
      data: [
        { year: '2018', value: 0 },
        { year: '2019', value: 0 },
        { year: '2020', value: 0 },
        { year: '2021', value: 0 },
      ],
      encode: {
        x: 'year',
        y: 'value',
      },
    };

    expect(scale(chartData, cell as S2CellType)).toEqual({
      points: [
        [8, 104],
        [72, 104],
        [136, 104],
        [200, 104],
      ],
      box: [],
    });
  });

  test('should get right scale of bar', () => {
    const chartData = {
      type: MiniChartType.Bar,
      data: [
        { year: '2018', value: 10 },
        { year: '2019', value: 0 },
        { year: '2020', value: -10 },
        { year: '2021', value: 0 },
      ],
      encode: {
        x: 'year',
        y: 'value',
      },
    };

    expect(scale(chartData, cell as S2CellType)).toEqual({
      box: [
        [45, 50],
        [45, 0],
        [45, 50],
        [45, 0],
      ],
      points: [
        [8, 4],
        [57, 54],
        [106, 54],
        [155, 54],
      ],
    });
  });

  test('should get right scale of bar when all values are less then 0', () => {
    const chartData = {
      type: MiniChartType.Bar,
      data: [
        { year: '2018', value: -5 },
        { year: '2019', value: -10 },
        { year: '2020', value: -5 },
        { year: '2021', value: -10 },
      ],
      encode: {
        x: 'year',
        y: 'value',
      },
    };

    expect(scale(chartData, cell as S2CellType)).toEqual({
      box: [
        [45, 50],
        [45, 100],
        [45, 50],
        [45, 100],
      ],

      points: [
        [8, 4],
        [57, 4],
        [106, 4],
        [155, 4],
      ],
    });
  });

  test('should get right points of bar when all values are equal to each other', () => {
    const chartData = {
      type: MiniChartType.Bar,
      data: [
        { year: '2018', value: 10 },
        { year: '2019', value: 10 },
        { year: '2020', value: 10 },
        { year: '2021', value: 10 },
      ],
      encode: {
        x: 'year',
        y: 'value',
      },
    };

    expect(scale(chartData, cell as S2CellType)).toEqual({
      box: [
        [45, 100],
        [45, 100],
        [45, 100],
        [45, 100],
      ],
      points: [
        [8, 104],
        [57, 104],
        [106, 104],
        [155, 104],
      ],
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
    expect(getBulletRangeColor(-0.1386, 0.0137, rangeColors)).toEqual('red');
    expect(getBulletRangeColor(-0.2, -0.2, rangeColors)).toEqual('red');
    expect(getBulletRangeColor(0.1, -0.2, rangeColors)).toEqual('green');
    expect(getBulletRangeColor(0.09799999, 0.19788888, rangeColors)).toEqual(
      'green',
    );
    expect(getBulletRangeColor(0.09788888, 0.19788888, rangeColors)).toEqual(
      'green',
    );
    expect(getBulletRangeColor('测试', '牛啊', rangeColors)).toEqual('red');
    expect(getBulletRangeColor('测试', 0.2, rangeColors)).toEqual('red');
    expect(getBulletRangeColor(0.2, '牛啊', rangeColors)).toEqual('red');

    // toFixed(2) 四舍五入精度问题
    expect(getBulletRangeColor(0.09775, 0.1978, rangeColors)).toEqual('yellow');
    expect(getBulletRangeColor(0.09774, 0.1978, rangeColors)).toEqual('yellow');
    expect(getBulletRangeColor(0.09774, 0.1974, rangeColors)).toEqual('green');
  });

  test('should transform ratio to percent', () => {
    expect(transformRatioToPercent(0.2)).toEqual('20%');
    expect(transformRatioToPercent('0.2')).toEqual('20%');
    expect(transformRatioToPercent('test')).toEqual('test');
    expect(transformRatioToPercent('牛啊')).toEqual('牛啊');
    expect(transformRatioToPercent(0.02)).toEqual('2%');
    expect(transformRatioToPercent(0.02, 2)).toEqual('2.00%');
    expect(transformRatioToPercent(-122.2)).toEqual('-12220%');
    expect(transformRatioToPercent('-122.2')).toEqual('-12220%');
    expect(transformRatioToPercent(-122.2, 2)).toEqual('-12220.00%');
  });

  test('should transform ratio to percent for auto adjust fraction digits', () => {
    expect(transformRatioToPercent(0.09775)).toEqual('10%');
    expect(transformRatioToPercent(-0.09775, { min: 2, max: 2 })).toEqual(
      '-9.78%',
    );
    expect(transformRatioToPercent(0.09775, { min: 2, max: 2 })).toEqual(
      '9.78%',
    );
    expect(transformRatioToPercent(0.09775, { min: 2, max: 3 })).toEqual(
      '9.775%',
    );
    expect(transformRatioToPercent(0.09775, { min: 2, max: 4 })).toEqual(
      '9.775%',
    );
    expect(transformRatioToPercent(0.0977599999, { min: 2, max: 5 })).toEqual(
      '9.776%',
    );
    expect(transformRatioToPercent(-0.0977599999, { min: 2, max: 5 })).toEqual(
      '-9.776%',
    );
    expect(transformRatioToPercent(0.09775, { min: 0, max: 0 })).toEqual('10%');
    expect(transformRatioToPercent(0.09, { min: 0, max: 2 })).toEqual('9%');
    expect(transformRatioToPercent(0.09)).toEqual('9%');
    expect(transformRatioToPercent(0.09, 2)).toEqual('9.00%');
  });
});

describe('drawInterval Test', () => {
  let s2: SpreadSheet;
  const dataCfg = assembleDataCfg({
    meta: [],
    fields: {
      columns: ['type', 'sub_type'],
      rows: ['province', 'city'],
      values: ['number'],
    },
    data,
  });

  const horizontalBorderWidth =
    getTheme({})?.dataCell?.cell?.horizontalBorderWidth ?? 1;

  const options = assembleOptions({
    style: {
      dataCell: {
        // 计算条形图的宽度时需要去掉 border width
        width: 100 + horizontalBorderWidth,
      },
    },
    conditions: {},
  });

  beforeEach(async () => {
    s2 = new PivotSheet(getContainer(), dataCfg, options);
    await s2.render();
  });

  test('should get right condition interval when only set fill', async () => {
    s2.setOptions({
      conditions: {
        interval: [
          {
            field: 'number',
            mapping() {
              return {
                fill: 'pink',
              };
            },
          },
        ],
      },
    });
    await s2.render();

    const cells = s2.facet
      .getCells()
      .filter(({ cellType }) => cellType === CellType.DATA_CELL);

    const allIntervalWidth = map(
      cells,
      (cell) => drawInterval(cell as DataCell)?.style?.width ?? 0,
    );

    expect(allIntervalWidth).toMatchSnapshot();
  });

  test('should get right condition interval when minValue and maxValue is custom', async () => {
    s2.setOptions({
      conditions: {
        interval: [
          {
            field: 'number',
            mapping() {
              return {
                fill: 'pink',
                isCompare: true,
                minValue: 0,
                maxValue: 400,
              };
            },
          },
        ],
      },
    });
    await s2.render();

    const cells = s2.facet
      .getCells()
      .filter(({ cellType }) => cellType === CellType.DATA_CELL);

    const firstIntervalInfo = drawInterval(cells[0] as DataCell);
    const lastIntervalInfo = drawInterval(cells[cells.length - 1] as DataCell);

    expect(firstIntervalInfo?.style.width).toEqual(undefined);
    expect(lastIntervalInfo?.style.width).toEqual(88);
  });

  test('should get right condition interval when filedValue is custom', async () => {
    s2.setOptions({
      conditions: {
        interval: [
          {
            field: 'number',
            mapping() {
              return {
                isCompare: true,
                minValue: 0,
                maxValue: 400,
                fieldValue: 200,
                fill: 'pink',
              };
            },
          },
        ],
      },
    });
    await s2.render();

    const cells = s2.facet
      .getCells()
      .filter(({ cellType }) => cellType === CellType.DATA_CELL);

    forEach(cells, (cell) => {
      const intervalInfo = drawInterval(cell as DataCell);

      expect(intervalInfo?.style.width).toEqual(50);
    });
  });
});
