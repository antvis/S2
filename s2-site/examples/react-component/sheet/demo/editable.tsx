import { SheetComponent } from '@antv/s2-react';
import React from 'react';
import ReactDOM from 'react-dom';

fetch('https://assets.antv.antgroup.com/s2/basic-table-mode.json')
  .then((res) => res.json())
  .then((res) => {
    const s2DataConfig = {
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

    const s2Options = {
      width: 480,
      height: 480,
      showSeriesNumber: true,
      frozenRowCount: 1, // 行头冻结数量
      frozenColCount: 1, // 列头冻结数量
      frozenTrailingRowCount: 1, // 列尾冻结数量
      frozenTrailingColCount: 1, // 列尾冻结数量
    };

    const onDataCellEditEnd = (meta) => {
      console.log('onDataCellEditEnd', meta);
    };

    ReactDOM.render(
      <SheetComponent
        dataCfg={s2DataConfig}
        options={s2Options}
        sheetType="editable"
        onDataCellEditEnd={onDataCellEditEnd}
      />,
      document.getElementById('container'),
    );
  });
