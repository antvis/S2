import { S2DataConfig, isUpDataValue } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import { isNil } from 'lodash';
import React from 'react';
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

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/3c2009ce-8c2a-451d-b29a-619a796c7903.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2DataConfig: S2DataConfig = {
      ...dataCfg,
      fields: {
        ...dataCfg.fields,
        rows: process(dataCfg.fields.customTreeItems),
      },
      meta: [
        // 日期列头 格式化
        {
          field: 'date',
          name: '时间',
          formatter: (value) => `${value}年`,
        },
        // 同环比名称(虚拟列头) 格式化
        // {
        //   field: EXTRA_COLUMN_FIELD,
        //   formatter: (value, data, meta) => {
        //     console.log(data, meta);
        //     return meta?.colIndex === 0 ? '自定义标题' : value;
        //   },
        // },
      ],
    };

    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
      cornerText: '指标层级',
      headerActionIcons: [
        {
          icons: ['Trend'],
          belongsCell: 'rowCell',
          defaultHide: true,
          onClick: (params) => {
            console.log('trend icon click:', params);
          },
          onHover: (params) => {
            console.log('trend icon hover:', params);
          },
        },
      ],
      conditions: {
        text: [
          {
            mapping: (value, cellInfo) => {
              const { colIndex } = cellInfo;
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
            field: 'number',
            position: 'left',
            mapping(value, cellInfo) {
              const { colIndex } = cellInfo;

              if (colIndex === 0) {
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
      style: {
        dataCell: {
          valuesCfg: {
            // 非必填: 指定原始字段, 用于 导出和 tooltip 展示
            originalValueField: 'originalValues',
            // 非必填: 是否显示原始值
            showOriginalValue: true,
          },
        },
      },
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(
        <SheetComponent
          sheetType="strategy"
          dataCfg={s2DataConfig}
          options={s2Options}
        />,
      );
  });
