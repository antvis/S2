import type { S2DataConfig } from '@antv/s2';
import type { G2Spec } from '@antv/g2';
import type { SheetComponentOptions } from '../../src';
import { intake } from './data-point';

export const chartOptions: SheetComponentOptions = {
  width: 1000,
  height: 1700,
  interaction: {
    hoverHighlight: false,
    hoverFocus: false,
    selectedCellsSpotlight: false,
  },
  style: {
    cellCfg: {
      height: 200,
    },
    layoutWidthType: 'colAdaptive',
  },
};

const sold = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 120 },
  { genre: 'Shooter', sold: 350 },
  { genre: 'Other', sold: 150 },
];

const commonEncode = {
  x: 'genre',
  y: 'sold',
  color: 'genre',
};

const getIntervalOptions = (coordinate: string, shape: string) => {
  return {
    type: 'interval',
    data: sold,
    coordinate: [{ type: coordinate }],
    encode: {
      ...commonEncode,
      shape,
    },
  } as G2Spec;
};

const getLineOptions = (coordinate: string, shape: string) => {
  return {
    type: 'line',
    data: sold,
    coordinate: [{ type: coordinate }],
    encode: {
      x: 'genre',
      y: 'sold',
      shape,
    },
  } as G2Spec;
};

const getPointOptions = (coordinate: string, shape: string): G2Spec => {
  return {
    type: 'point',
    data: intake,
    coordinate: [{ type: coordinate }],
    encode: {
      x: 'x',
      y: 'y',
      size: 'z',
      color: '#1890ff',
      shape,
    },
  } as G2Spec;
};

const getAreaOptions = (coordinate: string, shape: string) => {
  return {
    type: 'area',
    data: [
      { year: '1991', value: 0 },
      { year: '1992', value: 632 },
      { year: '1993', value: 432 },
      { year: '1994', value: 1941 },
      { year: '1995', value: 1532 },
      { year: '1996', value: 15588 },
      { year: '1997', value: 16514 },
      { year: '1998', value: 16572 },
      { year: '1999', value: 17765 },
    ],
    coordinate: [{ type: coordinate }],
    encode: {
      x: 'year',
      y: 'value',
      color: 'value',
      series: 'a',
      shape,
    },
    style: {
      gradient: true,
    },
  } as G2Spec;
};

export const chartSheetDataConfig: S2DataConfig = {
  fields: {
    columns: ['coordinate'],
    rows: ['mark', 'shape'],
    values: ['chart'],
    valueInCols: true,
  },
  data: [
    {
      coordinate: 'Cartesian',
      mark: 'Interval',
      shape: 'Rect',
      chart: getIntervalOptions('cartesian', 'rect'),
    },
    {
      coordinate: 'Transpose',
      mark: 'Interval',
      shape: 'Rect',
      chart: getIntervalOptions('transpose', 'rect'),
    },
    {
      coordinate: 'Polar',
      mark: 'Interval',
      shape: 'Rect',
      chart: getIntervalOptions('polar', 'rect'),
    },
    {
      coordinate: 'Radial',
      mark: 'Interval',
      shape: 'Rect',
      chart: getIntervalOptions('radial', 'rect'),
    },
    {
      coordinate: 'Cartesian',
      mark: 'Interval',
      shape: 'Hollow',
      chart: getIntervalOptions('cartesian', 'hollow'),
    },
    {
      coordinate: 'Transpose',
      mark: 'Interval',
      shape: 'Hollow',
      chart: getIntervalOptions('transpose', 'hollow'),
    },
    {
      coordinate: 'Polar',
      mark: 'Interval',
      shape: 'Hollow',
      chart: getIntervalOptions('polar', 'hollow'),
    },
    {
      coordinate: 'Radial',
      mark: 'Interval',
      shape: 'Hollow',
      chart: getIntervalOptions('radial', 'hollow'),
    },
    {
      coordinate: 'Cartesian',
      mark: 'Point',
      shape: 'Point',
      chart: getPointOptions('cartesian', 'point'),
    },
    {
      coordinate: 'Transpose',
      mark: 'Point',
      shape: 'Point',
      chart: getPointOptions('transpose', 'point'),
    },
    {
      coordinate: 'Polar',
      mark: 'Point',
      shape: 'Point',
      chart: getPointOptions('polar', 'point'),
    },
    {
      coordinate: 'Radial',
      mark: 'Point',
      shape: 'Point',
      chart: getPointOptions('radial', 'point'),
    },
    {
      coordinate: 'Cartesian',
      mark: 'Point',
      shape: 'Plus',
      chart: getPointOptions('cartesian', 'plus'),
    },
    {
      coordinate: 'Transpose',
      mark: 'Point',
      shape: 'Plus',
      chart: getPointOptions('transpose', 'plus'),
    },
    {
      coordinate: 'Polar',
      mark: 'Point',
      shape: 'Plus',
      chart: getPointOptions('polar', 'plus'),
    },
    {
      coordinate: 'Radial',
      mark: 'Point',
      shape: 'Plus',
      chart: getPointOptions('radial', 'plus'),
    },
    {
      coordinate: 'Cartesian',
      mark: 'Line',
      shape: 'Line',
      chart: getLineOptions('cartesian', 'line'),
    },
    {
      coordinate: 'Transpose',
      mark: 'Line',
      shape: 'Line',
      chart: getLineOptions('transpose', 'line'),
    },
    {
      coordinate: 'Polar',
      mark: 'Line',
      shape: 'Line',
      chart: getLineOptions('polar', 'line'),
    },
    {
      coordinate: 'Radial',
      mark: 'Line',
      shape: 'Line',
      chart: getLineOptions('radial', 'line'),
    },
    {
      coordinate: 'Cartesian',
      mark: 'Area',
      shape: 'Area',
      chart: getAreaOptions('cartesian', 'area'),
    },
    {
      coordinate: 'Transpose',
      mark: 'Area',
      shape: 'Area',
      chart: getAreaOptions('transpose', 'area'),
    },
    {
      coordinate: 'Polar',
      mark: 'Area',
      shape: 'Area',
      chart: getAreaOptions('polar', 'area'),
    },
    {
      coordinate: 'Radial',
      mark: 'Area',
      shape: 'Area',
      chart: getAreaOptions('radial', 'area'),
    },
    {
      coordinate: 'Cartesian',
      mark: 'Area',
      shape: 'Step',
      chart: getAreaOptions('cartesian', 'step'),
    },
    {
      coordinate: 'Transpose',
      mark: 'Area',
      shape: 'Step',
      chart: getAreaOptions('transpose', 'step'),
    },
    {
      coordinate: 'Polar',
      mark: 'Area',
      shape: 'Step',
      chart: getAreaOptions('polar', 'step'),
    },
    {
      coordinate: 'Radial',
      mark: 'Area',
      shape: 'Step',
      chart: getAreaOptions('radial', 'step'),
    },
  ],
};
