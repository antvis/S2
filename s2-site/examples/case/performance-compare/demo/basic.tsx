import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

const colors = ['#62BF7F', '#8ECB7D', '#A1D17F', '#C9DC81', '#FBDD80', '#FBB17B', '#FA8672', '#FB6A6D'];

function getRange(data) {
  const values = data.map(d => d.value);
  return {
    min: Math.min(...values),
    max:Math.max(...values),
  }
};
function getIndex(fieldValue, rawData) {
  const { min, max } = getRange(rawData);
  const step = Math.floor((max - min) / (colors.length - 1));
  return Math.floor((fieldValue - min) / step);
}

fetch('../data/compare.json')
  .then((res) => res.json())
  .then((data) => {
    const rawData = data["1000"];
    const s2DataConfig = {
      fields: {
        rows: ['size', 'name'],
        columns: ['time'],
        values: ['value'],
      },
      meta: [{
        field: 'size',
        name: '数据规模',
      }, {
        field: 'name',
        name: '框架名称',
      }, {
        field: 'time',
        name: '实验次数',
      }, {
        field: 'value',
        name: '渲染时间',
      }],
      data: rawData,
    };

    const s2options = {
      width: 800,
      height: 600,
      interaction: {
        selectedCellsSpotlight: false,
        hoverHighlight: false,
      },
      conditions: {
        background: [{
          field: "value",
          mapping(fieldValue, data) {
            const index = getIndex(fieldValue, rawData);
            console.log(index);
            return {
              fill: colors[index]
            }
          }
        }]
      }
    };

    ReactDOM.render(
      <SheetComponent
        dataCfg={s2DataConfig}
        options={s2options}
        sheetType="pivot"
      />,
      document.getElementById('container'),
    );
  });
