// organize-imports-ignore
import React from 'react';
import { S2DataConfig, S2Options } from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/s2-react.min.css';

const s2Options: S2Options = {
  width: 1000,
  height: 900,
  style: {
    colCell: {
      hideValue: true,
    },
    rowCell: {
      width: 100,
    },
    // 适当增加单元格宽高, 以便于展示 G2 图表
    dataCell: {
      width: 350,
      height: 400,
    },
  },
};

const s2DataConfig: S2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
  },
  meta: [
    {
      field: 'number',
      name: '数据',
    },
    {
      field: 'province',
      name: '省份',
    },
    {
      field: 'city',
      name: '城市',
    },
    {
      field: 'type',
      name: '类别',
    },
    {
      field: 'sub_type',
      name: '子类别',
    },
  ],
  // 数据源类型为 https://s2.antv.antgroup.com/api/general/s2-data-config#multidata 支持`普通数值单元格`和`图表单元格` 共存.
  data: [
    // 普通数据
    {
      number: {
        // 折线图
        values: {
          type: 'line',
          autoFit: true,
          data: {
            type: 'fetch',
            value: 'https://assets.antv.antgroup.com/g2/indices.json',
          },
          encode: {
            x: (d: Record<string, string | number>) => new Date(d['Date']),
            y: 'Close',
            color: 'Symbol',
          },
          transform: [{ type: 'normalizeY', basis: 'first', groupBy: 'color' }],
          scale: { y: { type: 'log' } },
          axis: { y: { title: '↑ Change in price (%)' } },
          labels: [{ text: 'Symbol', selector: 'last', fontSize: 10 }],
          tooltip: { items: [{ channel: 'y', valueFormatter: '.1f' }] },
        },
      },
      province: '浙江省',
      city: '杭州市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: {
        // 玉玦图
        values: {
          type: 'interval',
          autoFit: true,
          data: [
            { question: '问题 1', percent: 0.21 },
            { question: '问题 2', percent: 0.4 },
            { question: '问题 3', percent: 0.49 },
            { question: '问题 4', percent: 0.52 },
            { question: '问题 5', percent: 0.53 },
            { question: '问题 6', percent: 0.84 },
            { question: '问题 7', percent: 1 },
            { question: '问题 8', percent: 1.2 },
          ],
          encode: { x: 'question', y: 'percent', color: 'percent' },
          scale: { color: { range: '#BAE7FF-#1890FF-#0050B3' } },
          coordinate: {
            type: 'radial',
            innerRadius: 0.1,
            endAngle: 3.141592653589793,
          },
          style: { stroke: 'white' },
          animate: { enter: { type: 'waveIn', duration: 800 } },
          // animate: false,
          legend: {
            color: {
              length: 400,
              position: 'bottom',
              layout: { justifyContent: 'center' },
            },
          },
        },
      },
      province: '浙江省',
      city: '杭州市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: {
        // 柱形图
        values: {
          type: 'interval',
          autoFit: true,
          data: [
            { genre: 'Sports', sold: 275 },
            { genre: 'Strategy', sold: 115 },
            { genre: 'Action', sold: 120 },
            { genre: 'Shooter', sold: 350 },
            { genre: 'Other', sold: 150 },
          ],
          scale: {
            color: {
              guide: {
                position: 'right',
                size: 80,
              },
            },
          },
          encode: {
            x: 'genre',
            y: 'sold',
            color: 'genre',
          },
        },
      },
      province: '浙江省',
      city: '舟山市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: {
        // G2 图表数据 (Spec) https://g2.antv.antgroup.com/examples/general/interval/#column
        values: {
          type: 'view',
          autoFit: true,
          padding: 0,
          axis: false,
          children: [
            {
              type: 'image',
              style: {
                src: 'https://gw.alipayobjects.com/zos/rmsportal/NeUTMwKtPcPxIFNTWZOZ.png',
                x: '50%',
                y: '50%',
                width: '100%',
                height: '100%',
              },
              tooltip: false,
            },
            {
              type: 'heatmap',
              data: {
                type: 'fetch',
                value: 'https://assets.antv.antgroup.com/g2/heatmap.json',
              },
              encode: { x: 'g', y: 'l', color: 'tmp' },
              style: { opacity: 0 },
              tooltip: false,
            },
          ],
        },
      },
      province: '浙江省',
      city: '舟山市',
      type: '办公用品',
      sub_type: '笔',
    },
  ],
};

reactDOMClient
  .createRoot(document.getElementById('container'))
  .render(
    <SheetComponent
      sheetType="chart"
      dataCfg={s2DataConfig}
      options={s2Options}
    />,
  );
