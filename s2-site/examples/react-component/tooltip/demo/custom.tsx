import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2-react';
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
        values: ['price', 'cost'],
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
      data,
    };
    const TooltipComponent = (
      <div className="tooltip-custom-component">tooltipComponent</div>
    );
    const RowTooltip = (
      <div className="tooltip-custom-component">rowTooltip</div>
    );

    const s2Options = {
      width: 600,
      height: 480,
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
            options={s2Options}
          />
        </div>
      );
    };

    ReactDOM.render(
      <TooltipComponentDemo />,
      document.getElementById('container'),
    );
  });

insertCss(`
  .tooltip-custom-component {
    padding: 12px;
    height: 50px;
  }
`);
