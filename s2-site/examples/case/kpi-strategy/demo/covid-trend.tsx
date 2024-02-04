import React from 'react';
import { isNil } from 'lodash';
import { isUpDataValue } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

// 临时处理老数据格式
function process(children) {
  return children.map((item) => {
    return {
      ...item,
      field: item.key,
      children: process(item.children),
    };
  });
}

// 数据来源：https://voice.baidu.com/act/newpneumonia/newpneumonia/?from=osari_pc_1&city=%E5%9B%9B%E5%B7%9D-%E5%9B%9B%E5%B7%9D
fetch(
  'https://gw.alipayobjects.com/os/antfincdn/AaxWQTWBO/sichuan-covid-trend.json',
)
  .then((res) => res.json())
  .then((s2DataCfg) => {
    const s2Options: SheetComponentOptions = {
      width: 1200,
      height: 600,
      placeholder: '',
      hierarchyType: 'tree',
      cornerText: '指标',
      style: {
        rowCell: {
          height: 60,
        },
        colCell: {
          width: (node) => {
            return node?.value === '近14日趋势图' ? 300 : null;
          },
        },
      },
      conditions: {
        text: [
          {
            mapping: (value, cellInfo) => {
              const { colIndex } = cellInfo || {};
              const isNilValue = isNil(value) || value === '';

              if (colIndex === 0 || isNilValue) {
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
              const { colIndex } = cellInfo || {};
              const isNilValue = isNil(value) || value === '';

              if (colIndex === 0 || isNilValue) {
                return null;
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

    reactDOMClient.createRoot(document.getElementById('container')).render(
      <SheetComponent
        dataCfg={{
          ...s2DataCfg,
          fields: {
            ...s2DataCfg.fields,
            rows: process(s2DataCfg.fields.customTreeItems),
          },
        }}
        options={s2Options}
        sheetType="strategy"
      />,
    );
  });
