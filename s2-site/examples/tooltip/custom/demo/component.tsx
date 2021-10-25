import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2';
import insertCss from 'insert-css';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/d62448ea-1f58-4498-8f76-b025dd53e570.json',
)
  .then((res) => res.json())
  .then((data) => {
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price'],
      },
      data,
    };
    const TooltipComponent = (
      <div className="tooltip-custom-component">tooltipComponent</div>
    );
    const RowTooltip = (
      <div className="tooltip-custom-component">rowTooltip</div>
    );

    const s2options = {
      width: 600,
      height: 300,
      tooltip: {
        tooltipComponent: TooltipComponent,
        row: {
          tooltipComponent: RowTooltip,
        },
      },
    };
    const TooltipComponentDemo = () => {
      return (
        <div>
          <SheetComponent
            sheetType={'pivot'}
            adaptive={false}
            dataCfg={s2DataConfig}
            options={s2options}
          />
        </div>
      );
    };

    ReactDOM.render(<TooltipComponentDemo />, document.getElementById('container'));
  });

insertCss(`
  .tooltip-custom-component {
    padding: 12px;
    height: 50px;
  }
`);
