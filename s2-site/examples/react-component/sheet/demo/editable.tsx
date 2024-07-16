/* eslint-disable no-console */
// organize-imports-ignore
import console from 'console';
import React from 'react';
import { S2DataConfig } from '@antv/s2';
import {
  SheetComponent,
  SheetComponentOptions,
  type SheetComponentsProps,
} from '@antv/s2-react';

fetch('https://assets.antv.antgroup.com/s2/basic-table-mode.json')
  .then((res) => res.json())
  .then((res) => {
    const s2DataConfig: S2DataConfig = {
      fields: {
        columns: ['province', 'city', 'type', 'price', 'cost'],
      },
      meta: [
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
          name: '商品类别',
        },
        {
          field: 'price',
          name: '价格',
        },
        {
          field: 'cost',
          name: '成本',
        },
      ],
      data: res,
    };

    const s2Options: SheetComponentOptions = {
      width: 480,
      height: 480,
      seriesNumber: {
        enable: true,
      },
      frozen: {
        // 行头冻结数量
        rowCount: 1,
        // 列头冻结数量
        colCount: 1,
        // 行尾冻结数量
        trailingRowCount: 1,
        // 列尾冻结数量
        trailingColCount: 1,
      },
    };

    const onDataCellEditStart: SheetComponentsProps['onDataCellEditStart'] = (
      meta,
      cell,
    ) => {
      console.log('onDataCellEditStart:', meta, cell);
    };

    const onDataCellEditEnd: SheetComponentsProps['onDataCellEditEnd'] = (
      meta,
      cell,
    ) => {
      console.log('onDataCellEditEnd:', meta, cell);
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(
        <SheetComponent
          dataCfg={s2DataConfig}
          options={s2Options}
          sheetType="editable"
          onDataCellEditStart={onDataCellEditStart}
          onDataCellEditEnd={onDataCellEditEnd}
        />,
      );
  });
