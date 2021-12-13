import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

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
        row: {
          showTooltip: false,
        },
      },
    };

    const CustomTooltip = () => <div>demo</div>;

    const onColCellClick = (value) => {
      if (!value?.viewMeta) {
        return;
      }
      const { spreadsheet, id } = value.viewMeta;
      if (id === 'root[&]家具') {
        const position = {
          x: value.event.clientX,
          y: value.event.clientY,
        };
        spreadsheet.tooltip.show({
          position,
          content: <CustomTooltip />,
        });
      } else {
        spreadsheet.hideTooltip();
      }
    };

    ReactDOM.render(
      <SheetComponent
        sheetType="pivot"
        adaptive={false}
        dataCfg={dataCfg}
        options={s2Options}
        onColCellClick={onColCellClick}
      />,
      document.getElementById('container'),
    );
  });
