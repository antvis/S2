import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';
import { SheetComponent } from '@antv/s2-react';
import insertCss from 'insert-css';
import '@antv/s2-react/dist/style.min.css';

const CustomTooltip = <div className="tooltip-custom-component">content</div>;

const RowTooltip = ({ title }) => (
  <div className="tooltip-custom-component">{title}</div>
);

const ColTooltip = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="tooltip-custom-component">
      <Button
        onClick={() => {
          setOpen(!open);
        }}
      >
        切换
      </Button>
      <span style={{ marginLeft: 4 }}>
        {open ? 'colTooltip1' : 'colTooltip2'}
      </span>
    </div>
  );
};

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options = {
      width: 600,
      height: 480,
      tooltip: {
        content: CustomTooltip,
        row: {
          content: (cell, defaultTooltipShowOptions) => {
            console.log('当前单元格：', cell);
            console.log('默认 tooltip 详细信息：', defaultTooltipShowOptions);

            const meta = cell.getMeta();

            return <RowTooltip title={meta.label} />;
          },
        },
        col: {
          content: <ColTooltip />,
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
