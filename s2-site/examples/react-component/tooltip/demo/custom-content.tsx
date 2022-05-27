import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2-react';
import insertCss from 'insert-css';
import '@antv/s2-react/dist/style.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const CustomTooltip = (
      <div className="tooltip-custom-component">content</div>
    );
    const RowTooltip = (
      <div className="tooltip-custom-component">rowTooltip</div>
    );

    const s2Options = {
      width: 600,
      height: 480,
      tooltip: {
        content: CustomTooltip,
        row: {
          content: RowTooltip,
        },
      },
    };

    ReactDOM.render(
      <SheetComponent
        sheetType="pivot"
        adaptive={false}
        dataCfg={dataCfg}
        options={s2Options}
      />,
      document.getElementById('container'),
    );
  });

insertCss(`
  .tooltip-custom-component {
    padding: 12px;
    height: 50px;
  }
`);
