import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2-react';
import insertCss from 'insert-css';
import '@antv/s2-react/dist/style.min.css';

fetch(
  'https://render.alipay.com/p/yuyan/180020010001215413/s2/total-group.json',
)
  .then((res) => res.json())
  .then((data) => {
    const s2Options = {
      width: 600,
      height: 480,
    };

    const fields = {
      rows: ['province', 'city'],
      columns: ['type'],
      values: ['price', 'cost'],
    };

    const SwitcherDemo = () => {
      return (
        <div>
          <SheetComponent
            sheetType={'pivot'}
            adaptive={false}
            dataCfg={{ data, fields }}
            options={s2Options}
            header={{ switcherCfg: { open: true } }}
          />
        </div>
      );
    };

    ReactDOM.render(<SwitcherDemo />, document.getElementById('container'));
  });

insertCss(`
  .antv-s2-switcher-item.checkable-item {
    align-items: center;
  }
`);
