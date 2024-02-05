import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import insertCSS from 'insert-css';
import React from 'react';

fetch(
  'https://render.alipay.com/p/yuyan/180020010001215413/s2/total-group.json',
)
  .then((res) => res.json())
  .then((data) => {
    const s2Options: SheetComponentOptions = {
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
            header={{ switcher: { open: true } }}
          />
        </div>
      );
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(<SwitcherDemo />);
  });

insertCSS(`
  .antv-s2-switcher-item.checkable-item {
    align-items: center;
  }
`);
