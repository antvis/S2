import { BaseTooltip } from '@antv/s2';
import {
  SheetComponent,
  SheetComponentOptions,
  TooltipOperatorMenuOptions,
} from '@antv/s2-react';
import insertCSS from 'insert-css';
import React from 'react';
import '@antv/s2-react/dist/style.min.css';

const MyCustomTooltipContent = () => (
  <div className="tooltip-custom-component">我是自定义 tooltip 内容</div>
);

class CustomTooltip extends BaseTooltip<
  React.ReactNode,
  TooltipOperatorMenuOptions
> {
  constructor(spreadsheet) {
    super(spreadsheet);
  }

  root: ReactDOM.Root;

  renderContent() {
    this.root ??= reactDOMClient.createRoot(this.container!);
    this.root.render(<MyCustomTooltipContent />);
  }

  show(options) {
    super.show(options);
    console.log('options: ', options);
  }

  destroy() {
    console.log('tooltip destroy');

    this.unmount();
    super.destroy();
  }

  unmount() {
    // https://github.com/facebook/react/issues/25675#issuecomment-1363957941
    Promise.resolve().then(() => {
      this.root?.unmount();
    });
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
        enable: true,
        render: (spreadsheet) => new CustomTooltip(spreadsheet),
      },
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(
        <SheetComponent
          sheetType="pivot"
          adaptive={false}
          dataCfg={dataCfg}
          options={s2Options}
        />,
      );
  });

insertCSS(`
  .tooltip-custom-component {
    padding: 12px;
    height: 50px;
  }
`);
