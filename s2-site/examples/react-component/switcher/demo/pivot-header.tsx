import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import insertCss from 'insert-css';
import React from 'react';
import ReactDOM from 'react-dom/client';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/6eede6eb-8021-4da8-bb12-67891a5705b7.json',
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
            header={{ switcherCfg: { open: true } }}
          />
        </div>
      );
    };

    ReactDOM.createRoot(document.getElementById('container')).render(
      <SwitcherDemo />,
    );
  });

insertCss(`
  .antv-s2-switcher-item.checkable-item {
    align-items: center;
  }
`);
