import React from 'react';
import {
  SheetComponent,
  SheetComponentOptions,
  SheetComponentsProps,
} from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { S2DataConfig } from '@antv/s2';

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

    const PartDrillDown: SheetComponentsProps['partDrillDown'] = {
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
          const dataSet = meta.spreadsheet.dataSet;
          const field = drillFields[0];
          const rowData = dataSet.getCellMultiData({ query: meta.query });
          const drillDownData = [];

          rowData.forEach((data) => {
            const { city, number, province, sub_type: subType, type } = data;
            const number0 = Math.ceil(Math.random() * (number - 50)) + 50;
            const number1 = number - number0;
            const dataItem0 = {
              city,
              number: number0,
              province,
              sub_type: subType,
              type,
              [field]: sex[0],
            };

            drillDownData.push(dataItem0);
            const dataItem1 = {
              city,
              number: number1,
              province,
              sub_type: subType,
              type,
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
