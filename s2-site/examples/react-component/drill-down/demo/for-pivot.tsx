// organize-imports-ignore
import React from 'react';
import { ORIGIN_FIELD, S2DataConfig } from '@antv/s2';
import { DrillDown } from '@antv/s2-react-components';
import {
  SheetComponent,
  SheetComponentOptions,
  SheetComponentProps,
} from '@antv/s2-react';
import '@antv/s2-react/dist/s2-react.min.css';
import '@antv/s2-react-components/dist/s2-react-components.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then((res) => {
    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
      hierarchyType: 'tree',
    };

    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      meta: res.meta,
      data: res.data,
    };

    const sex = ['男', '女'];

    const PartDrillDown: SheetComponentProps['partDrillDown'] = {
      // 指定下钻配置面板
      render: (props) => <DrillDown {...props} />,
      drillConfig: {
        dataSet: [
          {
            name: '客户性别',
            value: 'sex',
            type: 'text',
          },
        ],
      },
      fetchData: (meta, drillFields) =>
        new Promise((resolve) => {
          // 弹窗 -> 选择 -> 请求数据
          const dataSet = meta.spreadsheet.dataSet;
          const field = drillFields[0];

          const rowData = dataSet
            .getCellMultiData({
              query: meta.query,
            })
            .filter(
              (item) =>
                item.getValueByField('type') &&
                item.getValueByField('sub_type'),
            );

          const drillDownData = [];

          rowData.forEach((data) => {
            const { number, sub_type: subType, type } = data[ORIGIN_FIELD];
            const number0 = Math.ceil(Math.random() * (number - 50)) + 50;
            const number1 = number - number0;

            const dataItem0 = {
              ...meta.query,
              type,
              sub_type: subType,
              number: number0,
              [field]: sex[0],
            };

            drillDownData.push(dataItem0);

            const dataItem1 = {
              ...meta.query,
              type,
              sub_type: subType,
              number: number1,
              [field]: sex[1],
            };

            drillDownData.push(dataItem1);
          });

          resolve({
            drillField: field,
            drillData: drillDownData,
          });
        }),
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(
        <SheetComponent
          dataCfg={s2DataConfig}
          options={s2Options}
          partDrillDown={PartDrillDown}
          adaptive={false}
        />,
      );
  });
