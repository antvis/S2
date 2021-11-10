import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then((res) => {
    const s2options = {
      width: 600,
      height: 600,
      enableCopy: true,
    };

    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      meta: res.meta,
      data: res.data,
    };

    const header = {
      title: '表头标题',
      description: '表头描述',
      exportCfg: { open: true },
      advancedSortCfg: { open: true },
      extra: [<button style={{ verticalAlign: 'top' }}> 插入内容 </button>],
    };

    ReactDOM.render(
      <SheetComponent
        dataCfg={s2DataConfig}
        options={s2options}
        header={header}
        adaptive={false}
      />,
      document.getElementById('container'),
    );
  });
