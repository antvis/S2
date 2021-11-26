import React from 'react';
import ReactDOM from 'react-dom';
import { BaseTooltip } from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import insertCss from 'insert-css';
import '@antv/s2-react/dist/style.min.css';

const MyCustomTooltip = () => (
  <div className="tooltip-custom-component">custom tooltip</div>
);

class CustomTooltip extends BaseTooltip {
  constructor(spreadsheet) {
    super(spreadsheet);
  }

  renderContent() {
    ReactDOM.render(<MyCustomTooltip />, this.container);
  }

  show(options) {
    super.show(options);
    console.log('options: ', options);
  }

  hide() {
    super.hide();
    ReactDOM.unmountComponentAtNode(this.container);
    console.log('hide tooltip');
  }

  destroy() {
    super.destroy();
    ReactDOM.unmountComponentAtNode(this.container);
    console.log('destroy tooltip');
  }
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options = {
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
