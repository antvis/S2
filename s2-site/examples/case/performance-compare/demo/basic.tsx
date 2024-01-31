import { S2DataConfig } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { compact } from 'lodash';
import React from 'react';

const disableColor = '#d3d7d4';
const colors = [
  '#62BF7F',
  '#8ECB7D',
  '#A1D17F',
  '#C9DC81',
  '#FBDD80',
  '#FBB17B',
  '#FA8672',
  '#FB6A6D',
];

function getRange(data) {
  const values = data.map((d) => d.value);
  const compactValue = compact(values);

  return {
    min: Math.min(...compactValue),
    max: Math.max(...compactValue),
  };
}

function getIndex(fieldValue: number, rawData: S2DataConfig['data']) {
  const { min, max } = getRange(rawData);
  const step = Math.floor((max - min) / (colors.length - 1));

  return Math.floor((fieldValue - min) / step);
}

function getDataConfig(rawData: S2DataConfig['data']): S2DataConfig {
  return {
    fields: {
      rows: ['size', 'name'],
      columns: ['time'],
      values: ['value'],
    },
    meta: [
      {
        field: 'size',
        name: '数据规模',
      },
      {
        field: 'name',
        name: '框架名称',
      },
      {
        field: 'time',
        name: '实验次数',
      },
      {
        field: 'value',
        name: '渲染时间',
      },
    ],
    data: rawData,
  };
}

function getOptions(rawData: S2DataConfig['data']): SheetComponentOptions {
  return {
    width: 800, 
    height: 200,
    interaction: {
      selectedCellsSpotlight: false,
      hoverHighlight: false,
    },
    conditions: {
      background: [
        {
          field: 'value',
          mapping(fieldValue) {
            const index = getIndex(fieldValue, rawData);

            return {
              fill: fieldValue ? colors[index] : disableColor,
            };
          },
        },
      ],
    },
  };
}

fetch('https://render.alipay.com/p/yuyan/180020010001215413/s2/performance.json')
  .then((res) => res.json())
  .then((data) => {
    reactDOMClient.createRoot(document.getElementById('container')).render(
      <div>
        <h3>1000 数据规模表格渲染时间对比</h3>
        <SheetComponent
          dataCfg={getDataConfig(data['1000'])}
          options={getOptions(data['1000'])}
          sheetType="pivot"
        />
        <h3>10,000 数据规模表格渲染时间对比</h3>
        <SheetComponent
          dataCfg={getDataConfig(data['10000'])}
          options={getOptions(data['10000'])}
          sheetType="pivot"
        />
        <h3>1,000,000 数据规模表格渲染时间对比</h3>
        <SheetComponent
          dataCfg={getDataConfig(data['1000000'])}
          options={getOptions(data['1000000'])}
          sheetType="pivot"
        />
      </div>,
    );
  });
