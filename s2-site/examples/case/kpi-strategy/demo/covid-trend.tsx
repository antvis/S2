import React from 'react';
import ReactDOM from 'react-dom';
import { isNil } from 'lodash';
import { isUpDataValue } from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

// 数据来源：https://voice.baidu.com/act/newpneumonia/newpneumonia/?from=osari_pc_1&city=%E5%9B%9B%E5%B7%9D-%E5%9B%9B%E5%B7%9D
fetch(
  'https://gw.alipayobjects.com/os/antfincdn/AaxWQTWBO/sichuan-covid-trend.json',
)
  .then((res) => res.json())
  .then((s2DataCfg) => {
    const s2Options = {
      width: 1200,
      height: 600,
      placeholder: '',
      style: {
        cellCfg: {
          height: 60,
        },
        colCfg: {
          widthByFieldValue: { 近14日趋势图: 300 },
        },
      },
      conditions: {
        text: [
          {
            mapping: (value, cellInfo) => {
              const { meta } = cellInfo;
              const isNilValue = isNil(value) || value === '';

              if (meta?.fieldValue?.values[0][0] === value || isNilValue) {
                return {
                  fill: '#000',
                };
              }
              return {
                fill: isUpDataValue(value) ? '#FF4D4F' : '#29A294',
              };
            },
          },
        ],
        icon: [
          {
            position: 'right',
            mapping(value, cellInfo) {
              const { meta } = cellInfo;
              const isNilValue = isNil(value) || value === '';

              if (meta?.fieldValue?.values[0][0] === value || isNilValue) {
                return {};
              }
              return isUpDataValue(value)
                ? {
                    // icon 用于指定图标条件格式所使用的 icon 类型
                    icon: 'CellUp',
                    fill: '#FF4D4F',
                  }
                : {
                    icon: 'CellDown',
                    fill: '#29A294',
                  };
            },
          },
        ],
      },
    };

    ReactDOM.render(
      <SheetComponent
        dataCfg={s2DataCfg}
        options={s2Options}
        sheetType="strategy"
      />,
      document.getElementById('container'),
    );
  });
