import React from 'react';
import ReactDOM from 'react-dom';
import { BaseTooltip } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import insertCss from 'insert-css';
import '@antv/s2-react/dist/style.min.css';

const MyCustomTooltipContent = () => (
  <div className="tooltip-custom-component">我是自定义 tooltip 内容</div>
);

class CustomTooltip extends BaseTooltip {
  constructor(spreadsheet) {
    super(spreadsheet);
  }

  renderContent() {
    ReactDOM.render(<MyCustomTooltipContent />, this.container);
  }

  show(options) {
    super.show(options);
    console.log('options: ', options);
  }

  destroy() {
    console.log('tooltip destroy');

    super.destroy();
    if (this.container) {
      ReactDOM.unmountComponentAtNode(this.container);
    }
  }
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
      tooltip: {
        showTooltip: true,
        renderTooltip: (spreadsheet) => new CustomTooltip(spreadsheet),
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
